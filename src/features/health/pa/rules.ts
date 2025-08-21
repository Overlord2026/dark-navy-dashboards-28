/**
 * Prior Authorization coverage and safety rules
 */

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'hmo' | 'ppo' | 'epo' | 'pos';
  formulary?: string[];
  exclusions?: string[];
}

export interface CoverageResult {
  covered: boolean;
  reason?: string;
  requiresPriorAuth?: boolean;
  copayAmount?: number;
}

export interface SafetyResult {
  ok: boolean;
  conflicts?: string[];
  warnings?: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
}

export interface Allergy {
  substance: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

/**
 * Check if a procedure/service is covered by insurance plan
 */
export function coverageRules(
  plan: InsurancePlan,
  cpt: string,
  icd: string
): CoverageResult {
  console.info('coverage.check', { 
    planType: plan.type, 
    cptCode: cpt, 
    icdCode: icd 
  });

  // Preventive care coverage (typically covered at 100%)
  const preventiveCpts = [
    '99381', '99382', '99383', '99384', '99385', '99386', '99387', // Annual physicals
    '99391', '99392', '99393', '99394', '99395', '99396', '99397', // Established patient physicals
    '86580', '86701', '86702', '86703', // HIV screening
    '81025', '81020', // Urine pregnancy
    '82270', '82465', '82947', '82951', // Blood glucose screening
    '80053', '80061', // Comprehensive metabolic panel, lipid panel
    '99214', '99213' // Office visits for preventive care
  ];

  if (preventiveCpts.includes(cpt)) {
    return {
      covered: true,
      reason: 'Preventive care covered at 100%',
      copayAmount: 0
    };
  }

  // Specialist procedures that typically require prior auth
  const priorAuthRequired = [
    '70551', '70552', '70553', // Brain MRI
    '72148', '72149', // Lumbar spine MRI
    '73721', '73722', '73723', // Knee MRI
    '78452', // Myocardial perfusion imaging
    '93306', '93307', '93308', // Echocardiogram
    '45378', '45380', '45384', '45385' // Colonoscopy with procedures
  ];

  if (priorAuthRequired.includes(cpt)) {
    return {
      covered: true,
      reason: 'Covered with prior authorization',
      requiresPriorAuth: true,
      copayAmount: plan.type === 'hmo' ? 50 : 150
    };
  }

  // Emergency/urgent care - always covered but higher copay
  const emergencyCpts = ['99281', '99282', '99283', '99284', '99285'];
  if (emergencyCpts.includes(cpt)) {
    return {
      covered: true,
      reason: 'Emergency care covered',
      copayAmount: plan.type === 'hmo' ? 100 : 200
    };
  }

  // Check plan exclusions
  if (plan.exclusions?.includes(cpt)) {
    return {
      covered: false,
      reason: 'Service excluded from plan coverage'
    };
  }

  // Default coverage for routine services
  return {
    covered: true,
    reason: 'Standard coverage applies',
    copayAmount: plan.type === 'hmo' ? 25 : 40
  };
}

/**
 * Check for safety conflicts with medications and allergies
 */
export function safetyRules(
  medications: Medication[],
  allergies: Allergy[],
  procedure: { cpt: string; medications?: string[]; contrast?: boolean }
): SafetyResult {
  console.info('safety.check', { 
    medicationCount: medications.length,
    allergyCount: allergies.length,
    procedureCpt: procedure.cpt,
    hasContrast: procedure.contrast
  });

  const conflicts: string[] = [];
  const warnings: string[] = [];

  // Check for contrast allergies
  if (procedure.contrast) {
    const contrastAllergies = allergies.filter(a => 
      a.substance.toLowerCase().includes('contrast') ||
      a.substance.toLowerCase().includes('iodine') ||
      a.substance.toLowerCase().includes('gadolinium')
    );

    if (contrastAllergies.length > 0) {
      if (contrastAllergies.some(a => a.severity === 'severe')) {
        conflicts.push('Severe contrast allergy - procedure contraindicated');
      } else {
        warnings.push('Contrast allergy detected - premedication required');
      }
    }
  }

  // Check for procedure-specific medication conflicts
  if (procedure.medications) {
    for (const procMed of procedure.medications) {
      // Check allergies to procedure medications
      const allergyConflict = allergies.find(a => 
        a.substance.toLowerCase() === procMed.toLowerCase()
      );
      
      if (allergyConflict) {
        if (allergyConflict.severity === 'severe') {
          conflicts.push(`Severe allergy to ${procMed} - cannot administer`);
        } else {
          warnings.push(`${allergyConflict.severity} allergy to ${procMed} - monitor closely`);
        }
      }

      // Check for drug interactions
      for (const currentMed of medications) {
        if (hasInteraction(currentMed.name, procMed)) {
          warnings.push(`Potential interaction between ${currentMed.name} and ${procMed}`);
        }
      }
    }
  }

  // Check for procedure-specific medication contraindications
  const anticoagulants = ['warfarin', 'heparin', 'rivaroxaban', 'apixaban', 'dabigatran'];
  const invasiveProcedures = ['45378', '45380', '45384', '45385', '43239', '43240'];
  
  if (invasiveProcedures.includes(procedure.cpt)) {
    const anticoagulantMeds = medications.filter(med =>
      anticoagulants.some(ac => med.name.toLowerCase().includes(ac))
    );

    if (anticoagulantMeds.length > 0) {
      warnings.push('Patient on anticoagulation - bleeding risk assessment required');
    }
  }

  return {
    ok: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Simple drug interaction checker (simplified for demo)
 */
function hasInteraction(med1: string, med2: string): boolean {
  const interactions = new Map([
    ['warfarin', ['aspirin', 'ibuprofen', 'amiodarone']],
    ['metformin', ['contrast media']],
    ['digoxin', ['amiodarone', 'verapamil']],
    ['simvastatin', ['amiodarone', 'verapamil', 'clarithromycin']]
  ]);

  const med1Lower = med1.toLowerCase();
  const med2Lower = med2.toLowerCase();

  return interactions.get(med1Lower)?.includes(med2Lower) ||
         interactions.get(med2Lower)?.includes(med1Lower) ||
         false;
}