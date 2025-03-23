import { supabase } from '../lib/supabase';
import { Channel, ChannelType } from '../types/channel';

interface CreateChannelInput {
  name: string;
  description: string;
  avatar_url?: string;
  banner_url?: string;
  type: ChannelType;
  visibility: 'public' | 'private' | 'followers';
  category: string;
  language: string;
  audience: 'general' | 'kids' | 'adult';
  settings: ChannelSettings;
  social_links: Record<string, string>;
  tags?: string[];
}

interface ChannelSettings {
  allow_comments: boolean;
  allow_live_streams: boolean;
  allow_shorts: boolean;
  theme: 'light' | 'dark' | 'auto';
  two_factor_auth: boolean;
  custom_url?: string;
}

class ChannelService {
  async uploadFile(file: File, path: string, type: 'avatar' | 'banner') {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        throw new Error('User not authenticated');
      }

      const bucket = type === 'avatar' ? 'avatars' : 'banners';
      console.log('Uploading file to bucket:', bucket, 'Path:', path);
      
      // Try to upload the file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully, getting public URL');
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      console.log('Public URL:', publicUrl);
      return { data: { publicUrl }, error: null };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  async getCurrentUserChannel() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting user channel:', error);
      return { data: null, error };
    }
  }

  async getChannels(filters?: {
    search?: string;
    category?: string;
    language?: string;
    type?: string;
    sort_by?: 'popular' | 'recent' | 'active' | 'recommended';
    status?: ('live' | 'new' | 'verified')[];
  }) {
    let query = supabase.from('channels').select('*');

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.language) {
      query = query.eq('language', filters.language);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.status?.length) {
      const statusFilters = filters.status.map(status => {
        switch (status) {
          case 'live':
            return { is_live: true };
          case 'new':
            return { is_new: true };
          case 'verified':
            return { is_verified: true };
          default:
            return {};
        }
      });

      query = query.or(statusFilters.map(f => Object.entries(f).map(([k, v]) => `${k}.eq.${v}`).join(',')).join(','));
    }

    const { data, error } = await query;
    return { data, error };
  }

  async getChannel(id: string) {
    const { data, error } = await supabase
      .from('channels')
      .select('*, channel_settings(*), channel_social_links(*), channel_tags(tags(name))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  }

  async createChannel(input: CreateChannelInput) {
    try {
      // 1. Insert channel basic info
      const { data: channel, error: channelError } = await supabase
        .from('channels')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          name: input.name,
          description: input.description,
          avatar_url: input.avatar_url,
          banner_url: input.banner_url,
          type: input.type,
          visibility: input.visibility,
          category: input.category,
          language: input.language,
          audience: input.audience,
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // 2. Insert channel settings
      const { error: settingsError } = await supabase
        .from('channel_settings')
        .insert({
          channel_id: channel.id,
          allow_comments: input.settings.allow_comments,
          allow_live_streams: input.settings.allow_live_streams,
          allow_shorts: input.settings.allow_shorts,
          theme: input.settings.theme,
          two_factor_auth: input.settings.two_factor_auth,
          custom_url: input.settings.custom_url,
        });

      if (settingsError) throw settingsError;

      // 3. Insert social links
      const { error: socialLinksError } = await supabase
        .from('channel_social_links')
        .insert({
          channel_id: channel.id,
          instagram: input.social_links.instagram,
          tiktok: input.social_links.tiktok,
          twitter: input.social_links.twitter,
          discord: input.social_links.discord,
          email: input.social_links.email,
          website: input.social_links.website,
        });

      if (socialLinksError) throw socialLinksError;

      // 4. Insert tags
      if (input.tags?.length) {
        // First, ensure all tags exist
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', input.tags);

        const existingTagNames = existingTags?.map(tag => tag.name) || [];
        const newTags = input.tags.filter(name => !existingTagNames.includes(name));

        // Insert new tags
        if (newTags.length > 0) {
          const { error: newTagsError } = await supabase
            .from('tags')
            .insert(newTags.map(name => ({ name })));

          if (newTagsError) throw newTagsError;
        }

        // Get all tag IDs (both existing and newly created)
        const { data: allTags, error: allTagsError } = await supabase
          .from('tags')
          .select('id')
          .in('name', input.tags);

        if (allTagsError) throw allTagsError;

        // Link tags to channel
        const { error: channelTagsError } = await supabase
          .from('channel_tags')
          .insert(allTags?.map(tag => ({
            channel_id: channel.id,
            tag_id: tag.id
          })) || []);

        if (channelTagsError) throw channelTagsError;
      }

      return channel;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  }

  async updateChannel(channelId: string, updates: Partial<Channel>) {
    const { data, error } = await supabase
      .from('channels')
      .update(updates)
      .eq('id', channelId)
      .select()
      .single();

    return { data, error };
  }

  async deleteChannel(channelId: string) {
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId);

    return { error };
  }

  async followChannel(channelId: string, userId: string) {
    const { data, error } = await supabase
      .from('channel_followers')
      .insert([{ channel_id: channelId, user_id: userId }])
      .select()
      .single();

    return { data, error };
  }

  async unfollowChannel(channelId: string, userId: string) {
    const { error } = await supabase
      .from('channel_followers')
      .delete()
      .match({ channel_id: channelId, user_id: userId });

    return { error };
  }
}

export const channelService = new ChannelService();
