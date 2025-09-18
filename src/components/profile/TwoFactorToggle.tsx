import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Shield, AlertTriangle } from "lucide-react";
import { TwoFactorDialog } from "./TwoFactorDialog";
import { supabase } from "@/integrations/supabase/client";

interface TwoFactorToggleProps {
  className?: string;
  onMFAEnabled?: () => void;
}

export function TwoFactorToggle({ className, onMFAEnabled }: TwoFactorToggleProps) {
  const { user, refreshProfile } = useAuth();
  const { userProfile } = useUser();
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [disabling, setDisabling] = useState(false);
  
  const isEnabled = userProfile?.twoFactorEnabled || false;

  const handleToggle = async (enabled: boolean) => {
    if (!user) return;

    if (enabled) {
      // Show dialog to enable 2FA
      setShowEnableDialog(true);
    } else {
      // Disable 2FA
      setDisabling(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ two_factor_enabled: false })
          .eq('id', user.id);

        if (error) {
          console.error('Error disabling 2FA:', error);
          toast.error('Failed to disable two-factor authentication');
          return;
        }

        // Refresh profile to update the UI
        await refreshProfile();
        toast.success('Two-factor authentication disabled');
      } catch (error) {
        console.error('Error disabling 2FA:', error);
        toast.error('Failed to disable two-factor authentication');
      } finally {
        setDisabling(false);
      }
    }
  };

  const handleDialogOpenChange = async (open: boolean) => {
    setShowEnableDialog(open);
    if (!open) {
      // Refresh profile after dialog closes to update the toggle state
      await refreshProfile();
      
      // Small delay to ensure database update has propagated
      setTimeout(async () => {
        await refreshProfile();
        // Call onMFAEnabled callback if MFA was just enabled
        if (onMFAEnabled) {
          onMFAEnabled();
        }
      }, 500);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleToggle}
          disabled={disabling}
        />
      </div>

      {isEnabled && (
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Two-Factor Authentication Enabled
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your account is protected with an additional verification step during login.
            </p>
          </div>
        </div>
      )}

      <TwoFactorDialog
        open={showEnableDialog}
        onOpenChange={handleDialogOpenChange}
      />
    </div>
  );
}