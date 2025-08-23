import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Play, Lock, Sparkles, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { useTools, type ToolRegistryItem } from '@/contexts/ToolsContext';
import { toast } from '@/hooks/use-toast';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolRegistryItem;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  tool
}) => {
  const navigate = useNavigate();
  const { enableTool, seedDemoData, subscription } = useTools();
  const [isEnabling, setIsEnabling] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [includeDemoData, setIncludeDemoData] = useState(true);
  const [installComplete, setInstallComplete] = useState(false);

  const handleInstall = async () => {
    setIsEnabling(true);
    
    try {
      const success = await enableTool(tool.key);
      
      if (success) {
        if (includeDemoData) {
          setIsSeeding(true);
          await seedDemoData(tool.key);
          setIsSeeding(false);
        }
        
        setInstallComplete(true);
        
        toast({
          title: "Tool installed successfully!",
          description: `${tool.label} is now available in your workspace.`,
        });
        
        // Auto-close and navigate after a brief delay
        setTimeout(() => {
          onClose();
          if (tool.routePriv) {
            navigate(tool.routePriv);
          }
        }, 1500);
        
      } else {
        throw new Error('Installation failed');
      }
    } catch (error) {
      toast({
        title: "Installation failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleViewPublic = () => {
    onClose();
    navigate(tool.routePub);
  };

  const getSubscriptionBadge = () => {
    // Simple logic for demo - in real app this would check tool requirements
    const isAdvanced = tool.solutions.includes('private-markets') || tool.key.includes('supervisor');
    
    if (isAdvanced) {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Premium</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Basic</Badge>;
  };

  const canInstall = () => {
    // Check if tool has private route available
    return tool.routePriv !== null;
  };

  if (installComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Installation Complete!</DialogTitle>
            <DialogDescription>
              {tool.label} has been added to your workspace and is ready to use.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{tool.label}</DialogTitle>
              <DialogDescription className="mt-1">
                {tool.summary}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                {getSubscriptionBadge()}
                <Badge variant="outline" className="text-xs">
                  {tool.solutions.join(', ')}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {canInstall() ? (
            <>
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Install to Your Workspace
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Add this tool to your private workspace for full functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="demo-data"
                        checked={includeDemoData}
                        onCheckedChange={setIncludeDemoData}
                      />
                      <label 
                        htmlFor="demo-data" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include demo data
                      </label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pre-populate with sample data to explore features quickly
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-2">OR</div>
              </div>
            </>
          ) : (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Play className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Private version coming soon
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  View the public preview to see what's planned
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                Preview Demo
              </CardTitle>
              <CardDescription className="text-xs">
                See how this tool works with marketing preview
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleViewPublic}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Preview
          </Button>
          
          {canInstall() && (
            <Button 
              onClick={handleInstall} 
              disabled={isEnabling}
              className="flex-1"
            >
              {isEnabling ? (
                <>
                  {isSeeding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Seeding data...
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Installing...
                    </>
                  )}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Install Tool
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};