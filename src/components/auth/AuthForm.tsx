
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SocialLoginButton } from "./SocialLoginButton";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock } from "lucide-react";

interface AuthFormProps {
  segment?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ segment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { login, signUpWithEmail, loginWithSocial } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Include segment in navigation if available
        navigate(segment ? `/dashboard?segment=${segment}` : "/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        segment: segment || 'default'
      };
      
      const success = await signUpWithEmail(email, password, userData);
      if (success) {
        setActiveTab("login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      await loginWithSocial(provider as any);
    } catch (error) {
      console.error("Social login error:", error);
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  // Get title based on segment
  const getSegmentTitle = () => {
    switch(segment) {
      case 'aspiring': 
        return "Aspiring Wealthy Portal";
      case 'preretirees': 
        return "Pre-Retirees & Retirees Portal";
      case 'ultrahnw': 
        return "Ultra-High Net Worth Portal";
      case 'advisor': 
        return "Advisor Portal";
      default: 
        return "Boutique Family Office";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-gray-800 bg-[#121630]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-[#D4AF37]">{getSegmentTitle()}</CardTitle>
          <Shield className="h-5 w-5 text-green-500" />
        </div>
        <CardDescription className="flex items-center text-gray-300">
          <Lock className="h-4 w-4 mr-2" />
          Secure authentication gateway
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <SocialLoginButton 
              provider="google" 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            />
            <SocialLoginButton 
              provider="microsoft" 
              onClick={() => handleSocialLogin('microsoft')}
              disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121630] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mb-2">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                    <a href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="login-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstName" className="text-gray-300">First Name</Label>
                    <Input 
                      id="signup-firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastName" className="text-gray-300">Last Name</Label>
                    <Input 
                      id="signup-lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-400 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-gray-800 pt-4 flex-col space-y-2">
        <div className="text-sm text-gray-400 text-center">
          <span>Protected by industry-leading security protocols</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="rounded-full bg-green-900/40 p-1">
            <Shield className="h-3 w-3 text-green-500" />
          </div>
          <span className="text-xs text-gray-400">256-bit encryption</span>
        </div>
      </CardFooter>
    </Card>
  );
};
