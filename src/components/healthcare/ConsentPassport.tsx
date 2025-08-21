import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Clock, FileText } from 'lucide-react';
import { createConsentRDSReceipt, type ConsentRDSReceipt } from '@/types/health-rds';
import { useToast } from '@/hooks/use-toast';

interface ConsentScope {
  docs: number; // 0-100 percentage
  labs: number;
  insurance: number;
}

interface ConsentRole {
  role: string;
  enabled: boolean;
  level: 'read' | 'write' | 'admin';
}

interface ConsentSettings {
  scope: ConsentScope;
  roles: ConsentRole[];
  duration: number; // days
  requiresCoSign: boolean;
  coSignerRole: string;
}

export function ConsentPassport() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ConsentSettings>({
    scope: { docs: 50, labs: 30, insurance: 80 },
    roles: [
      { role: 'Advisor', enabled: true, level: 'read' },
      { role: 'CPA', enabled: false, level: 'read' },
      { role: 'Attorney', enabled: false, level: 'read' },
      { role: 'Clinician', enabled: true, level: 'write' }
    ],
    duration: 90,
    requiresCoSign: false,
    coSignerRole: ''
  });

  const updateScope = (type: keyof ConsentScope, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      scope: { ...prev.scope, [type]: value[0] }
    }));
  };

  const updateRole = (index: number, field: keyof ConsentRole, value: any) => {
    setSettings(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };

  const handleSaveConsent = () => {
    // Prepare consent scope array
    const scopeArray: string[] = [];
    if (settings.scope.docs > 0) scopeArray.push(`documents:${settings.scope.docs}%`);
    if (settings.scope.labs > 0) scopeArray.push(`labs:${settings.scope.labs}%`);
    if (settings.scope.insurance > 0) scopeArray.push(`insurance:${settings.scope.insurance}%`);

    // Prepare route array (enabled roles)
    const routeArray = settings.roles
      .filter(role => role.enabled)
      .map(role => `${role.role}:${role.level}`);

    // Create Consent-RDS receipt
    const consentReceipt: ConsentRDSReceipt = createConsentRDSReceipt(
      scopeArray,
      settings.roles.filter(r => r.enabled).map(r => r.role),
      settings.duration,
      settings.requiresCoSign ? [settings.coSignerRole] : undefined
    );

    console.log('Consent-RDS Receipt:', consentReceipt);

    toast({
      title: "Consent Passport Saved",
      description: `Consent-RDS issued for ${settings.duration} days. Status: ${consentReceipt.revocation.status}`,
    });
  };

  const getScopeColor = (value: number) => {
    if (value < 30) return 'text-green-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'write': return 'bg-orange-100 text-orange-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Consent Passport
        </CardTitle>
        <CardDescription>
          Configure data sharing scope, roles, and duration with co-sign routing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Data Scope Sliders */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Scope Permissions
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Medical Documents</Label>
                <span className={`text-sm font-medium ${getScopeColor(settings.scope.docs)}`}>
                  {settings.scope.docs}%
                </span>
              </div>
              <Slider
                value={[settings.scope.docs]}
                onValueChange={(value) => updateScope('docs', value)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Lab Results</Label>
                <span className={`text-sm font-medium ${getScopeColor(settings.scope.labs)}`}>
                  {settings.scope.labs}%
                </span>
              </div>
              <Slider
                value={[settings.scope.labs]}
                onValueChange={(value) => updateScope('labs', value)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Insurance Information</Label>
                <span className={`text-sm font-medium ${getScopeColor(settings.scope.insurance)}`}>
                  {settings.scope.insurance}%
                </span>
              </div>
              <Slider
                value={[settings.scope.insurance]}
                onValueChange={(value) => updateScope('insurance', value)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Role Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Permissions
          </h3>
          
          <div className="space-y-3">
            {settings.roles.map((role, index) => (
              <div key={role.role} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={role.enabled}
                    onCheckedChange={(checked) => updateRole(index, 'enabled', checked)}
                  />
                  <span className="font-medium">{role.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={role.level}
                    onValueChange={(value) => updateRole(index, 'level', value)}
                    disabled={!role.enabled}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="write">Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getLevelColor(role.level)}>
                    {role.level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration and Co-signing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration (days)
            </Label>
            <Select
              value={settings.duration.toString()}
              onValueChange={(value) => setSettings(prev => ({ ...prev, duration: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.requiresCoSign}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requiresCoSign: checked }))}
              />
              <Label>Requires Co-signature</Label>
            </div>
            
            {settings.requiresCoSign && (
              <Select
                value={settings.coSignerRole}
                onValueChange={(value) => setSettings(prev => ({ ...prev, coSignerRole: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select co-signer role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="guardian">Legal Guardian</SelectItem>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="healthcare_proxy">Healthcare Proxy</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3">Consent Summary</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Enabled Roles:</strong> {settings.roles.filter(r => r.enabled).map(r => r.role).join(', ')}
            </p>
            <p>
              <strong>Data Access:</strong> Documents ({settings.scope.docs}%), 
              Labs ({settings.scope.labs}%), Insurance ({settings.scope.insurance}%)
            </p>
            <p>
              <strong>Valid for:</strong> {settings.duration} days
            </p>
            {settings.requiresCoSign && (
              <p>
                <strong>Co-signer:</strong> {settings.coSignerRole}
              </p>
            )}
          </div>
        </div>

        <Button onClick={handleSaveConsent} className="w-full">
          <Shield className="h-4 w-4 mr-2" />
          Issue Consent-RDS & Save Passport
        </Button>
      </CardContent>
    </Card>
  );
}