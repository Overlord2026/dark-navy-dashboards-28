import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Users, Upload, Settings, Crown, Mail, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StaffInvite {
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const defaultSteps: SetupStep[] = [
  { id: 'firm', title: 'Firm Details', description: 'Basic firm information', completed: false, required: true },
  { id: 'licensing', title: 'Seat Licensing', description: 'Configure user seats and billing', completed: false, required: true },
  { id: 'staff', title: 'Staff Setup', description: 'Invite team members and set roles', completed: false, required: false },
  { id: 'branding', title: 'White-label Portal', description: 'Customize client portal branding', completed: false, required: false },
  { id: 'import', title: 'Data Import', description: 'Import existing client data', completed: false, required: false }
];

const rolePermissions = {
  admin: ['all_access', 'manage_staff', 'billing', 'client_management'],
  manager: ['client_management', 'staff_oversight', 'reports'],
  senior: ['client_management', 'document_review', 'e_signatures'],
  associate: ['document_preparation', 'client_communication'],
  intern: ['document_preparation']
};

export function CPAFirmSetupWizard() {
  const [currentStep, setCurrentStep] = useState('firm');
  const [steps, setSteps] = useState(defaultSteps);
  const [firmData, setFirmData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    ein: '',
    license: ''
  });
  const [licensingData, setLicensingData] = useState({
    plan: 'professional',
    seats: 5,
    billing: 'monthly'
  });
  const [staffInvites, setStaffInvites] = useState<StaffInvite[]>([]);
  const [brandingData, setBrandingData] = useState({
    logoUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    portalName: ''
  });
  const { toast } = useToast();

  const updateStepCompletion = (stepId: string, completed: boolean) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed } : step
    ));
  };

  const addStaffInvite = () => {
    setStaffInvites(prev => [...prev, {
      email: '',
      name: '',
      role: 'associate',
      permissions: rolePermissions.associate
    }]);
  };

  const removeStaffInvite = (index: number) => {
    setStaffInvites(prev => prev.filter((_, i) => i !== index));
  };

  const updateStaffInvite = (index: number, field: keyof StaffInvite, value: any) => {
    setStaffInvites(prev => prev.map((invite, i) => 
      i === index ? { 
        ...invite, 
        [field]: value,
        ...(field === 'role' ? { permissions: rolePermissions[value as keyof typeof rolePermissions] } : {})
      } : invite
    ));
  };

  const handleFirmSubmit = async () => {
    try {
      const { error } = await supabase
        .from('cpa_partners')
        .insert({
          firm_name: firmData.name,
          phone: firmData.phone,
          business_address: firmData.address,
          status: 'active'
        });

      if (error) throw error;

      updateStepCompletion('firm', true);
      toast({
        title: "Firm details saved",
        description: "Your firm information has been successfully configured.",
      });
      
      setCurrentStep('licensing');
    } catch (error: any) {
      toast({
        title: "Error saving firm details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLicensingSubmit = async () => {
    // In a real implementation, this would integrate with billing system
    updateStepCompletion('licensing', true);
    toast({
      title: "Licensing configured",
      description: `${licensingData.plan} plan with ${licensingData.seats} seats activated.`,
    });
    setCurrentStep('staff');
  };

  const handleStaffSubmit = async () => {
    try {
      // Send invitations to staff members
      for (const invite of staffInvites) {
        if (invite.email && invite.name) {
          const { error } = await supabase.functions.invoke('send-staff-invite', {
            body: {
              email: invite.email,
              name: invite.name,
              role: invite.role,
              permissions: invite.permissions
            }
          });

          if (error) throw error;
        }
      }

      updateStepCompletion('staff', true);
      toast({
        title: "Staff invitations sent",
        description: `${staffInvites.length} team members have been invited.`,
      });
      
      setCurrentStep('branding');
    } catch (error: any) {
      toast({
        title: "Error sending invitations",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBrandingSubmit = async () => {
    try {
      const { error } = await supabase
        .from('tenant_settings')
        .upsert({
          tenant_id: (await supabase.auth.getUser()).data.user?.id,
          primary_color: brandingData.primaryColor,
          secondary_color: brandingData.secondaryColor,
          logo_url: brandingData.logoUrl,
          custom_portal_name: brandingData.portalName
        });

      if (error) throw error;

      updateStepCompletion('branding', true);
      toast({
        title: "Branding configured",
        description: "Your white-label portal has been customized.",
      });
      
      setCurrentStep('import');
    } catch (error: any) {
      toast({
        title: "Error saving branding",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">CPA Firm Setup Wizard</h3>
          <p className="text-muted-foreground">
            Complete your firm setup to get started with the platform
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {completedSteps}/{steps.length} Complete
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Setup Progress
          </CardTitle>
          <CardDescription>
            Complete all required steps to activate your firm account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
              {steps.map((step) => (
                <Button
                  key={step.id}
                  variant={currentStep === step.id ? 'default' : step.completed ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentStep(step.id)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                >
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      currentStep === step.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`} />
                  )}
                  <span className="text-xs text-center leading-tight">{step.title}</span>
                  {step.required && !step.completed && (
                    <Badge variant="destructive" className="text-xs px-1">Required</Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
        {/* Firm Details */}
        <TabsContent value="firm">
          <Card>
            <CardHeader>
              <CardTitle>Firm Details</CardTitle>
              <CardDescription>
                Enter your firm's basic information and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name *</Label>
                  <Input
                    id="firmName"
                    value={firmData.name}
                    onChange={(e) => setFirmData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Smith & Associates CPA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmEmail">Contact Email *</Label>
                  <Input
                    id="firmEmail"
                    type="email"
                    value={firmData.email}
                    onChange={(e) => setFirmData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@smithcpa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmPhone">Phone Number</Label>
                  <Input
                    id="firmPhone"
                    value={firmData.phone}
                    onChange={(e) => setFirmData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmWebsite">Website</Label>
                  <Input
                    id="firmWebsite"
                    value={firmData.website}
                    onChange={(e) => setFirmData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://smithcpa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmEin">EIN</Label>
                  <Input
                    id="firmEin"
                    value={firmData.ein}
                    onChange={(e) => setFirmData(prev => ({ ...prev, ein: e.target.value }))}
                    placeholder="12-3456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmLicense">CPA License Number</Label>
                  <Input
                    id="firmLicense"
                    value={firmData.license}
                    onChange={(e) => setFirmData(prev => ({ ...prev, license: e.target.value }))}
                    placeholder="CPA-12345"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firmAddress">Business Address *</Label>
                <Textarea
                  id="firmAddress"
                  value={firmData.address}
                  onChange={(e) => setFirmData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street, Suite 100, City, State 12345"
                  rows={3}
                />
              </div>
              <Button onClick={handleFirmSubmit} className="w-full">
                Save Firm Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seat Licensing */}
        <TabsContent value="licensing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Seat Licensing & Billing
              </CardTitle>
              <CardDescription>
                Configure your subscription plan and user seat allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`cursor-pointer border-2 ${licensingData.plan === 'starter' ? 'border-primary' : 'border-muted'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Starter</CardTitle>
                    <div className="text-2xl font-bold">$99/mo</div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">Up to 3 users</div>
                    <Button 
                      variant={licensingData.plan === 'starter' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLicensingData(prev => ({ ...prev, plan: 'starter', seats: 3 }))}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer border-2 ${licensingData.plan === 'professional' ? 'border-primary' : 'border-muted'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Professional</CardTitle>
                    <div className="text-2xl font-bold">$199/mo</div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">Up to 10 users</div>
                    <Button 
                      variant={licensingData.plan === 'professional' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLicensingData(prev => ({ ...prev, plan: 'professional', seats: 10 }))}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer border-2 ${licensingData.plan === 'enterprise' ? 'border-primary' : 'border-muted'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Enterprise</CardTitle>
                    <div className="text-2xl font-bold">$399/mo</div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">Unlimited users</div>
                    <Button 
                      variant={licensingData.plan === 'enterprise' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLicensingData(prev => ({ ...prev, plan: 'enterprise', seats: 999 }))}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of User Seats</Label>
                    <Input
                      type="number"
                      value={licensingData.seats.toString()}
                      onChange={(e) => setLicensingData(prev => ({ ...prev, seats: parseInt(e.target.value) || 1 }))}
                      min="1"
                      max={licensingData.plan === 'enterprise' ? 999 : licensingData.plan === 'professional' ? 10 : 3}
                    />
                  <p className="text-sm text-muted-foreground">
                    Additional seats: $25/month per user
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Billing Frequency</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={licensingData.billing === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setLicensingData(prev => ({ ...prev, billing: 'monthly' }))}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={licensingData.billing === 'annual' ? 'default' : 'outline'}
                      onClick={() => setLicensingData(prev => ({ ...prev, billing: 'annual' }))}
                    >
                      Annual (Save 20%)
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleLicensingSubmit} className="w-full">
                Configure Licensing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Setup */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Staff Setup & Bulk Invites
              </CardTitle>
              <CardDescription>
                Invite team members and configure their roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Team Member Invitations</h4>
                  <p className="text-sm text-muted-foreground">
                    Add team members and set their access levels
                  </p>
                </div>
                <Button onClick={addStaffInvite} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {staffInvites.map((invite, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={invite.name}
                            onChange={(e) => updateStaffInvite(index, 'name', e.target.value)}
                            placeholder="John Smith"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Email</Label>
                          <Input
                            type="email"
                            value={invite.email}
                            onChange={(e) => updateStaffInvite(index, 'email', e.target.value)}
                            placeholder="john@firm.com"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Role</Label>
                          <select
                            value={invite.role}
                            onChange={(e) => updateStaffInvite(index, 'role', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-md"
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="senior">Senior Associate</option>
                            <option value="associate">Associate</option>
                            <option value="intern">Intern</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStaffInvite(index)}
                            className="text-red-600 border-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs">Permissions</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {invite.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {staffInvites.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No team members added yet</p>
                  <p className="text-sm">Click "Add Member" to invite your team</p>
                </div>
              )}

              <Button onClick={handleStaffSubmit} className="w-full" disabled={staffInvites.length === 0}>
                <Mail className="w-4 h-4 mr-2" />
                Send {staffInvites.length} Invitations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* White-label Portal */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>White-label Portal Configuration</CardTitle>
              <CardDescription>
                Customize the client portal with your firm's branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="portalName">Portal Name</Label>
                    <Input
                      id="portalName"
                      value={brandingData.portalName}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, portalName: e.target.value }))}
                      placeholder="Smith CPA Client Portal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={brandingData.logoUrl}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://yourfirm.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={brandingData.primaryColor}
                        onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingData.primaryColor}
                        onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#2563eb"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={brandingData.secondaryColor}
                        onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingData.secondaryColor}
                        onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#64748b"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div 
                    className="border rounded-md p-4 space-y-2"
                    style={{ borderColor: brandingData.primaryColor }}
                  >
                    <div 
                      className="h-8 rounded"
                      style={{ backgroundColor: brandingData.primaryColor }}
                    />
                    <div className="text-sm font-medium">
                      {brandingData.portalName || 'Your Portal Name'}
                    </div>
                    <div 
                      className="text-xs p-2 rounded"
                      style={{ backgroundColor: brandingData.secondaryColor, color: 'white' }}
                    >
                      Sample portal content with your branding
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleBrandingSubmit} className="w-full">
                Save Branding Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Import */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Data Import Setup
              </CardTitle>
              <CardDescription>
                Import existing client data and configure integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Data import functionality will be available in the Data Import tab of the main dashboard.
                You can import from Drake, CCH, Xero, and QuickBooks formats.
              </p>
              <Button 
                onClick={() => updateStepCompletion('import', true)}
                variant="outline"
                className="w-full"
              >
                Skip for Now - Setup Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {completedSteps === steps.length && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Setup Complete!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your CPA firm is now fully configured and ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Go to Practice Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}