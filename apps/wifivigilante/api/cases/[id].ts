import { getDb, requireAdmin, sendError, setJsonHeaders } from '../_db';

type ApiRequest = {
  body?: Record<string, unknown>;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: { id?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const caseColumns = `
  c.*,
  s.name as sector_name,
  s.description as sector_description,
  ss.name as subsector_name,
  ss.description as subsector_description
`;

function mapCase(row: Record<string, unknown>) {
  return {
    ...row,
    sectors: row.sector_name
      ? { name: row.sector_name, description: row.sector_description }
      : null,
    subsectors: row.subsector_name
      ? { name: row.subsector_name, description: row.subsector_description }
      : null,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setJsonHeaders(res);

  try {
    const publicId = String(req.query.id ?? '');
    if (!publicId) {
      sendError(res, 400, 'id is required');
      return;
    }

    const db = getDb();

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: `
          select ${caseColumns}
          from case_files c
          left join sectors s on s.id = c.sector_id
          left join subsectors ss on ss.id = c.subsector_id
          where c.public_id = ?
          limit 1
        `,
        args: [publicId],
      });
      const row = result.rows[0] as Record<string, unknown> | undefined;
      if (!row) {
        sendError(res, 404, 'Case not found');
        return;
      }
      res.status(200).json(mapCase(row));
      return;
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const item = req.body ?? {};
      await db.execute({
        sql: `
          update case_files set
            title = coalesce(?, title),
            sector_id = coalesce(?, sector_id),
            subsector_id = coalesce(?, subsector_id),
            tool = coalesce(?, tool),
            location = coalesce(?, location),
            category = coalesce(?, category),
            incident_date = coalesce(?, incident_date),
            tags = coalesce(?, tags),
            incident_overview = coalesce(?, incident_overview),
            investigation_breakdown = coalesce(?, investigation_breakdown),
            root_cause = coalesce(?, root_cause),
            resolution = coalesce(?, resolution),
            verdict = coalesce(?, verdict),
            summary = coalesce(?, summary),
            detected_by = coalesce(?, detected_by),
            severity = coalesce(?, severity),
            status = coalesce(?, status),
            impact_scope = coalesce(?, impact_scope),
            duration_minutes = coalesce(?, duration_minutes),
            validated_by = coalesce(?, validated_by),
            updated_at = datetime('now')
          where public_id = ?
        `,
        args: [
          item.title === undefined ? null : String(item.title),
          item.sector_id === undefined ? null : Number(item.sector_id),
          item.subsector_id === undefined ? null : Number(item.subsector_id),
          item.tool === undefined ? null : String(item.tool),
          item.location === undefined ? null : String(item.location),
          item.category === undefined ? null : String(item.category),
          item.incident_date === undefined ? null : String(item.incident_date),
          item.tags === undefined ? null : String(item.tags),
          item.incident_overview === undefined ? null : String(item.incident_overview),
          item.investigation_breakdown === undefined ? null : String(item.investigation_breakdown),
          item.root_cause === undefined ? null : String(item.root_cause),
          item.resolution === undefined ? null : String(item.resolution),
          item.verdict === undefined ? null : String(item.verdict),
          item.summary === undefined ? null : String(item.summary),
          item.detected_by === undefined ? null : String(item.detected_by),
          item.severity === undefined ? null : String(item.severity),
          item.status === undefined ? null : String(item.status),
          item.impact_scope === undefined ? null : String(item.impact_scope),
          item.duration_minutes === undefined ? null : Number(item.duration_minutes),
          item.validated_by === undefined ? null : String(item.validated_by),
          publicId,
        ],
      });
      res.status(200).json({ success: true, public_id: publicId });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      await db.execute({ sql: 'delete from case_files where public_id = ?', args: [publicId] });
      res.status(200).json({ success: true, public_id: publicId });
      return;
    }

    sendError(res, 405, 'Method not allowed');
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
