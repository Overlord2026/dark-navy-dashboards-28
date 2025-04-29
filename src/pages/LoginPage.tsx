
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogoBanner } from "@/components/layout/LogoBanner";

export default function LoginPage({ isAdvisor = false }) {
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to the dashboard
    if (isAdvisor) {
      navigate("/advisor/dashboard");
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7E8] flex flex-col">
      <LogoBanner />
      <div className="flex-1 flex justify-center items-center p-4 mt-20">
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#DCD8C0] w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#222222]">
              {isAdvisor ? "Advisor Login" : "Client Login"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdvisor 
                ? "Access your advisor dashboard" 
                : "Access your personalized financial dashboard"}
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                autoComplete="email" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                autoComplete="current-password" 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
              >
                Remember me
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-black text-white hover:bg-black/80">
              Sign In
            </Button>
          </form>
          
          {!isAdvisor && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Don't have an account?{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>{" "}
                to get started.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="py-6 px-4 bg-[#1B1B32] text-white text-center">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
