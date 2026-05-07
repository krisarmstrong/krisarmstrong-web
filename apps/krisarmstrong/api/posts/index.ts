import { getDb, parseJsonArray, requireAdmin, sendError, setJsonHeaders, toBoolean } from '../_db';

type ApiRequest = {
  body?: Record<string, unknown>;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function mapPost(row: Record<string, unknown>) {
  return {
    ...row,
    slug: row.slug,
    published: row.published === undefined ? true : toBoolean(row.published),
    featured: toBoolean(row.featured),
    read_time: Number(row.read_time ?? 5),
    view_count: Number(row.view_count ?? 0),
    tags: parseJsonArray(row.tags),
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setJsonHeaders(res);

  try {
    const db = getDb();

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: 'select * from posts where published = 1 order by date desc',
        args: [],
      });
      res.status(200).json(result.rows.map((row) => mapPost(row as Record<string, unknown>)));
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const post = req.body ?? {};
      const slug = String(post.slug ?? post.id ?? '');
      if (!slug) {
        sendError(res, 400, 'slug is required');
        return;
      }

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
          String(post.id ?? slug),
          slug,
          String(post.title ?? ''),
          String(post.excerpt ?? ''),
          String(post.content ?? ''),
          String(post.author ?? 'Kris Armstrong'),
          String(post.date ?? new Date().toISOString().slice(0, 10)),
          post.published === false ? 0 : 1,
          post.featured ? 1 : 0,
          Number(post.read_time ?? 5),
          JSON.stringify(parseJsonArray(post.tags)),
          String(post.meta_title ?? ''),
          String(post.meta_description ?? ''),
          String(post.og_image ?? ''),
          Number(post.view_count ?? 0),
        ],
      });

      res.status(200).json({ success: true, slug });
      return;
    }

    sendError(res, 405, 'Method not allowed');
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
