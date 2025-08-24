import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X } from 'lucide-react';
import { installTool } from '@/lib/workspaceTools';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface InstallModalProps {
  toolKey: string;
  registryItem: any;
  onClose: () => void;
}

export default function InstallModal({ toolKey, registryItem, onClose }: InstallModalProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [withSeed, setWithSeed] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installTool(toolKey, withSeed);
      toast({
        title: "Tool Installed",
        description: `${registryItem.label} is now available in your workspace.`,
      });
      onClose();
      if (registryItem.routePriv) {
        navigate(registryItem.routePriv);
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {registryItem.label}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isInstalling}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {registryItem.summary}
          </DialogDescription>
        </DialogHeader>

        {/* Solution tags */}
        {registryItem.solutions && registryItem.solutions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {registryItem.solutions.slice(0, 3).map((solution: string) => (
              <Badge key={solution} variant="secondary" className="text-xs">
                {solution}
              </Badge>
            ))}
            {registryItem.solutions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{registryItem.solutions.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* Demo data option */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Seed with demo data</p>
              <p className="text-xs text-muted-foreground">
                Recommended for first run to explore features
              </p>
            </div>
            <Switch
              checked={withSeed}
              onCheckedChange={setWithSeed}
              disabled={isInstalling}
            />
          </div>

          {/* Action button */}
          <Button 
            onClick={handleInstall} 
            disabled={isInstalling}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isInstalling ? 'Installing...' : 'Install & Open'}
          </Button>
        </div>

        {/* Footer note */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Smart Checks • Proof Slips • Secure Vault • Time-Stamp
        </div>
      </DialogContent>
    </Dialog>
  );
}