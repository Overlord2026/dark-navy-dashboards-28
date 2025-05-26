
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('client-dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              display_name: `${firstName} ${lastName}`,
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          toast.success('Account created successfully! You are now logged in.');
          navigate('client-dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials.');
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          toast.success('Logged in successfully!');
          navigate('client-dashboard');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full flex justify-center items-center py-4 border-b border-gray-200 bg-[#1B1B32] sticky top-0 z-50">
        <div className="container flex justify-between items-center max-w-7xl px-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office Logo" 
              className="h-16 w-auto"
            />
          </Link>
          <div>
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex justify-center items-center p-4 bg-white">
        <Card className="p-8 w-full max-w-md bg-white border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1B1B32]">
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp 
                ? "Join our family office platform" 
                : "Access your personalized financial dashboard"}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#1B1B32]">First Name</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-gray-300 focus:border-[#1B1B32] focus:ring-[#1B1B32]"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#1B1B32]">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-gray-300 focus:border-[#1B1B32] focus:ring-[#1B1B32]"
                    required 
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1B1B32]">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-[#1B1B32] focus:ring-[#1B1B32]"
                autoComplete="email" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1B1B32]">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:border-[#1B1B32] focus:ring-[#1B1B32]"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#1B1B32] text-white hover:bg-[#1B1B32]/90"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#1B1B32] hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>
        </Card>
      </div>
      
      <footer className="py-6 px-4 bg-[#1B1B32] text-white text-center">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
