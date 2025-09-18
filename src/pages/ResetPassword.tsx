
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we have valid recovery session
    const checkSession = async () => {
      console.log('Checking reset password session...');
      console.log('URL search params:', window.location.search);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Current session:', session);
        console.log('Session error:', error);
        
        if (session && session.user) {
          console.log('Valid session found for password reset');
          setIsValidSession(true);
        } else {
          console.log('No valid session found');
          toast.error("Invalid or expired reset link. Please request a new one.");
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error("Error validating reset link. Please try again.");
        setTimeout(() => navigate('/auth'), 2000);
      } finally {
        setCheckingSession(false);
      }
    };

    // Add a small delay to ensure the auth state has been processed
    const timer = setTimeout(checkSession, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to update password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error(error.message);
      } else {
        console.log('Password updated successfully');
        toast.success("Password updated successfully! You are now logged in.");
        navigate('/client-dashboard');
      }
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying reset link...</h1>
          <p className="text-gray-600">Please wait while we verify your password reset link.</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600">This reset link is invalid or has expired. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full flex justify-center items-center py-2 border-b border-gray-200 bg-[#1B1B32] sticky top-0 z-50">
        <div className="flex justify-center items-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-8 w-auto"
          />
        </div>
      </header>
      
      <div className="flex-1 flex justify-center items-center p-4 bg-white">
        <Card className="p-8 w-full max-w-md bg-[#1B1B32] border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-gray-300 mt-2">
              Enter your new password below
            </p>
          </div>
          
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                required 
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                required 
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-300">
            <p>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-white hover:underline font-medium"
                disabled={loading}
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
      
      <footer className="py-2 px-4 bg-[#1B1B32] text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
