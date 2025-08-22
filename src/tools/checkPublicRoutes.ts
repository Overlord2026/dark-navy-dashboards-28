// Public routes checker
export async function checkPublicRoutes(paths: string[]): Promise<{ path: string; ok: boolean; status?: number }[]> {
  const base = window.location.origin;
  const results = await Promise.all(paths.map(async (p) => {
    try {
      const res = await fetch(`${base}${p}`, { method: 'GET', cache: 'no-store' });
      return { path: p, ok: res.ok, status: res.status };
    } catch {
      return { path: p, ok: false, status: undefined };
    }
  }));
  return results;
}