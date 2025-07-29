import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link2, ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Integration, IntegrationType } from '@/types/integrations';
import { integrationService } from '@/services/integrations/IntegrationService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface IntegrationConnectButtonProps {
  integrationType: IntegrationType;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function IntegrationConnectButton({ 
  integrationType, 
  variant = 'outline',
  size = 'default' 
}: IntegrationConnectButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  const integration = integrationService.getIntegration(integrationType);
  const isEnabled = integrationService.isIntegrationEnabled(integrationType);

  if (!integration) return null;

  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };

  const getButtonText = () => {
    if (integration.status === 'connected') return 'Connected';
    if (integration.status === 'connecting') return 'Connecting...';
    return `Connect ${integration.name}`;
  };

  const handleConnect = async () => {
    if (!isEnabled) {
      setShowModal(true);
      return;
    }

    if (!user) {
      toast.error('Please log in to connect integrations');
      return;
    }

    setIsConnecting(true);
    try {
      await integrationService.connectIntegration(integrationType, {}, user.id);
      toast.success(`${integration.name} connected successfully`);
    } catch (error) {
      toast.error(`Failed to connect ${integration.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleConnect}
        disabled={isConnecting || integration.status === 'connecting'}
        className="flex items-center gap-2"
      >
        {getStatusIcon()}
        {getButtonText()}
        {integration.status === 'connected' && (
          <Badge variant="secondary" className="ml-2">
            Active
          </Badge>
        )}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {integration.name} Integration
            </DialogTitle>
            <DialogDescription>
              Direct integration with {integration.name} coming soon!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {integration.description}
            </p>
            <p className="text-sm">
              We're working hard to bring you seamless integration with {integration.name}. 
              Contact us if you'd like to be first to access this feature when it's ready!
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowModal(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}