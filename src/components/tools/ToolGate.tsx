import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '@/contexts/ToolsContext';
import { InstallModal } from '@/components/tools/InstallModal';
import { getWorkspaceTools } from '@/lib/workspaceTools';
import { toast } from '@/hooks/use-toast';
import { useFamilyAnalytics } from '@/lib/familyAnalytics';

interface ToolGateProps {
  toolKey: string;
  children: React.ReactNode;
  fallbackRoute?: string;
}

export const ToolGate: React.FC<ToolGateProps> = ({
  toolKey,
  children,
  fallbackRoute
}) => {
  const navigate = useNavigate();
  const { isToolEnabled, isToolAvailable, getToolInfo } = useTools();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const analytics = useFamilyAnalytics();

  const tool = getToolInfo(toolKey);

  // If tool doesn't exist in registry, show children (fail open)
  if (!tool) {
    console.warn(`Tool "${toolKey}" not found in registry`);
    return <>{children}</>;
  }

  // If tool is enabled, show content with success toast
  if (isToolEnabled(toolKey)) {
    // Show success toast for tool access
    React.useEffect(() => {
      const workspace = getWorkspaceTools();
      analytics.trackSuccess('tool-access', toolKey, { 
        segment: workspace.segment 
      });
    }, [toolKey, analytics]);
    
    return <>{children}</>;
  }

  // If tool is not available for this persona/subscription, redirect to public
  if (!isToolAvailable(toolKey)) {
    React.useEffect(() => {
      navigate(fallbackRoute || tool.routePub);
    }, []);
    return null;
  }

  // Show install modal when tool gate is rendered and track click
  React.useEffect(() => {
    const workspace = getWorkspaceTools();
    
    // Track tool card click analytics
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.card.click', { 
        key: toolKey, 
        persona: workspace.persona, 
        segment: workspace.segment,
        installed: isToolEnabled(toolKey),
        available: isToolAvailable(toolKey)
      });
    }
    
    setShowInstallModal(true);
  }, [toolKey, isToolEnabled, isToolAvailable]);

  return (
    <>
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => {
          setShowInstallModal(false);
          // Navigate back or to fallback route
          navigate(fallbackRoute || tool.routePub);
        }}
        tool={tool}
        onInstallSuccess={(toolKey: string, withSeed: boolean) => {
          const workspace = getWorkspaceTools();
          analytics.trackSuccess('tool-install', toolKey, { 
            withSeed, 
            segment: workspace.segment 
          });
          toast({
            title: "Tool Installed!",
            description: `${tool.label} is now ready to use.`,
          });
        }}
        onPreview={(toolKey: string) => {
          const workspace = getWorkspaceTools();
          analytics.trackToolPreview(toolKey, workspace.segment || 'unknown');
        }}
      />
      {/* Don't render children until tool is installed */}
    </>
  );
};