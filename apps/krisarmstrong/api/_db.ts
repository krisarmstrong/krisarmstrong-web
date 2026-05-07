import { createClient } from '@libsql/client';

type JsonResponse = {
  status: (code: number) => JsonResponse;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
};

type ApiRequest = {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
};

export function getDb() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  }

  return createClient({ url, authToken });
}

export function sendError(res: JsonResponse, status: number, message: string) {
  res.status(status).json({ error: message });
}

export function requireAdmin(req: ApiRequest, res: JsonResponse): boolean {
  const configuredToken = process.env.ADMIN_API_TOKEN;
  const header = req.headers['x-admin-token'];
  const providedToken = Array.isArray(header) ? header[0] : header;

  if (!configuredToken || providedToken !== configuredToken) {
    sendError(res, 401, 'Unauthorized');
    return false;
  }

  return true;
}

export function setJsonHeaders(res: JsonResponse) {
  res.setHeader?.('Cache-Control', 'no-store');
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}
