import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before seeding.');
}

const db = createClient({ url, authToken });
const schema = readFileSync(join(__dirname, '../database/schema.sql'), 'utf8');
const posts = JSON.parse(
  readFileSync(join(__dirname, '../src/content/blog/blog-posts.json'), 'utf8')
);

function findMarkdownFile(directory, filename) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      const found = findMarkdownFile(fullPath, filename);
      if (found) return found;
    }
    if (entry.isFile() && entry.name === filename) return fullPath;
  }
  return null;
}

for (const statement of schema
  .split(';')
  .map((sql) => sql.trim())
  .filter(Boolean)) {
  await db.execute(statement);
}

for (const post of posts) {
  const contentPath = findMarkdownFile(
    join(__dirname, '../src/content/blog/posts'),
    post.contentFile
  );
  const content = contentPath ? readFileSync(contentPath, 'utf8') : '';
  const readTime = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

  await db.execute({
    sql: `
      insert into posts (
        id, slug, title, excerpt, content, author, date, published, featured,
        read_time, tags, meta_title, meta_description, og_image, view_count,
        created_at, updated_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      on conflict(slug) do update set
        title = excluded.title,
        excerpt = excluded.excerpt,
        content = excluded.content,
        author = excluded.author,
        date = excluded.date,
        published = excluded.published,
        featured = excluded.featured,
        read_time = excluded.read_time,
        tags = excluded.tags,
        meta_title = excluded.meta_title,
        meta_description = excluded.meta_description,
        og_image = excluded.og_image,
        updated_at = datetime('now')
    `,
    args: [
      post.id,
      post.id,
      post.title,
      post.excerpt,
      content,
      post.author ?? 'Kris Armstrong',
      post.date,
      post.published === false ? 0 : 1,
      post.featured ? 1 : 0,
      post.read_time ?? readTime,
      JSON.stringify(post.tags ?? []),
      post.meta_title ?? '',
      post.meta_description ?? '',
      post.og_image ?? '',
      post.view_count ?? 0,
    ],
  });
}

console.log(`Seeded ${posts.length} posts into Turso.`);
