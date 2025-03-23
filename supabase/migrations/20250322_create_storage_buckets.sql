-- Enable Row Level Security
alter table storage.buckets enable row level security;
alter table storage.objects enable row level security;

-- Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/gif']),  -- 5MB
  ('banners', 'banners', true, 10485760, array['image/jpeg', 'image/png', 'image/gif']); -- 10MB

-- Set up security policies for buckets
create policy "Buckets are accessible to all"
  on storage.buckets for select
  using ( true );

create policy "Authenticated users can create buckets"
  on storage.buckets for insert
  with check ( auth.role() = 'authenticated' );

-- Set up security policies for objects
create policy "Objects are publicly accessible"
  on storage.objects for select
  using ( bucket_id in ('avatars', 'banners') );

create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'banners')
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own files"
  on storage.objects for update
  using ( auth.uid() = owner );

create policy "Users can delete their own files"
  on storage.objects for delete
  using ( auth.uid() = owner );
