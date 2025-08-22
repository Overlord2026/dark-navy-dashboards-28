// Dev seeder utilities
export async function runDevSeed(kind: 'nil' | 'family'): Promise<'ok' | 'noop' | 'err'> {
  try {
    if (import.meta.env.PROD) return 'noop';
    
    if (kind === 'nil') {
      const { seedNilProofs } = await import('@/tools/seedNilProofs');
      seedNilProofs();
    } else {
      const { seedFamilyProofs } = await import('@/tools/seedProofs');
      seedFamilyProofs?.();
    }
    
    return 'ok';
  } catch {
    return 'err';
  }
}