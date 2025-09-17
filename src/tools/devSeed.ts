// Dev seeder utilities
export async function runDevSeed(kind: 'nil' | 'family'): Promise<'ok' | 'noop' | 'err'> {
  try {
    if (import.meta.env.PROD) return 'noop';
    
    if (kind === 'nil') {
      // NIL proofs removed - return ok for backward compatibility
      return 'ok';
    } else {
      const { seedFamilyProofs } = await import('@/tools/seedProofs');
      seedFamilyProofs?.();
    }
    
    return 'ok';
  } catch {
    return 'err';
  }
}