
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, FileText, UserCog } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RolePermissions {
  canPublish: boolean;
  canViewStrategicData: boolean;
  canEditCode: boolean;
  description: string;
}

interface IPProtectionSettings {
  twoFactorForPublishing: boolean;
  publisherPhoneNumber: string;
  roles: {
    admin: RolePermissions;
    developer: RolePermissions;
    assistant: RolePermissions;
  };
  ipDisclaimer: string;
  selectedRole?: string;
  currentUsername?: string;
}

export function IPProtectionSettings() {
  const [settings, setSettings] = useState<IPProtectionSettings>({
    twoFactorForPublishing: true,
    publisherPhoneNumber: "",
    roles: {
      admin: { 
        canPublish: true, 
        canViewStrategicData: true, 
        canEditCode: true,
        description: "Full read/write/publish. Bypasses normal restrictions but still requires 2FA for final publish."
      },
      developer: { 
        canPublish: false, 
        canViewStrategicData: false, 
        canEditCode: true,
        description: "Can view and edit code or modules, but cannot publish without admin approval/2FA."
      },
      assistant: { 
        canPublish: false, 
        canViewStrategicData: false, 
        canEditCode: false,
        description: "Can view certain sections, provide content, but cannot access backend code or publish changes."
      },
    },
    ipDisclaimer: "All content, code, designs, and intellectual property created within this application are the exclusive property of the company. No reproduction, distribution, or usage outside the terms of service is permitted.",
    selectedRole: undefined,
    currentUsername: ""
  });

  const [verifying2FA, setVerifying2FA] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [activeTab, setActiveTab] = useState("2fa");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);

  const form = useForm();

  const handleSettingChange = (path: string[], value: any) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      let current: any = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      current[lastKey] = value;
      
      return newSettings;
    });
  };

  const sendVerificationCode = () => {
    if (!settings.publisherPhoneNumber || settings.publisherPhoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Simulate sending code
    toast.success("Verification code sent to your phone");
    setShowVerificationForm(true);

    // Log this action to the audit log
    auditLog.log(
      "current-user",
      "settings_change",
      "success",
      {
        userName: "Administrator",
        userRole: "admin",
        details: { 
          action: "ip_protection_2fa_code_sent", 
          phoneNumber: settings.publisherPhoneNumber.replace(/\d(?=\d{4})/g, "*") // Mask the phone number
        }
      }
    );
  };

  const verifyAndSave = () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setVerifying2FA(true);

    // Simulate verification
    setTimeout(() => {
      setVerifying2FA(false);
      setShowVerificationForm(false);
      toast.success("IP Protection & Security Settings saved successfully");
      
      // Log successful settings change to audit log
      auditLog.log(
        "current-user",
        "settings_change",
        "success",
        {
          userName: "Administrator",
          userRole: "admin",
          details: { 
            action: "ip_protection_settings_updated",
            changes: {
              twoFactorForPublishing: settings.twoFactorForPublishing,
              rolePermissionsUpdated: true,
              ipDisclaimerUpdated: true
            }
          }
        }
      );
    }, 1500);
  };

  const handleSave = () => {
    if (settings.twoFactorForPublishing) {
      sendVerificationCode();
    } else {
      // If 2FA is disabled, save directly
      toast.success("IP Protection & Security Settings saved successfully");
      
      // Log successful settings change to audit log
      auditLog.log(
        "current-user",
        "settings_change",
        "success",
        {
          userName: "Administrator",
          userRole: "admin",
          details: { 
            action: "ip_protection_settings_updated",
            changes: {
              twoFactorForPublishing: settings.twoFactorForPublishing,
              rolePermissionsUpdated: true,
              ipDisclaimerUpdated: true
            }
          }
        }
      );
    }
  };

  const assignRole = () => {
    if (!settings.selectedRole || !settings.currentUsername) {
      toast.error("Please select a role and enter a username");
      return;
    }

    // Simulate role assignment
    toast.success(`Role '${settings.selectedRole}' assigned to ${settings.currentUsername}`);
    
    // Log role assignment to audit log
    auditLog.log(
      "current-user",
      "role_assignment",
      "success",
      {
        userName: "Administrator",
        userRole: "admin",
        details: { 
          action: "user_role_assigned",
          username: settings.currentUsername,
          assignedRole: settings.selectedRole
        }
      }
    );

    // Clear the form
    setSettings(prev => ({
      ...prev,
      selectedRole: undefined,
      currentUsername: ""
    }));
    setShowRoleAssignment(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">IP Protection & Security Settings</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Two-Factor Authentication</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Role Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="disclaimer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>IP Disclaimer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2fa" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Two-Factor Authentication for Publishing
              </CardTitle>
              <CardDescription>
                Secure publishing actions with an additional verification step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="2fa-toggle"
                  checked={settings.twoFactorForPublishing}
                  onCheckedChange={(checked) => handleSettingChange(['twoFactorForPublishing'], checked)}
                />
                <Label htmlFor="2fa-toggle">Require 2FA for all publishing actions</Label>
              </div>
              
              {settings.twoFactorForPublishing && (
                <div className="space-y-4 mt-4 p-4 border rounded-md bg-background/50">
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Publisher's Phone Number for 2FA</Label>
                    <Input 
                      id="phone-number" 
                      type="tel" 
                      placeholder="(123) 456-7890"
                      value={settings.publisherPhoneNumber}
                      onChange={(e) => handleSettingChange(['publisherPhoneNumber'], e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Verification codes will be sent to this number when publishing changes
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Role-Based Permissions
              </CardTitle>
              <CardDescription>
                Define what each user role can access and modify
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Admin Role */}
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Administrator Role</h3>
                  <p className="text-sm text-muted-foreground mb-4">{settings.roles.admin.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-publish">Can publish changes</Label>
                      <Switch 
                        id="admin-publish"
                        checked={settings.roles.admin.canPublish}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'admin', 'canPublish'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-strategic">Can view strategic data</Label>
                      <Switch 
                        id="admin-strategic"
                        checked={settings.roles.admin.canViewStrategicData}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'admin', 'canViewStrategicData'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-code">Can edit code</Label>
                      <Switch 
                        id="admin-code"
                        checked={settings.roles.admin.canEditCode}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'admin', 'canEditCode'], checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Developer Role */}
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Developer Role</h3>
                  <p className="text-sm text-muted-foreground mb-4">{settings.roles.developer.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="developer-publish">Can publish changes</Label>
                      <Switch 
                        id="developer-publish"
                        checked={settings.roles.developer.canPublish}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'developer', 'canPublish'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="developer-strategic">Can view strategic data</Label>
                      <Switch 
                        id="developer-strategic"
                        checked={settings.roles.developer.canViewStrategicData}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'developer', 'canViewStrategicData'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="developer-code">Can edit code</Label>
                      <Switch 
                        id="developer-code"
                        checked={settings.roles.developer.canEditCode}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'developer', 'canEditCode'], checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Assistant Role */}
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Assistant/Editor Role</h3>
                  <p className="text-sm text-muted-foreground mb-4">{settings.roles.assistant.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-publish">Can publish changes</Label>
                      <Switch 
                        id="assistant-publish"
                        checked={settings.roles.assistant.canPublish}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'assistant', 'canPublish'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-strategic">Can view strategic data</Label>
                      <Switch 
                        id="assistant-strategic"
                        checked={settings.roles.assistant.canViewStrategicData}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'assistant', 'canViewStrategicData'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-code">Can edit code</Label>
                      <Switch 
                        id="assistant-code"
                        checked={settings.roles.assistant.canEditCode}
                        onCheckedChange={(checked) => handleSettingChange(['roles', 'assistant', 'canEditCode'], checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRoleAssignment(!showRoleAssignment)}
                    className="w-full"
                  >
                    {showRoleAssignment ? "Cancel Role Assignment" : "Assign Role to User"}
                  </Button>

                  {showRoleAssignment && (
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="text-lg font-medium mb-4">Assign Role to User</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            placeholder="Enter username"
                            value={settings.currentUsername || ""}
                            onChange={(e) => handleSettingChange(['currentUsername'], e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role-select">Select Role</Label>
                          <Select 
                            value={settings.selectedRole} 
                            onValueChange={(value) => handleSettingChange(['selectedRole'], value)}
                          >
                            <SelectTrigger id="role-select">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="assistant">Assistant/Editor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {settings.selectedRole && (
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <h4 className="font-medium mb-2">Role Privileges:</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex justify-between">
                                <span>Can publish changes:</span>
                                <span>{settings.roles[settings.selectedRole as keyof typeof settings.roles].canPublish ? "Yes" : "No"}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Can view strategic data:</span>
                                <span>{settings.roles[settings.selectedRole as keyof typeof settings.roles].canViewStrategicData ? "Yes" : "No"}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Can edit code:</span>
                                <span>{settings.roles[settings.selectedRole as keyof typeof settings.roles].canEditCode ? "Yes" : "No"}</span>
                              </li>
                            </ul>
                          </div>
                        )}
                        
                        <Button 
                          onClick={assignRole}
                          className="w-full mt-4"
                          disabled={!settings.selectedRole || !settings.currentUsername}
                        >
                          Confirm Role Assignment
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disclaimer" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                IP Ownership Disclaimer
              </CardTitle>
              <CardDescription>
                Define the legal disclaimer for intellectual property ownership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  id="ip-disclaimer"
                  value={settings.ipDisclaimer}
                  onChange={(e) => handleSettingChange(['ipDisclaimer'], e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This disclaimer will be displayed in Terms of Service, documentation, and other appropriate places within the application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showVerificationForm ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {settings.publisherPhoneNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              
              <div className="flex space-x-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowVerificationForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={verifyAndSave}
                  disabled={verifying2FA || otpValue.length !== 6}
                >
                  {verifying2FA ? "Verifying..." : "Verify & Save"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Settings
          </Button>
        </div>
      )}
    </div>
  );
}
