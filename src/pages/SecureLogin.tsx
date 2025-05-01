
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BrandedHeader } from "@/components/layout/BrandedHeader";
import { Shield, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SecureLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A1F44] flex flex-col">
      <BrandedHeader />
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-[#0F1E3A] p-8 rounded-lg shadow-xl border border-[#2A3E5C] w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto bg-[#1B2A47] w-14 h-14 flex items-center justify-center rounded-full mb-4">
              <Shield className="text-[#FFC700] h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Secure Client Portal
            </h1>
            <p className="text-gray-400 mt-2">
              Access your personalized financial dashboard
            </p>
          </div>
          
          {/* Google Login Button */}
          <Button 
            onClick={handleGoogleLogin}
            className="w-full mb-4 bg-white hover:bg-gray-100 text-gray-800 font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-[#0F1E3A] text-gray-400">Or continue with email</span>
            </div>
          </div>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  autoComplete="email" 
                  className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Link to="/forgot-password" className="text-sm text-[#9b87f5] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#2A3E5C] text-[#9b87f5]" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
              >
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In Securely"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              Don't have an account?{" "}
              <Link to="/contact" className="text-[#9b87f5] hover:underline">
                Contact us
              </Link>{" "}
              to get started.
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#2A3E5C] text-xs text-center text-gray-500">
            <p>Protected by industry-leading security protocols</p>
            <p className="mt-1">256-bit encryption</p>
          </div>
        </div>
      </div>
      
      <footer className="py-6 px-4 bg-[#0A1429] text-white text-center border-t border-[#2A3E5C]">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
