export function getCurrentTenantId(): string {
  // TODO: return firm/tenant from auth/session (e.g., ctx.tenantId)
  return 'TENANT_DEFAULT';
}

export async function listAllTenantIds(): Promise<string[]> {
  // TODO: load from your org store; stub a single-tenant for now
  return ['TENANT_DEFAULT'];
}