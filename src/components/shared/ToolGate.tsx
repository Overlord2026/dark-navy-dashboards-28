import React, { useState, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, 
  Unlock, 
  Eye, 
  Settings, 
  Download,
  Play,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ToolGateProps {
  toolKey: string;
  children: ReactNode;
  fallbackAction?: 'install' | 'preview' | 'block';
  seedData?: boolean;
  className?: string;
}

interface ToolStatus {
  installed: boolean;
  configured: boolean;
  hasDemo: boolean;
  requiresUpgrade: boolean;
  marketingUrl?: string;
}

const TOOL_REGISTRY: Record<string, ToolStatus> = {
  // Family Office Tools
  'wealth-dashboard': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'estate-planning': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'tax-optimization': { installed: false, configured: false, hasDemo: true, requiresUpgrade: true, marketingUrl: '/solutions/tax' },
  'insurance-management': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // Professional Tools
  'lead-capture': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'meeting-management': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'campaign-builder': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'compliance-tracking': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // CPA Tools
  'tax-preparation': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'client-portal': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'document-management': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // Attorney Tools
  'case-management': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'document-drafting': { installed: false, configured: false, hasDemo: true, requiresUpgrade: true, marketingUrl: '/solutions/legal' },
  'client-communications': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // Insurance Tools
  'needs-analysis': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'illustration-builder': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'medicare-compliance': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'call-recording': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // Healthcare Tools
  'patient-portal': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'hipaa-compliance': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'appointment-scheduling': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  
  // Realtor Tools
  'listing-management': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false },
  'client-matching': { installed: false, configured: false, hasDemo: true, requiresUpgrade: true, marketingUrl: '/solutions/realestate' },
  'transaction-tracking': { installed: true, configured: true, hasDemo: true, requiresUpgrade: false }
};

export const ToolGate: React.FC<ToolGateProps> = ({
  toolKey,
  children,
  fallbackAction = 'install',
  seedData = false,
  className = ''
}) => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const toolStatus = TOOL_REGISTRY[toolKey];

  // If tool is installed and configured, render children
  if (toolStatus?.installed && toolStatus?.configured) {
    return <div className={className}>{children}</div>;
  }

  // If tool is not found in registry, block access
  if (!toolStatus) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Tool Not Available</span>
          </div>
          <p className="text-xs text-red-500 mt-1">Contact support to enable this feature.</p>
        </CardContent>
      </Card>
    );
  }

  // Handle different fallback actions
  const handleAction = () => {
    switch (fallbackAction) {
      case 'install':
        setShowInstallModal(true);
        break;
      case 'preview':
        if (toolStatus.marketingUrl) {
          window.open(toolStatus.marketingUrl, '_blank');
        } else {
          toast.info('Preview not available for this tool');
        }
        break;
      case 'block':
        toast.error('This tool requires additional setup');
        break;
    }
  };

  const handleInstall = async (withDemo: boolean = false) => {
    // Track analytics
    console.log('[Analytics] tool.install', { toolKey, withDemo });
    
    // Simulate installation
    toast.success(`${toolKey} installed successfully!`);
    
    if (withDemo && seedData) {
      // Simulate demo data seeding
      setTimeout(() => {
        toast.success('Demo data loaded');
      }, 1000);
    }
    
    setShowInstallModal(false);
    
    // In a real app, this would update the tool registry and re-render
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <>
      <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {toolStatus.requiresUpgrade ? (
                <Lock className="h-4 w-4 text-yellow-600" />
              ) : (
                <Settings className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium text-yellow-800">
                {toolStatus.requiresUpgrade ? 'Upgrade Required' : 'Setup Required'}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={handleAction}>
              {fallbackAction === 'install' && 'Install'}
              {fallbackAction === 'preview' && 'Preview'}
              {fallbackAction === 'block' && 'Contact Support'}
            </Button>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            {toolStatus.requiresUpgrade 
              ? 'This feature requires a premium plan'
              : 'Click to install and configure this tool'
            }
          </p>
        </CardContent>
      </Card>

      <Dialog open={showInstallModal} onOpenChange={setShowInstallModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Install {toolKey}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="install" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="install">Install</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="install" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Choose how to set up this tool:
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => handleInstall(false)} 
                  className="w-full justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Unlock className="h-4 w-4" />
                      <span className="font-medium">Install Only</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Set up the tool with empty state
                    </p>
                  </div>
                </Button>
                
                {toolStatus.hasDemo && (
                  <Button 
                    onClick={() => handleInstall(true)} 
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Play className="h-4 w-4" />
                        <span className="font-medium">Install & Load Demo</span>
                      </div>
                      <p className="text-xs opacity-80">
                        Set up with sample data for quick start
                      </p>
                    </div>
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Learn more about this tool before installing:
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4"
                  onClick={() => window.open(toolStatus.marketingUrl || '/solutions', '_blank')}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">View Features</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      See what this tool can do
                    </p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4"
                  onClick={() => window.open('/help/videos', '_blank')}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <ExternalLink className="h-4 w-4" />
                      <span className="font-medium">Watch Demo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      See the tool in action
                    </p>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Quick wrapper for tool cards
export const ToolCard: React.FC<{
  toolKey: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}> = ({ toolKey, title, description, icon, onClick }) => {
  return (
    <ToolGate toolKey={toolKey} seedData={true}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </ToolGate>
  );
};