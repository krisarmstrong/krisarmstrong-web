# Turso/libSQL Live Data

This site uses Turso/libSQL for live blog posts, public aggregate ratings, and admin edits.
Bundled markdown remains as a fallback when the API is unavailable.

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

Create or update a post:

```bash
curl -X POST https://krisarmstrong.org/api/posts \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_API_TOKEN" \
  -d '{"slug":"example-post","title":"Example","excerpt":"Short summary","content":"# Example","tags":["Wi-Fi"],"featured":false}'
```

Patch a post:

```bash
curl -X PATCH https://krisarmstrong.org/api/posts/example-post \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_API_TOKEN" \
  -d '{"published":false}'
```

Public ratings use `GET /api/ratings?itemId=<slug>&itemType=blog` and `POST /api/ratings`.
