
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BrandedHeader } from "@/components/layout/BrandedHeader";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SecureLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
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
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                autoComplete="email" 
                className="bg-[#1B2A47] border-[#2A3E5C] text-white" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Link to="/forgot-password" className="text-sm text-[#9b87f5] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                autoComplete="current-password"
                className="bg-[#1B2A47] border-[#2A3E5C] text-white" 
                required 
              />
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
        </div>
      </div>
      
      <footer className="py-6 px-4 bg-[#0A1429] text-white text-center border-t border-[#2A3E5C]">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
