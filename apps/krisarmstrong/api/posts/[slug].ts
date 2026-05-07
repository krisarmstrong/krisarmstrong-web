import { getDb, parseJsonArray, requireAdmin, sendError, setJsonHeaders, toBoolean } from '../_db';

type ApiRequest = {
  body?: Record<string, unknown>;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: { slug?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function mapPost(row: Record<string, unknown>) {
  return {
    ...row,
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
    const slug = String(req.query.slug ?? '');
    if (!slug) {
      sendError(res, 400, 'slug is required');
      return;
    }

    const db = getDb();

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: 'select * from posts where slug = ? and published = 1 limit 1',
        args: [slug],
      });
      const row = result.rows[0] as Record<string, unknown> | undefined;
      if (!row) {
        sendError(res, 404, 'Post not found');
        return;
      }
      res.status(200).json(mapPost(row));
      return;
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const post = req.body ?? {};
      await db.execute({
        sql: `
          update posts set
            title = coalesce(?, title),
            excerpt = coalesce(?, excerpt),
            content = coalesce(?, content),
            author = coalesce(?, author),
            date = coalesce(?, date),
            published = coalesce(?, published),
            featured = coalesce(?, featured),
            read_time = coalesce(?, read_time),
            tags = coalesce(?, tags),
            meta_title = coalesce(?, meta_title),
            meta_description = coalesce(?, meta_description),
            og_image = coalesce(?, og_image),
            updated_at = datetime('now')
          where slug = ?
        `,
        args: [
          post.title === undefined ? null : String(post.title),
          post.excerpt === undefined ? null : String(post.excerpt),
          post.content === undefined ? null : String(post.content),
          post.author === undefined ? null : String(post.author),
          post.date === undefined ? null : String(post.date),
          post.published === undefined ? null : post.published ? 1 : 0,
          post.featured === undefined ? null : post.featured ? 1 : 0,
          post.read_time === undefined ? null : Number(post.read_time),
          post.tags === undefined ? null : JSON.stringify(parseJsonArray(post.tags)),
          post.meta_title === undefined ? null : String(post.meta_title),
          post.meta_description === undefined ? null : String(post.meta_description),
          post.og_image === undefined ? null : String(post.og_image),
          slug,
        ],
      });
      res.status(200).json({ success: true, slug });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      await db.execute({ sql: 'delete from posts where slug = ?', args: [slug] });
      res.status(200).json({ success: true, slug });
      return;
    }

    sendError(res, 405, 'Method not allowed');
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
