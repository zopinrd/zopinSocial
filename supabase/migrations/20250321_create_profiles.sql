-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  email text not null,
  avatar_url text,
  bio text,
  subscriber_count integer default 0,
  video_count integer default 0,
  total_views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
-- Allow public read access
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- Allow users to update their own profile
create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );

-- Allow authenticated users to insert their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
