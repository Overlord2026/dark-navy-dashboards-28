
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Shield, Lock } from "lucide-react";
import { SocialLoginSection } from "./SocialLoginSection";
import { AuthDivider } from "./AuthDivider";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { AuthFooter } from "./AuthFooter";

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
          <SocialLoginSection 
            handleSocialLogin={handleSocialLogin}
            isLoading={isLoading}
          />
          
          <AuthDivider />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mb-2">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                handleSignup={handleSignup}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter>
        <AuthFooter />
      </CardFooter>
    </Card>
  );
};
