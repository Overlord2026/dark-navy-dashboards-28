export function hasAdminRole(meta: unknown): boolean {
  const role = (meta as any)?.role;
  return role === "admin" || role === "superadmin";
}