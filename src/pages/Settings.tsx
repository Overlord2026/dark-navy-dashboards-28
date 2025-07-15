
import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  Shield,
  AlertTriangle
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) {
      toast.error('You must be logged in to change 2FA settings');
      return;
    }

    setIsUpdating2FA(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: enabled })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating 2FA setting:', error);
        toast.error('Failed to update 2FA setting');
        return;
      }

      await refreshProfile();
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating 2FA setting:', error);
      toast.error('Failed to update 2FA setting');
    } finally {
      setIsUpdating2FA(false);
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5 h-auto">
          <TabsTrigger value="profile" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6">
              <p>Profile settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <p>Notification preferences will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="two-factor-auth" className="text-base font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by requiring a verification code when signing in.
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={userProfile?.twoFactorEnabled || false}
                    onCheckedChange={handleToggle2FA}
                    disabled={isUpdating2FA}
                  />
                </div>
                
                {userProfile?.twoFactorEnabled && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Two-Factor Authentication is Active
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          You will need to enter a verification code sent to your email each time you sign in.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Password Change */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your account password.
                  </p>
                </div>
                <Button variant="outline" className="w-fit">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Theme</h3>
                <p className="text-muted-foreground mb-4">Select your preferred theme for the application.</p>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardContent className="pt-6">
              <p>Language settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
