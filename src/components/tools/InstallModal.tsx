import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, X } from 'lucide-react';
import { installTool } from '@/services/workspaceTools';
import { getWorkspaceTools } from '@/services/workspaceTools';
import { useToast } from '@/hooks/use-toast';
import type { ToolRegistryItem } from '@/contexts/ToolsContext';

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
  const { toast } = useToast();
  const [seed, setSeed] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  const { key, label, summary, routePriv, routePub, solutions } = tool;

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const workspace = getWorkspaceTools();
      
      // Track install analytics
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('tool.install', { 
          key, 
          seed, 
          persona: workspace.persona, 
          segment: workspace.segment 
        });
      }
      
      await installTool(key, seed);
      
      toast({
        title: "Tool Installed",
        description: `${label} is now available in your workspace.`,
      });
      
      onClose();
      if (routePriv) {
        navigate(routePriv);
      }
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handlePreview = () => {
    // Track preview analytics
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.preview', { key });
    }
    
    onClose();
    navigate(routePub || `/preview/${key}`);
  };

  const handleClose = () => {
    if (!isInstalling) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {label || 'Install Tool'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={isInstalling}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {summary}
          </DialogDescription>
        </DialogHeader>

        {/* Solution tags */}
        {solutions && solutions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {solutions.slice(0, 3).map((solution) => (
              <Badge key={solution} variant="secondary" className="text-xs">
                {solution}
              </Badge>
            ))}
            {solutions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{solutions.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-4">
          {routePriv ? (
            <>
              {/* Demo data option */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Seed with demo data</p>
                  <p className="text-xs text-muted-foreground">
                    Recommended for first run to explore features
                  </p>
                </div>
                <Switch
                  checked={seed}
                  onCheckedChange={setSeed}
                  disabled={isInstalling}
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleInstall} 
                  disabled={isInstalling}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isInstalling ? 'Installing...' : 'Install & Open'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={isInstalling}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button onClick={handlePreview} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Preview
              </Button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Smart Checks • Proof Slips • Secure Vault • Time-Stamp
        </div>
      </DialogContent>
    </Dialog>
  );
};