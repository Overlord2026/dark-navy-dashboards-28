import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  userId?: string | null;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export default function OTPVerification({ email, userId, onVerificationSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke('verify-otp', {
        body: {
          email,
          userId,
          otpCode: otp,
          isForLogin: true,
        },
      });

      if (response.error) {
        toast.error("Failed to verify code. Please try again.");
        setOtp("");
        return;
      }

      const result = response.data;

      if (result.success) {
        toast.success("Verification successful!");
        onVerificationSuccess();
      } else {
        toast.error(result.error || "Invalid verification code");
        setOtp("");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify code. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          userId,
          userName: 'User'
        },
      });

      if (response.error) {
        toast.error("Failed to send verification code");
        return;
      }

      const result = response.data;

      if (result.success) {
        toast.success("New verification code sent to your email");
        setOtp("");
      } else {
        toast.error(result.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md bg-[#1B1B32] border border-gray-200 shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
        <p className="text-gray-300 mt-2">
          We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-white text-center block">
            Enter Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-white text-black border-gray-300" />
                <InputOTPSlot index={1} className="bg-white text-black border-gray-300" />
                <InputOTPSlot index={2} className="bg-white text-black border-gray-300" />
                <InputOTPSlot index={3} className="bg-white text-black border-gray-300" />
                <InputOTPSlot index={4} className="bg-white text-black border-gray-300" />
                <InputOTPSlot index={5} className="bg-white text-black border-gray-300" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleVerifyOTP}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Didn't receive the code?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-white hover:bg-white/10 text-sm"
            >
              {resending ? "Sending..." : "Resend Code"}
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10 text-sm"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}