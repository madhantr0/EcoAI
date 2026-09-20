const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Opts {
  method?: string;
  body?: unknown;
  formData?: FormData;
}

export async function api<T = unknown>(path: string, opts: Opts = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ecoai_token') : null;
  const headers: Record<string, string> = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (opts.body !== undefined && !opts.formData) headers['content-type'] = 'application/json';

  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? (opts.body || opts.formData ? 'POST' : 'GET'),
    headers,
    body: opts.formData ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === 'object' && data && 'error' in data ? (data as any).error : 'Request failed';
    throw new Error(msg);
  }
  return data as T;
}
