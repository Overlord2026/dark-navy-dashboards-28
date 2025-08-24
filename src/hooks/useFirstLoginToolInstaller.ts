import { useEffect } from 'react';
import { getWorkspaceTools, installTool, setPersona } from '@/lib/workspaceTools';
import { DEFAULT_TOOLS_BY_PERSONA, type PersonaType } from '@/config/defaultToolsByPersona';
import { useFeatureFlag } from '@/lib/flags';
import { useToast } from '@/hooks/use-toast';

export function useFirstLoginToolInstaller() {
  const { toast } = useToast();
  const autoInstallEnabled = useFeatureFlag('INSTALL_DEFAULT_TOOLS_ON_FIRST_LOGIN');

  const checkAndInstallDefaultTools = async (userPersona: PersonaType) => {
    if (!autoInstallEnabled) return;

    const workspace = getWorkspaceTools();
    
    // Check if this is the first login (no tools installed and no persona set)
    const isFirstLogin = workspace.installed.length === 0 && !workspace.persona;
    
    if (!isFirstLogin) return;

    try {
      // Set the user's persona
      setPersona(userPersona);
      
      // Get default tools for this persona
      const defaultTools = DEFAULT_TOOLS_BY_PERSONA[userPersona] || [];
      
      if (defaultTools.length === 0) return;

      // Install tools one by one
      let installedCount = 0;
      for (const toolKey of defaultTools) {
        try {
          await installTool(toolKey, true); // Install with seed data
          installedCount++;
        } catch (error) {
          console.warn(`Failed to auto-install tool ${toolKey}:`, error);
        }
      }

      if (installedCount > 0) {
        toast({
          title: "Welcome to your workspace!",
          description: `Installed your ${installedCount} starter tools. You can add/remove tools anytime.`,
          duration: 6000,
        });

        // Track analytics
        if (typeof window !== 'undefined' && window.analytics) {
          window.analytics.track('tools.auto_installed', {
            persona: userPersona,
            tools_installed: installedCount,
            total_tools: defaultTools.length,
            tool_keys: defaultTools.slice(0, installedCount)
          });
        }
      }
    } catch (error) {
      console.error('Failed to auto-install default tools:', error);
    }
  };

  return { checkAndInstallDefaultTools };
}