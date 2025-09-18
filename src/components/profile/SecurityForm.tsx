
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LockIcon, ShieldIcon, ArrowLeft, CheckCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { auditLog } from "@/services/auditLog/auditLogService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function SecurityForm({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [success, setSuccess] = useState(false);

  const handleBackClick = () => {
    setStep(0);
    setVerifying(false);
    setOtpValue("");
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      
      // Log failed attempt to audit log
      auditLog.log(
        user?.id || "current-user",
        "profile_update",
        "failure",
        {
          userName: "Current User",
          userRole: "client",
          details: { step: "email_verification", reason: "Invalid email address" }
        }
      );
      
      return;
    }

    setLoading(true);
    
    try {
      // Call the send-otp-email function
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
      
      // In development, show the OTP code
      if (data?.otpCode) {
        toast.info(`Development OTP: ${data.otpCode}`);
      }
      
      // Log verification code sent to audit log
      auditLog.log(
        user?.id || "current-user",
        "settings_change",
        "success",
        {
          userName: "Current User",
          userRole: "client",
          details: { 
            step: "verification_code_sent", 
            email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") // Mask the email
          }
        }
      );
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Failed to send verification code");
      
      auditLog.log(
        user?.id || "current-user",
        "profile_update",
        "failure",
        {
          userName: "Current User",
          userRole: "client",
          details: { step: "email_verification", reason: error.message }
        }
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid verification code");
      
      // Log failed OTP verification
      auditLog.log(
        user?.id || "current-user",
        "profile_update",
        "failure",
        {
          userName: "Current User",
          userRole: "client",
          details: { step: "otp_verification", reason: "Invalid OTP code" }
        }
      );
      
      return;
    }

    setVerifying(true);
    
    try {
      // Call the verify-otp function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email, 
          otpCode: otpValue,
          userId: user?.id,
          isForLogin: false // This is for MFA setup, not login
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Invalid OTP code');
      }

      // Double-check that MFA was actually enabled in the database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', user?.id)
        .single();

      if (profileError || !profile?.two_factor_enabled) {
        throw new Error('Failed to enable MFA. Please try again.');
      }

      setVerifying(false);
      setSuccess(true);
      toast.success("Two-factor authentication enabled successfully");
      
      // Log successful MFA enablement to audit log
      auditLog.log(
        user?.id || "current-user",
        "settings_change",
        "success",
        {
          userName: "Current User",
          userRole: "client",
          details: { 
            step: "mfa_setup_complete",
            method: "email",
            email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") // Mask the email
          }
        }
      );
      
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (error: any) {
      setVerifying(false);
      toast.error(error.message || "Failed to verify OTP");
      
      auditLog.log(
        user?.id || "current-user",
        "profile_update",
        "failure",
        {
          userName: "Current User",
          userRole: "client",
          details: { step: "otp_verification", reason: error.message }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
          <ShieldIcon className="inline-block mr-2 h-6 w-6" />
          {step === 0 ? "Turn On Two-Factor Authentication" : "Verify Your Email Address"}
        </h2>
        <p className="text-sm text-gray-400 mt-4 mb-6">
          {step === 0 
            ? "For additional security, turn on Two-Factor Authentication. A code will be sent to your email address for you to enter each time you log in." 
            : "We've sent a verification code to your email. Please enter the code below to enable Two-Factor Authentication."}
        </p>
        
        {step === 0 && !success && (
          <>
            <div className="bg-[#1a1a3a] p-4 rounded-md border border-[#2d2d50] mb-8">
              <h3 className="flex items-center text-white text-lg font-medium mb-2">
                <LockIcon className="h-5 w-5 mr-2 text-blue-400" />
                Enhanced Security Benefits
              </h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Adds an additional layer of security to your account</li>
                <li>Protects against unauthorized access even if your password is compromised</li>
                <li>Verifies your identity using your email address</li>
                <li>Receive immediate notifications of login attempts</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-200">Email Address</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0F0F2D] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleEmailSubmit}
                className="w-full bg-white text-[#0F0F2D] hover:bg-white/90 py-6"
                disabled={loading}
              >
                {loading ? "Sending verification code..." : "Continue"}
              </Button>
            </div>
          </>
        )}
        
        {step === 1 && !success && (
          <div className="space-y-6">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              className="p-0 h-auto mb-2 text-gray-400 hover:text-white hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm mb-4">Enter the 6-digit code sent to {email}</p>
              
              <InputOTP 
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                className="mb-6"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-[#1a1a3a] border-gray-700 text-white" />
                  <InputOTPSlot index={1} className="bg-[#1a1a3a] border-gray-700 text-white" />
                  <InputOTPSlot index={2} className="bg-[#1a1a3a] border-gray-700 text-white" />
                  <InputOTPSlot index={3} className="bg-[#1a1a3a] border-gray-700 text-white" />
                  <InputOTPSlot index={4} className="bg-[#1a1a3a] border-gray-700 text-white" />
                  <InputOTPSlot index={5} className="bg-[#1a1a3a] border-gray-700 text-white" />
                </InputOTPGroup>
              </InputOTP>
              
              <Button 
                onClick={handleVerifyOtp}
                className="w-full bg-white text-[#0F0F2D] hover:bg-white/90 py-6"
                disabled={verifying || otpValue.length !== 6}
              >
                {verifying ? "Verifying..." : "Verify & Enable 2FA"}
              </Button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Two-Factor Authentication Enabled</h3>
            <p className="text-gray-400 mb-6">Your account is now more secure with an additional layer of protection.</p>
            <Button 
              onClick={onSave}
              className="bg-white text-[#0F0F2D] hover:bg-white/90"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
