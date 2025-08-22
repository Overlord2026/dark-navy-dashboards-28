// Dev seeder utilities for NIL and Family proof slips

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

export async function seedAllDemoData(): Promise<{ nil: string; family: string }> {
  const results = {
    nil: 'not_run',
    family: 'not_run'
  };

  try {
    const nilResult = await runDevSeed('nil');
    results.nil = nilResult;
  } catch {
    results.nil = 'err';
  }

  try {
    const familyResult = await runDevSeed('family');
    results.family = familyResult;
  } catch {
    results.family = 'err';
  }

  return results;
}