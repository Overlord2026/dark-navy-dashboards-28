
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandedHeader } from "@/components/layout/BrandedHeader";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill out all fields");
      return;
    }
    await signIn(loginData.email, loginData.password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!signupData.email || !signupData.password || !signupData.confirmPassword || 
        !signupData.firstName || !signupData.lastName) {
      toast.error("Please fill out all fields");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Sign up user
    await signUp(signupData.email, signupData.password, {
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      display_name: `${signupData.firstName} ${signupData.lastName}`
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#0A1F44] flex flex-col">
      <BrandedHeader />
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-[#0F1E3A] p-8 rounded-lg shadow-xl border border-[#2A3E5C] w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Welcome to Family Office
          </h1>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="login-email" 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      autoComplete="email" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                      required 
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="login-password" 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      autoComplete="current-password"
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10 pr-10" 
                      required 
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="firstName" 
                        name="firstName"
                        type="text" 
                        placeholder="John" 
                        className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                        required 
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="lastName" 
                        name="lastName"
                        type="text" 
                        placeholder="Doe" 
                        className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                        required 
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="signup-email" 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      autoComplete="email" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10" 
                      required 
                      value={signupData.email}
                      onChange={handleSignupChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="signup-password" 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10 pr-10" 
                      required 
                      value={signupData.password}
                      onChange={handleSignupChange}
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Password must be at least 6 characters</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white pl-10 pr-10" 
                      required 
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
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
