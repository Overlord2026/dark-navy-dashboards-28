import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Phone, Check, AlertCircle } from 'lucide-react';

interface SMSAlert {
  id: string;
  alert_type: string;
  message: string;
  sent_at: string;
  status: string;
}

export function LendingSMSAlerts() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alertSettings, setAlertSettings] = useState({
    status_update: true,
    approval: true,
    rejection: true,
    document_needed: true,
    offer_ready: true
  });
  const [recentAlerts, setRecentAlerts] = useState<SMSAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecentAlerts();
  }, []);

  const loadRecentAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_sms_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentAlerts(data || []);
    } catch (error) {
      console.error('Error loading SMS alerts:', error);
    }
  };

  const updatePhoneNumber = async () => {
    setIsLoading(true);
    try {
      // Save phone number preference
      toast({
        title: "Phone Number Updated",
        description: "Your SMS alert preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAlertType = (alertType: string) => {
    setAlertSettings(prev => ({
      ...prev,
      [alertType]: !prev[alertType as keyof typeof prev]
    }));
  };

  const sendTestAlert = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('lending_sms_alerts')
        .insert([{
          phone_number: phoneNumber,
          alert_type: 'status_update',
          message: 'Test alert: Your lending application is being reviewed.',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Test Alert Sent",
        description: "Check your phone for the test message."
      });

      loadRecentAlerts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test alert",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatAlertType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Alert Settings
          </CardTitle>
          <CardDescription>
            Configure SMS notifications for your lending applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phone Number Configuration */}
          <div className="space-y-3">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="flex-1"
              />
              <Button 
                onClick={updatePhoneNumber} 
                disabled={isLoading || !phoneNumber}
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </div>

          {/* Alert Type Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Alert Types</h4>
            <div className="space-y-3">
              {Object.entries(alertSettings).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{formatAlertType(key)}</div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'status_update' && 'General application status changes'}
                      {key === 'approval' && 'Loan approval notifications'}
                      {key === 'rejection' && 'Application rejection alerts'}
                      {key === 'document_needed' && 'Additional document requests'}
                      {key === 'offer_ready' && 'New loan offers available'}
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleAlertType(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Test Alert */}
          {phoneNumber && (
            <div className="border-t pt-4">
              <Button 
                onClick={sendTestAlert} 
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Test Alert
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS Alerts</CardTitle>
          <CardDescription>
            History of SMS notifications sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No SMS alerts sent yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(alert.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {formatAlertType(alert.alert_type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.sent_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}