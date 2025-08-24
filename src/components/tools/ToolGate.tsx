import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '@/contexts/ToolsContext';
import { InstallModal } from '@/components/tools/InstallModal';
import { getWorkspaceTools } from '@/lib/workspaceTools';

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

  const tool = getToolInfo(toolKey);

  // If tool doesn't exist in registry, show children (fail open)
  if (!tool) {
    console.warn(`Tool "${toolKey}" not found in registry`);
    return <>{children}</>;
  }

  // If tool is enabled, show content
  if (isToolEnabled(toolKey)) {
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
      />
      {/* Don't render children until tool is installed */}
    </>
  );
};