
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LoginPage = ({ isAdvisor = false }: { isAdvisor?: boolean }) => {
  const navigate = useNavigate();
  const { login: userLogin, isAuthenticated: userAuthenticated } = useUser();
  const { isAuthenticated: authAuthenticated, login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if already authenticated and redirect if needed
  useEffect(() => {
    if (authAuthenticated) {
      if (isAdvisor) {
        navigate("/advisor/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [authAuthenticated, isAdvisor, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // For development: automatically succeed login
      authLogin();
      
      // Also call userLogin for consistency
      await userLogin(email || "demo@example.com", password || "password");
      
      toast.success("Login successful!");
      
      if (isAdvisor) {
        navigate("/advisor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isAdvisor ? "Advisor Login" : "Client Login"}</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="text-xs text-amber-600 mt-2">
              <p>Development mode: Login enabled without credentials</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              <a href="#" className="text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
