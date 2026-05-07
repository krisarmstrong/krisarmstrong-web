create table if not exists sectors (
  id integer primary key,
  name text not null unique,
  description text
);

create table if not exists subsectors (
  id integer primary key,
  sector_id integer not null references sectors(id) on delete cascade,
  name text not null,
  description text
);

create index if not exists idx_subsectors_sector on subsectors(sector_id);

create table if not exists case_files (
  id integer primary key,
  public_id text not null unique,
  title text not null,
  sector_id integer not null references sectors(id),
  subsector_id integer references subsectors(id),
  tool text,
  location text,
  category text,
  incident_date text not null,
  tags text,
  incident_overview text not null,
  investigation_breakdown text,
  root_cause text,
  resolution text,
  verdict text,
  summary text,
  detected_by text,
  severity text not null check (severity in ('Critical', 'High', 'Medium', 'Low')),
  status text not null check (status in ('Open', 'In Progress', 'Resolved', 'Closed')),
  impact_scope text,
  duration_minutes integer,
  validated_by text,
  featured_date text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create index if not exists idx_case_files_public_id on case_files(public_id);
create index if not exists idx_case_files_incident_date on case_files(incident_date desc);
create index if not exists idx_case_files_sector on case_files(sector_id);

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
