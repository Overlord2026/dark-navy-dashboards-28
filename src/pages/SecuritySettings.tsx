import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const SecuritySettings = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);
  const navigate = useNavigate();

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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Security Settings</h1>
      </div>
      
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
    </div>
  );
};

export default SecuritySettings;