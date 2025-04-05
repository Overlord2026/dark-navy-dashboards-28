import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage({ isAdvisor = false }) {
  const navigate = useNavigate();
  
  // For advisor logins we'll keep the advisor login functionality
  if (!isAdvisor) {
    return <Navigate to="/client-portal" replace />;
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/advisor/dashboard");
  };
  
  const handleClientPortalAccess = () => {
    navigate("/client-portal");
    toast({
      title: "Accessing Client Portal",
      description: "No login required for now"
    });
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7E8] flex flex-col">
      <header className="w-full flex justify-center items-center py-4 border-b border-[#DCD8C0] bg-[#F9F7E8] sticky top-0 z-50">
        <div className="container flex justify-between items-center max-w-7xl px-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office Logo" 
              className="h-16 w-auto"
            />
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button 
              variant="default" 
              onClick={handleClientPortalAccess}
              className="bg-green-600 hover:bg-green-700"
            >
              Access Client Portal
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#DCD8C0] w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#222222]">Advisor Login</h1>
            <p className="text-gray-600 mt-2">Access your advisor dashboard</p>
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
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <Button 
              variant="link" 
              onClick={handleClientPortalAccess}
              className="text-green-600 hover:text-green-700"
            >
              Access Client Portal
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="py-6 px-4 bg-[#1B1B32] text-white text-center">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
