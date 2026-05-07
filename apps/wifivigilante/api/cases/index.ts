import { getDb, requireAdmin, sendError, setJsonHeaders } from '../_db';

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
    const db = getDb();

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: `
          select ${caseColumns}
          from case_files c
          left join sectors s on s.id = c.sector_id
          left join subsectors ss on ss.id = c.subsector_id
          order by c.incident_date desc
        `,
        args: [],
      });
      res.status(200).json(result.rows.map((row) => mapCase(row as Record<string, unknown>)));
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const item = req.body ?? {};
      const publicId = String(item.public_id ?? crypto.randomUUID());

      await db.execute({
        sql: `
          insert into case_files (
            public_id, title, sector_id, subsector_id, tool, location, category,
            incident_date, tags, incident_overview, investigation_breakdown, root_cause,
            resolution, verdict, summary, detected_by, severity, status, impact_scope,
            duration_minutes, validated_by, created_at, updated_at
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `,
        args: [
          publicId,
          String(item.title ?? ''),
          Number(item.sector_id ?? 1),
          item.subsector_id === undefined || item.subsector_id === null
            ? null
            : Number(item.subsector_id),
          String(item.tool ?? ''),
          String(item.location ?? ''),
          String(item.category ?? ''),
          String(item.incident_date ?? new Date().toISOString().slice(0, 10)),
          String(item.tags ?? ''),
          String(item.incident_overview ?? ''),
          String(item.investigation_breakdown ?? ''),
          String(item.root_cause ?? ''),
          String(item.resolution ?? ''),
          String(item.verdict ?? ''),
          String(item.summary ?? ''),
          String(item.detected_by ?? ''),
          String(item.severity ?? 'Medium'),
          String(item.status ?? 'Resolved'),
          String(item.impact_scope ?? ''),
          Number(item.duration_minutes ?? 0),
          String(item.validated_by ?? ''),
        ],
      });

      res.status(200).json({ success: true, public_id: publicId });
      return;
    }

    sendError(res, 405, 'Method not allowed');
  } catch (error) {
    sendError(res, 500, error instanceof Error ? error.message : 'Server error');
  }
}
