# Turso/libSQL Live Data

This site uses Turso/libSQL for live case records, sectors, subsectors, public aggregate ratings, and admin edits.
Bundled case JSON remains as a fallback when the API is unavailable.

## Environment

Set these in Vercel and in `.env` for local API/seed work:

```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token
ADMIN_API_TOKEN=change-this-long-random-admin-token
```

## Seed

```bash
npm run db:seed
```

## Admin Edits

Create a case:

```bash
curl -X POST https://wifi-vigilante.com/api/cases \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_API_TOKEN" \
  -d '{"title":"Example Case","sector_id":1,"incident_date":"2026-05-07","incident_overview":"Summary","severity":"Medium","status":"Resolved"}'
```

Patch a case:

```bash
curl -X PATCH https://wifi-vigilante.com/api/cases/<public_id> \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_API_TOKEN" \
  -d '{"summary":"Updated summary"}'
```

Public ratings use `GET /api/ratings?itemId=<public_id>&itemType=case` and `POST /api/ratings`.
