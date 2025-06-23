
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  userId: string;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  userId, 
  onBack 
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const { verifyOTP, requestOTP } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(otp, userId);
      if (result.success) {
        toast.success("Successfully verified! Logging you in...");
      } else {
        toast.error(result.error || "Invalid OTP code");
        setOtp("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const result = await requestOTP(email, userId);
      if (result.success) {
        toast.success("New OTP code sent to your email");
        setTimeLeft(300);
        setCanResend(false);
        setOtp("");
      } else {
        toast.error(result.error || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md bg-[#1B1B32] border border-gray-200 shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Enter Verification Code
        </h1>
        <p className="text-gray-300 mt-2">
          We've sent a 6-digit code to<br />
          <strong>{email}</strong>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-white text-center block">
            Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      index={index}
                      className="w-12 h-12 text-lg font-bold bg-white text-black border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-gray-400 text-sm">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-red-400 text-sm">
              Code has expired
            </p>
          )}
        </div>

        <Button 
          onClick={handleVerifyOTP}
          className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Didn't receive the code?
          </p>
          <Button 
            variant="ghost"
            onClick={handleResendOTP}
            className="text-white hover:bg-white/10"
            disabled={loading || !canResend}
          >
            {loading ? "Sending..." : canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
          </Button>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10"
            disabled={loading}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </Card>
  );
};
