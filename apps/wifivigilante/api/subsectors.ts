import { getDb, sendError, setJsonHeaders } from './_db';

type ApiRequest = {
  query: { sectorId?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setJsonHeaders(res);
  try {
    const db = getDb();
    const sectorId = req.query.sectorId;
    const result = await db.execute({
      sql: sectorId
        ? 'select id, sector_id, name, description from subsectors where sector_id = ? order by name'
        : 'select id, sector_id, name, description from subsectors order by name',
      args: sectorId ? [sectorId] : [],
    });
    res.status(200).json(result.rows);
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
