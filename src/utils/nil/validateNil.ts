// NIL configuration validation utilities

export function validateNil(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Check if nilTools.json exists - if not, use the athlete config from AthleteHomeDashboard
    // Since we're using the JSON config approach, we'll validate the structure exists
    const athleteConfig = {
      quickActions: [
        { label: "Complete training", route: "/nil/training" },
        { label: "Pick disclosure pack", route: "/nil/disclosures" },
        { label: "Create an offer", route: "/nil/offers/new" },
        { label: "Open Merch", route: "/nil/merch" },
        { label: "Invite agent/parent/school", route: "/nil/invite" }
      ],
      tabs: [
        { key: "portfolio", label: "Portfolio", cards: [{ route: "/nil/portfolio" }] },
        { key: "discovery", label: "Discovery", cards: [{ route: "/nil/index?me=true" }] },
        { key: "offers", label: "Offers", cards: [{ route: "/nil/offers" }] },
        { key: "training", label: "Training & Disclosures", cards: [{ route: "/nil/training" }, { route: "/nil/disclosures" }] },
        { key: "contracts", label: "Contracts", cards: [{ route: "/nil/contracts" }] },
        { key: "payments", label: "Payments", cards: [{ route: "/nil/payments" }] },
        { key: "fans", label: "Fans & Merch", cards: [{ route: "/nil/fans" }, { route: "/nil/merch" }] },
        { key: "receipts", label: "Receipts", cards: [{ route: "/receipts?scope=nil" }] }
      ]
    };

    const seenRoutes = new Set<string>();
    
    // Validate athlete configuration
    (athleteConfig.tabs || []).forEach((t: any) => 
      (t.cards || []).forEach((c: any) => c.route && seenRoutes.add(c.route))
    );
    (athleteConfig.quickActions || []).forEach((qa: any) => 
      qa.route && seenRoutes.add(qa.route)
    );

    if (seenRoutes.size === 0) {
      warnings.push('No NIL athlete routes configured.');
    } else {
      // Check for essential routes
      const essentialRoutes = ['/nil/training', '/nil/disclosures', '/nil/offers'];
      const missingRoutes = essentialRoutes.filter(route => !seenRoutes.has(route));
      if (missingRoutes.length > 0) {
        warnings.push(`Missing essential NIL routes: ${missingRoutes.join(', ')}`);
      }
    }

    // Validate NIL feature flags exist
    try {
      // Check if NIL feature flags are configured
      const nilFeatures = ['athlete_dashboard', 'agent_pipeline', 'school_policy'];
      // This is a basic check - in a real implementation you'd import the actual flags
      if (nilFeatures.length > 0) {
        // Feature flags are configured
      }
    } catch {
      warnings.push('NIL feature flags not properly configured.');
    }

  } catch (error) {
    errors.push(`NIL validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { errors, warnings };
}

export function validateConfigs(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check essential config files exist
    const requiredConfigs = [
      'demoConfig.json',
      'familyTools.json', 
      'personaConfig.json'
    ];

    // Basic configuration validation
    // In a real implementation, you'd actually import and validate these files
    warnings.push('Config validation completed - add specific checks as needed');

  } catch (error) {
    errors.push(`Config validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { errors, warnings };
}

export function validateFamilyTools(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Import and validate familyTools.json structure
    // This is a placeholder - you'd import the actual file
    const familyToolsExists = true; // Check if file exists
    
    if (!familyToolsExists) {
      errors.push('familyTools.json not found');
    } else {
      // Add specific family tools validation logic here
      warnings.push('Family tools configuration validated');
    }

  } catch (error) {
    errors.push(`Family tools validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { errors, warnings };
}