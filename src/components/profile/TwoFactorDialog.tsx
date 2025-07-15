import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldIcon, ShieldCheck, ShieldAlert, CheckCircle, ArrowLeft, Edit3 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { auditLog } from "@/services/auditLog/auditLogService";

interface TwoFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorDialog({ open, onOpenChange }: TwoFactorDialogProps) {
  const { user } = useAuth();
  const { userProfile, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'enable' | 'disable'>('enable');
  const [useCustomEmail, setUseCustomEmail] = useState(false);

  const isEnabled = userProfile?.twoFactorEnabled || false;

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      setMode(isEnabled ? 'disable' : 'enable');
      setStep(0);
      setEmail(user?.email || "");
      setOtpValue("");
      setSuccess(false);
      setLoading(false);
      setVerifying(false);
      setUseCustomEmail(false);
    }
    onOpenChange(open);
  };

  const handleBackClick = () => {
    setStep(0);
    setVerifying(false);
    setOtpValue("");
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          userId: user?.id,
          userName: user?.user_metadata?.display_name || 'User'
        }
      });

      if (error) {
        throw error;
      }

      setLoading(false);
      setStep(1);
      toast.success("Verification code sent to your email");
      
      if (data?.otpCode) {
        toast.info(`Development OTP: ${data.otpCode}`);
      }
      
      auditLog.log(
        user?.id || "current-user",
        "settings_change",
        "success",
        {
          userName: userProfile?.displayName || "User",
          userRole: userProfile?.role || "client",
          details: { 
            step: "verification_code_sent", 
            email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
            action: mode === 'enable' ? "2fa_enable" : "2fa_disable"
          }
        }
      );
    } catch (error: any) {
      setLoading(false);
      console.error('OTP Email Error:', error);
      console.error('Error Details:', JSON.stringify(error, null, 2));
      
      // More specific error handling
      if (error.message?.includes('Edge function returned a non-2xx status code')) {
        toast.error("Email service error. Please try again or contact support.");
      } else if (error.message?.includes('EmailJS')) {
        toast.error("Email delivery failed. Please check your email address and try again.");
      } else {
        toast.error(error.message || "Failed to send verification code");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid verification code");
      return;
    }

    setVerifying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email, 
          otpCode: otpValue,
          userId: user?.id
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Invalid OTP code');
      }

      if (mode === 'disable') {
        // For disable mode, we need to update the profile directly
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ two_factor_enabled: false })
          .eq('id', user?.id);

        if (updateError) {
          throw updateError;
        }
      }

      setVerifying(false);
      setSuccess(true);
      toast.success(`Two-factor authentication ${mode === 'enable' ? 'enabled' : 'disabled'} successfully`);
      
      // Update local profile state
      updateUserProfile({ twoFactorEnabled: mode === 'enable' });
      
      auditLog.log(
        user?.id || "current-user",
        "settings_change",
        "success",
        {
          userName: userProfile?.displayName || "User",
          userRole: userProfile?.role || "client",
          details: { 
            step: `2fa_${mode}_complete`,
            method: "email",
            email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
          }
        }
      );
      
      setTimeout(() => {
        handleDialogOpen(false);
      }, 1500);
    } catch (error: any) {
      setVerifying(false);
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  const handleDisableConfirm = () => {
    setStep(0);
    setEmail("");
    setOtpValue("");
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-orange-500" />
            )}
            {mode === 'enable' ? 'Enable' : 'Disable'} Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 0 && !success && (
            <>
              {mode === 'enable' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h3 className="flex items-center font-medium mb-2">
                      <ShieldIcon className="h-4 w-4 mr-2 text-blue-500" />
                      Enhanced Security Benefits
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Adds an additional layer of security to your account</li>
                      <li>• Protects against unauthorized access</li>
                      <li>• Verifies your identity using your email address</li>
                    </ul>
                  </div>
                  
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Email Address</label>
                     {!useCustomEmail ? (
                       <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                         <span className="text-sm">{email}</span>
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => setUseCustomEmail(true)}
                           className="h-auto p-1"
                         >
                           <Edit3 className="h-3 w-3" />
                         </Button>
                       </div>
                     ) : (
                       <div className="space-y-2">
                         <Input
                           type="email"
                           placeholder="your@email.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                             setEmail(user?.email || "");
                             setUseCustomEmail(false);
                           }}
                           className="h-auto p-0 text-xs"
                         >
                           Use my registered email
                         </Button>
                       </div>
                     )}
                   </div>
                  
                  <Button 
                    onClick={handleEmailSubmit}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending verification code..." : "Continue"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20">
                    <h3 className="flex items-center font-medium mb-2 text-orange-800 dark:text-orange-200">
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Disable Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Disabling 2FA will reduce your account security. You'll need to verify your identity to proceed.
                    </p>
                  </div>
                  
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Email Address</label>
                     {!useCustomEmail ? (
                       <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                         <span className="text-sm">{email}</span>
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => setUseCustomEmail(true)}
                           className="h-auto p-1"
                         >
                           <Edit3 className="h-3 w-3" />
                         </Button>
                       </div>
                     ) : (
                       <div className="space-y-2">
                         <Input
                           type="email"
                           placeholder="your@email.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                             setEmail(user?.email || "");
                             setUseCustomEmail(false);
                           }}
                           className="h-auto p-0 text-xs"
                         >
                           Use my registered email
                         </Button>
                       </div>
                     )}
                   </div>
                  
                  <Button 
                    onClick={handleEmailSubmit}
                    className="w-full"
                    variant="destructive"
                    disabled={loading}
                  >
                    {loading ? "Sending verification code..." : "Continue"}
                  </Button>
                </div>
              )}
            </>
          )}
          
          {step === 1 && !success && (
            <div className="space-y-4">
              <Button
                onClick={handleBackClick}
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {email}
                </p>
                
                <div className="flex justify-center">
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
                </div>
                
                <Button 
                  onClick={handleVerifyOtp}
                  className="w-full"
                  disabled={verifying || otpValue.length !== 6}
                  variant={mode === 'disable' ? 'destructive' : 'default'}
                >
                  {verifying ? "Verifying..." : `Verify & ${mode === 'enable' ? 'Enable' : 'Disable'} 2FA`}
                </Button>
              </div>
            </div>
          )}
          
          {success && (
            <div className="text-center space-y-4 p-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Two-Factor Authentication {mode === 'enable' ? 'Enabled' : 'Disabled'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mode === 'enable' 
                    ? 'Your account is now more secure with an additional layer of protection.'
                    : 'Two-factor authentication has been disabled for your account.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}