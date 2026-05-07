import { readFileSync } from 'node:fs';
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
const data = JSON.parse(
  readFileSync(join(__dirname, '../src/data/wifiVigilanteData.json'), 'utf8')
);

for (const statement of schema
  .split(';')
  .map((sql) => sql.trim())
  .filter(Boolean)) {
  await db.execute(statement);
}

for (const sector of data.sectors) {
  await db.execute({
    sql: `
      insert into sectors (id, name, description)
      values (?, ?, ?)
      on conflict(id) do update set name = excluded.name, description = excluded.description
    `,
    args: [sector.id, sector.name, sector.description ?? null],
  });
}

for (const subsector of data.subsectors) {
  await db.execute({
    sql: `
      insert into subsectors (id, sector_id, name, description)
      values (?, ?, ?, ?)
      on conflict(id) do update set
        sector_id = excluded.sector_id,
        name = excluded.name,
        description = excluded.description
    `,
    args: [subsector.id, subsector.sector_id, subsector.name, subsector.description ?? null],
  });
}

for (const item of data.cases) {
  await db.execute({
    sql: `
      insert into case_files (
        id, public_id, title, sector_id, subsector_id, tool, location, category,
        incident_date, tags, incident_overview, investigation_breakdown, root_cause,
        resolution, verdict, summary, detected_by, severity, status, impact_scope,
        duration_minutes, validated_by, featured_date, created_at, updated_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      on conflict(public_id) do update set
        title = excluded.title,
        sector_id = excluded.sector_id,
        subsector_id = excluded.subsector_id,
        tool = excluded.tool,
        location = excluded.location,
        category = excluded.category,
        incident_date = excluded.incident_date,
        tags = excluded.tags,
        incident_overview = excluded.incident_overview,
        investigation_breakdown = excluded.investigation_breakdown,
        root_cause = excluded.root_cause,
        resolution = excluded.resolution,
        verdict = excluded.verdict,
        summary = excluded.summary,
        detected_by = excluded.detected_by,
        severity = excluded.severity,
        status = excluded.status,
        impact_scope = excluded.impact_scope,
        duration_minutes = excluded.duration_minutes,
        validated_by = excluded.validated_by,
        featured_date = excluded.featured_date,
        updated_at = datetime('now')
    `,
    args: [
      item.id,
      item.public_id,
      item.title,
      item.sector_id,
      item.subsector_id ?? null,
      item.tool ?? null,
      item.location ?? null,
      item.category ?? null,
      item.incident_date,
      item.tags ?? null,
      item.incident_overview,
      item.investigation_breakdown ?? null,
      item.root_cause ?? null,
      item.resolution ?? null,
      item.verdict ?? null,
      item.summary ?? null,
      item.detected_by ?? null,
      item.severity,
      item.status,
      item.impact_scope ?? null,
      item.duration_minutes ?? null,
      item.validated_by ?? null,
      item.featured_date ?? null,
    ],
  });
}

console.log(
  `Seeded ${data.cases.length} cases, ${data.sectors.length} sectors, and ${data.subsectors.length} subsectors into Turso.`
);
