import { getDb, sendError, setJsonHeaders } from './_db';

type ApiRequest = {
  body?: Record<string, unknown>;
  method?: string;
  query: { itemId?: string; itemType?: string; userFingerprint?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function validRating(rating: number) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setJsonHeaders(res);

  try {
    const db = getDb();

    if (req.method === 'GET') {
      const itemId = String(req.query.itemId ?? '');
      const itemType = String(req.query.itemType ?? 'blog');
      const userFingerprint = req.query.userFingerprint
        ? String(req.query.userFingerprint)
        : undefined;

      if (!itemId) {
        sendError(res, 400, 'itemId is required');
        return;
      }

      const stats = await db.execute({
        sql: `
          select coalesce(avg(rating), 0) as average_rating, count(*) as total_ratings
          from ratings
          where item_id = ? and item_type = ?
        `,
        args: [itemId, itemType],
      });

      let userRating: number | null = null;
      if (userFingerprint) {
        const current = await db.execute({
          sql: 'select rating from ratings where item_id = ? and item_type = ? and user_fingerprint = ? limit 1',
          args: [itemId, itemType, userFingerprint],
        });
        userRating = current.rows[0] ? Number(current.rows[0].rating) : null;
      }

      const row = stats.rows[0];
      res.status(200).json({
        average_rating: Number(row?.average_rating ?? 0),
        total_ratings: Number(row?.total_ratings ?? 0),
        user_rating: userRating,
      });
      return;
    }

    if (req.method === 'POST') {
      const itemId = String(req.body?.itemId ?? '');
      const itemType = String(req.body?.itemType ?? 'blog');
      const userFingerprint = String(req.body?.userFingerprint ?? '');
      const rating = Number(req.body?.rating);

      if (!itemId || !userFingerprint || !validRating(rating)) {
        sendError(res, 400, 'itemId, userFingerprint, and rating 1-5 are required');
        return;
      }

      await db.execute({
        sql: `
          insert into ratings (item_id, item_type, user_fingerprint, rating, created_at, updated_at)
          values (?, ?, ?, ?, datetime('now'), datetime('now'))
          on conflict(item_id, item_type, user_fingerprint) do update set
            rating = excluded.rating,
            updated_at = datetime('now')
        `,
        args: [itemId, itemType, userFingerprint, rating],
      });

      const stats = await db.execute({
        sql: `
          select coalesce(avg(rating), 0) as average_rating, count(*) as total_ratings
          from ratings
          where item_id = ? and item_type = ?
        `,
        args: [itemId, itemType],
      });
      const row = stats.rows[0];

      res.status(200).json({
        success: true,
        rating,
        stats: {
          average_rating: Number(row?.average_rating ?? 0),
          total_ratings: Number(row?.total_ratings ?? 0),
        },
      });
      return;
    }

    sendError(res, 405, 'Method not allowed');
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
