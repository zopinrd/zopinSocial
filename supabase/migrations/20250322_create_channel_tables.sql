-- Create enum types
CREATE TYPE channel_type AS ENUM ('personal', 'brand', 'community', 'store');
CREATE TYPE channel_visibility AS ENUM ('public', 'private', 'followers');
CREATE TYPE channel_theme AS ENUM ('light', 'dark', 'auto');
CREATE TYPE audience_type AS ENUM ('general', 'kids', 'adult');

-- Create channels table
CREATE TABLE channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    type channel_type DEFAULT 'personal',
    visibility channel_visibility DEFAULT 'public',
    category VARCHAR(50),
    language VARCHAR(10),
    location VARCHAR(100),
    subscriber_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_live BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    audience audience_type DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create channel settings table
CREATE TABLE channel_settings (
    channel_id UUID PRIMARY KEY REFERENCES channels(id) ON DELETE CASCADE,
    allow_comments BOOLEAN DEFAULT true,
    allow_live_streams BOOLEAN DEFAULT true,
    allow_shorts BOOLEAN DEFAULT true,
    theme channel_theme DEFAULT 'auto',
    two_factor_auth BOOLEAN DEFAULT false,
    custom_url VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create channel social links table
CREATE TABLE channel_social_links (
    channel_id UUID PRIMARY KEY REFERENCES channels(id) ON DELETE CASCADE,
    instagram VARCHAR(100),
    tiktok VARCHAR(100),
    twitter VARCHAR(100),
    discord VARCHAR(100),
    email VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create channel_tags junction table
CREATE TABLE channel_tags (
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (channel_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_channels_user_id ON channels(user_id);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_language ON channels(language);
CREATE INDEX idx_channels_is_live ON channels(is_live) WHERE is_live = true;
CREATE INDEX idx_channels_is_verified ON channels(is_verified) WHERE is_verified = true;
CREATE INDEX idx_channels_subscriber_count ON channels(subscriber_count DESC);
CREATE INDEX idx_channel_tags_channel_id ON channel_tags(channel_id);
CREATE INDEX idx_channel_tags_tag_id ON channel_tags(tag_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_channels_updated_at
    BEFORE UPDATE ON channels
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_channel_settings_updated_at
    BEFORE UPDATE ON channel_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_channel_social_links_updated_at
    BEFORE UPDATE ON channel_social_links
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Channels are viewable by everyone"
    ON channels FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own channel"
    ON channels FOR INSERT
    WITH CHECK (auth.uid() = user_id AND NOT EXISTS (
        SELECT 1 FROM channels WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own channel"
    ON channels FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channel"
    ON channels FOR DELETE
    USING (auth.uid() = user_id);

-- Channel settings policies
CREATE POLICY "Channel settings are viewable by everyone"
    ON channel_settings FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their channel settings"
    ON channel_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM channels
            WHERE id = channel_id AND user_id = auth.uid()
        )
    );

-- Channel social links policies
CREATE POLICY "Channel social links are viewable by everyone"
    ON channel_social_links FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their channel social links"
    ON channel_social_links FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM channels
            WHERE id = channel_id AND user_id = auth.uid()
        )
    );

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create tags"
    ON tags FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tags"
    ON tags FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tags"
    ON tags FOR DELETE
    USING (auth.role() = 'authenticated');

-- Channel tags policies
CREATE POLICY "Channel tags are viewable by everyone"
    ON channel_tags FOR SELECT
    USING (true);

CREATE POLICY "Users can manage tags for their channels"
    ON channel_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM channels
            WHERE id = channel_id AND user_id = auth.uid()
        )
    );
