import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Mail,
  Drive,
  Video,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleIntegrationService } from '@/services/integrations/GoogleIntegrationService';

interface GoogleIntegrationPanelProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function GoogleIntegrationPanel({ onConnectionChange }: GoogleIntegrationPanelProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [scopes, setScopes] = useState<string[]>([]);

  React.useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = await googleIntegrationService.isGoogleConnected();
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      onConnectionChange?.(connected);
    } catch (error) {
      console.error('Error checking Google connection:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const authUrl = await googleIntegrationService.initiateGoogleAuth('advisor');
      
      // Open popup for OAuth
      const popup = window.open(authUrl, 'google-oauth', 'width=500,height=600');
      
      // Poll for popup closure
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer);
          setIsConnecting(false);
          checkConnectionStatus();
        }
      }, 1000);

      // Set timeout for auth process
      setTimeout(() => {
        if (!popup?.closed) {
          popup?.close();
          setIsConnecting(false);
          toast({
            title: "Authentication Timeout",
            description: "Please try connecting again.",
            variant: "destructive"
          });
        }
      }, 300000); // 5 minutes

    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: "Failed to start Google authentication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      // TODO: Implement disconnect logic
      setIsConnected(false);
      setConnectionStatus('disconnected');
      onConnectionChange?.(false);
      
      toast({
        title: "Google Disconnected",
        description: "Your Google Workspace integration has been disabled.",
      });
    } catch (error) {
      console.error('Error disconnecting Google:', error);
    }
  };

  const handleSync = async () => {
    try {
      await googleIntegrationService.syncCalendarEvents('bidirectional');
      toast({
        title: "Sync Complete ✅",
        description: "Your Google Calendar and BFO are now synchronized.",
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      default:
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  const integrationFeatures = [
    {
      icon: <Calendar className="h-4 w-4" />,
      name: 'Google Calendar',
      description: 'Two-way sync for all meetings and events',
      status: isConnected ? 'active' : 'inactive'
    },
    {
      icon: <Video className="h-4 w-4" />,
      name: 'Google Meet',
      description: 'Auto-generate Meet links for all meetings',
      status: isConnected ? 'active' : 'inactive'
    },
    {
      icon: <Mail className="h-4 w-4" />,
      name: 'Gmail Integration',
      description: 'Send notifications and confirmations via Gmail',
      status: isConnected ? 'active' : 'inactive'
    },
    {
      icon: <Drive className="h-4 w-4" />,
      name: 'Google Drive',
      description: 'Store meeting recordings and documents',
      status: isConnected ? 'active' : 'inactive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Google Workspace Integration
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Phase 1: Google Centralization</strong></p>
                    <p>Connect your Google Workspace to enable BFO's integrated scheduling, calendar sync, Gmail notifications, and Google Drive storage.</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Google Account
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Google Workspace is connected and active. All BFO meetings will default to Google Meet with automatic calendar sync.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={handleSync} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Calendar
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Google Integration Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Auto-sync Calendar Events</Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Enable two-way calendar synchronization</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Default Meeting Platform</Label>
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="platform" defaultChecked />
                          <span className="text-sm">Google Meet (Recommended)</span>
                        </div>
                      </div>
                      
                      <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                        Disconnect Google Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-lg ${
                  feature.status === 'active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{feature.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Badge 
                  variant={feature.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}