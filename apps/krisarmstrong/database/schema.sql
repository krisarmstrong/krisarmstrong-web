create table if not exists posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  author text not null default 'Kris Armstrong',
  date text not null,
  published integer not null default 1,
  featured integer not null default 0,
  read_time integer not null default 5,
  tags text not null default '[]',
  meta_title text,
  meta_description text,
  og_image text,
  view_count integer not null default 0,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published_date on posts(published, date desc);

create table if not exists ratings (
  item_id text not null,
  item_type text not null,
  user_fingerprint text not null,
  rating integer not null check (rating between 1 and 5),
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now')),
  primary key (item_id, item_type, user_fingerprint)
);

create index if not exists idx_ratings_item on ratings(item_id, item_type);
