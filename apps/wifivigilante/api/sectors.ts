import { getDb, sendError, setJsonHeaders } from './_db';

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default async function handler(_req: unknown, res: ApiResponse) {
  setJsonHeaders(res);
  try {
    const db = getDb();
    const result = await db.execute('select id, name, description from sectors order by name');
    res.status(200).json(result.rows);
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
