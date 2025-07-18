import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { EventTrackingDemo } from './EventTrackingDemo';
import { toast } from 'sonner';
import {
  Webhook,
  Plus,
  Trash2,
  Edit,
  Eye,
  Send,
  Activity,
  Settings,
  ExternalLink,
  Check,
  X,
  Clock
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret_key?: string;
  is_active: boolean;
  events: string[];
  headers: any; // Changed from Record<string, string> to any to match Json type
  retry_attempts: number;
  timeout_seconds: number;
  created_at: string;
}

interface WebhookDelivery {
  id: string;
  event_type: string;
  response_status?: number;
  error_message?: string;
  attempt_number: number;
  delivered_at?: string;
  created_at: string;
}

interface CRMIntegration {
  id: string;
  integration_type: string;
  is_active: boolean;
  api_endpoint?: string;
  settings: any; // Changed from Record<string, any> to any to match Json type
  field_mappings: any; // Changed from Record<string, string> to any to match Json type
  sync_frequency: string;
  last_sync_at?: string;
}

const AVAILABLE_EVENTS = [
  'user.registered',
  'user.onboarded',
  'lead.created',
  'lead.converted',
  'appointment.booked',
  'resource.downloaded',
  'page.viewed',
  'feature.used',
  'profile.updated',
  'document.uploaded',
  'calculator.used'
];

const CRM_TYPES = [
  { value: 'gohighlevel', label: 'GoHighLevel' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'pipedrive', label: 'Pipedrive' },
  { value: 'custom', label: 'Custom CRM' }
];

export const WebhookManager: React.FC = () => {
  const { currentTenant } = useTenant();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCrmDialog, setShowCrmDialog] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      fetchData();
    }
  }, [currentTenant]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch webhooks
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhook_configs')
        .select('*')
        .eq('tenant_id', currentTenant?.id)
        .order('created_at', { ascending: false });

      if (webhookError) throw webhookError;
      setWebhooks(webhookData || []);

      // Fetch recent deliveries
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('webhook_deliveries')
        .select(`
          *,
          webhook_config:webhook_configs(name)
        `)
        .in('webhook_config_id', (webhookData || []).map(w => w.id))
        .order('created_at', { ascending: false })
        .limit(50);

      if (deliveryError) throw deliveryError;
      setDeliveries(deliveryData || []);

      // Fetch CRM integrations
      const { data: crmData, error: crmError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('tenant_id', currentTenant?.id);

      if (crmError) throw crmError;
      setCrmIntegrations(crmData || []);

    } catch (error) {
      console.error('Error fetching webhook data:', error);
      toast.error('Failed to load webhook data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async (formData: FormData) => {
    try {
      const events = formData.getAll('events') as string[];
      const headers = JSON.parse(formData.get('headers') as string || '{}');

      const { error } = await supabase
        .from('webhook_configs')
        .insert([{
          tenant_id: currentTenant?.id,
          name: formData.get('name') as string,
          url: formData.get('url') as string,
          secret_key: formData.get('secret_key') as string || null,
          events,
          headers,
          retry_attempts: parseInt(formData.get('retry_attempts') as string) || 3,
          timeout_seconds: parseInt(formData.get('timeout_seconds') as string) || 30,
          is_active: true
        }]);

      if (error) throw error;

      toast.success('Webhook created successfully');
      setShowCreateDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      const { data, error } = await supabase.functions.invoke('trigger-webhooks', {
        body: {
          eventType: 'test.webhook',
          payload: {
            test: true,
            timestamp: new Date().toISOString(),
            webhook_name: webhook.name
          },
          webhookIds: [webhook.id]
        }
      });

      if (error) throw error;

      toast.success('Test webhook sent successfully');
      fetchData(); // Refresh to see delivery logs
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to send test webhook');
    }
  };

  const toggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ is_active: isActive })
        .eq('id', webhookId);

      if (error) throw error;

      toast.success(`Webhook ${isActive ? 'enabled' : 'disabled'}`);
      fetchData();
    } catch (error) {
      console.error('Error toggling webhook:', error);
      toast.error('Failed to update webhook');
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      toast.success('Webhook deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Webhook Management</h2>
          <p className="text-muted-foreground">
            Configure webhooks and CRM integrations for real-time event notifications
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showCrmDialog} onOpenChange={setShowCrmDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                CRM Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>CRM Integrations</DialogTitle>
              </DialogHeader>
              <CRMIntegrationForm 
                integrations={crmIntegrations}
                onSave={() => {
                  fetchData();
                  setShowCrmDialog(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
              </DialogHeader>
              <WebhookForm onSubmit={handleCreateWebhook} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery Logs</TabsTrigger>
          <TabsTrigger value="crm">CRM Status</TabsTrigger>
          <TabsTrigger value="demo">Event Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Webhook className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={webhook.is_active ? "default" : "secondary"}>
                      {webhook.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Retries: {webhook.retry_attempts} • Timeout: {webhook.timeout_seconds}s
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWebhook(webhook)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {webhooks.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Webhook className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold">No webhooks configured</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first webhook to receive real-time event notifications
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <DeliveryLogs deliveries={deliveries} />
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <CRMStatus integrations={crmIntegrations} />
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <EventTrackingDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Webhook Form Component
const WebhookForm: React.FC<{ onSubmit: (data: FormData) => void }> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Webhook Name</Label>
        <Input id="name" name="name" required placeholder="My Webhook" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Endpoint URL</Label>
        <Input id="url" name="url" type="url" required placeholder="https://example.com/webhook" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secret_key">Secret Key (Optional)</Label>
        <Input id="secret_key" name="secret_key" placeholder="For webhook signature verification" />
      </div>

      <div className="space-y-2">
        <Label>Events to Subscribe</Label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_EVENTS.map((event) => (
            <label key={event} className="flex items-center space-x-2">
              <input type="checkbox" name="events" value={event} />
              <span className="text-sm">{event}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="retry_attempts">Retry Attempts</Label>
          <Input id="retry_attempts" name="retry_attempts" type="number" defaultValue="3" min="1" max="10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeout_seconds">Timeout (seconds)</Label>
          <Input id="timeout_seconds" name="timeout_seconds" type="number" defaultValue="30" min="5" max="300" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">Additional Headers (JSON)</Label>
        <Textarea
          id="headers"
          name="headers"
          placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Create Webhook</Button>
      </div>
    </form>
  );
};

// Delivery Logs Component
const DeliveryLogs: React.FC<{ deliveries: WebhookDelivery[] }> = ({ deliveries }) => {
  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="animate-fade-in">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{delivery.event_type}</Badge>
                  {delivery.response_status && (
                    <Badge
                      variant={delivery.response_status < 300 ? "default" : "destructive"}
                    >
                      {delivery.response_status}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Attempt {delivery.attempt_number}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(delivery.created_at).toLocaleString()}
                </p>
                {delivery.error_message && (
                  <p className="text-sm text-destructive">{delivery.error_message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {delivery.delivered_at ? (
                  <Check className="h-4 w-4 text-success" />
                ) : delivery.error_message ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  <Clock className="h-4 w-4 text-warning" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {deliveries.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No delivery logs</h3>
              <p className="text-sm text-muted-foreground">
                Webhook delivery logs will appear here once events are triggered
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// CRM Status Component
const CRMStatus: React.FC<{ integrations: CRMIntegration[] }> = ({ integrations }) => {
  return (
    <div className="grid gap-4">
      {integrations.map((integration) => (
        <Card key={integration.id} className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg capitalize">
                {integration.integration_type}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Last sync: {integration.last_sync_at 
                  ? new Date(integration.last_sync_at).toLocaleString() 
                  : 'Never'
                }
              </p>
            </div>
            <Badge variant={integration.is_active ? "default" : "secondary"}>
              {integration.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Sync Frequency:</strong> {integration.sync_frequency}
              </p>
              {integration.api_endpoint && (
                <p className="text-sm">
                  <strong>Endpoint:</strong> {integration.api_endpoint}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {integrations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No CRM integrations</h3>
              <p className="text-sm text-muted-foreground">
                Configure CRM integrations to sync lead and customer data automatically
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// CRM Integration Form Component
const CRMIntegrationForm: React.FC<{
  integrations: CRMIntegration[];
  onSave: () => void;
}> = ({ integrations, onSave }) => {
  // Implementation would go here for CRM configuration
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        CRM integration configuration coming soon. This will allow you to sync leads and customer data with your CRM system.
      </p>
      <Button onClick={onSave}>Close</Button>
    </div>
  );
};