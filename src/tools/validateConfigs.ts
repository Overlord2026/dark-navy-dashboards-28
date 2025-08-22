// Config validation functions that match ReadyCheck expectations

export function validateConfigs(): { issues: Array<{ level: 'error' | 'warning'; where: string; message: string }> } {
  const issues: Array<{ level: 'error' | 'warning'; where: string; message: string }> = [];
  
  try {
    // Check if essential config files exist
    const configs = ['demoConfig.json', 'personaConfig.json', 'familyTools.json'];
    
    // Validate demo config
    try {
      const demoConfig = require('@/config/demoConfig.json');
      if (!Array.isArray(demoConfig) || demoConfig.length === 0) {
        issues.push({ level: 'warning', where: 'demoConfig.json', message: 'No demos configured' });
      }
    } catch {
      issues.push({ level: 'error', where: 'demoConfig.json', message: 'Demo config file not found or invalid' });
    }

    // Validate persona config
    try {
      const personaConfig = require('@/config/personaConfig.json');
      if (!personaConfig || Object.keys(personaConfig).length === 0) {
        issues.push({ level: 'warning', where: 'personaConfig.json', message: 'No personas configured' });
      }
    } catch {
      issues.push({ level: 'error', where: 'personaConfig.json', message: 'Persona config file not found or invalid' });
    }

  } catch (error) {
    issues.push({ level: 'error', where: 'validateConfigs', message: 'Config validation failed' });
  }
  
  return { issues };
}