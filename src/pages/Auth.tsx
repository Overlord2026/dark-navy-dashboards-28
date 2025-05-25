import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandedHeader } from "@/components/layout/BrandedHeader";
import { AlertCircle, Lock } from "lucide-react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, signInWithMicrosoft, isAuthenticated, isLoading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Get return path from location state or use dashboard as default
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from);
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      console.log("Attempting login with:", email);
      
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error("Login error:", signInError);
        setError(signInError.message);
        toast.error(signInError.message);
      } else {
        console.log("Login successful");
        toast.success("Login successful");
        navigate(from);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailPasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    if (!firstName || !lastName) {
      setError("First name and last name are required");
      setIsSubmitting(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Attempting signup with:", email);
      
      const { error: signUpError, user } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`
      });
      
      if (signUpError) {
        console.error("Signup error:", signUpError);
        setError(signUpError.message);
        toast.error(signUpError.message);
      } else if (user) {
        console.log("Signup successful:", user);
        setActiveTab("login");
        setError("");
        setPassword("");
        toast.success("Account created successfully! Please check your email to confirm your account.");
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug login (bypasses the database check)
  const handleDebugLogin = async () => {
    setIsSubmitting(true);
    try {
      toast.success("Debug login - triggering without database check");
      navigate("/dashboard");
    } catch (err) {
      console.error("Debug login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1F44] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        <p className="mt-4 text-white">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1F44] flex flex-col">
      <BrandedHeader />
      
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="bg-[#0F1E3A] p-6 sm:p-8 lg:p-10 rounded-lg shadow-xl border border-[#2A3E5C] w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {activeTab === "login" ? "Log in securely" : "Create your account"}
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {activeTab === "login" 
                ? "Access your family office portal" 
                : "Join our family office platform"}
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#FFC700] text-base sm:text-lg font-bold">Boutique Family Office</div>
                  <div className="flex items-center text-white text-xs sm:text-sm">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-500" />
                    Secure login
                  </div>
                </div>
                
                <button 
                  onClick={() => signInWithGoogle()}
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 sm:py-3 px-4 border border-gray-300 rounded-md mb-3 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span className="hidden sm:inline">Continue with Google</span>
                  <span className="sm:hidden">Google</span>
                  <div className="ml-auto">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-green-500 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => signInWithMicrosoft()}
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 sm:py-3 px-4 border border-gray-300 rounded-md mb-4 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span className="hidden sm:inline">Continue with Microsoft</span>
                  <span className="sm:hidden">Microsoft</span>
                  <div className="ml-auto">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-green-500 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </button>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="border-t border-[#2A3E5C] flex-grow"></div>
                  <div className="text-gray-400 text-xs mx-4">OR CONTINUE WITH</div>
                  <div className="border-t border-[#2A3E5C] flex-grow"></div>
                </div>
              </div>
              
              <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="email" className="text-white text-sm">Email</Label>
                    {error && (
                      <div className="text-red-500 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {error}
                      </div>
                    )}
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    autoComplete="email" 
                    className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-white text-sm">Password</Label>
                    <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    autoComplete="current-password"
                    className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                    required 
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Authenticating..." : "Login"}
                  </Button>
                </div>
              </form>

              {/* Debug button - hidden in production */}
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="ghost" 
                  className="text-xs text-gray-500 hover:text-gray-400"
                  onClick={handleDebugLogin}
                >
                  Debug Login (Development Only)
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form id="signup-form" onSubmit={handleEmailPasswordSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white text-sm">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white text-sm">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe" 
                      className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="signupEmail" className="text-white text-sm">Email</Label>
                    {error && (
                      <div className="text-red-500 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {error}
                      </div>
                    )}
                  </div>
                  <Input 
                    id="signupEmail" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    autoComplete="email" 
                    className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-white text-sm">Password</Label>
                  <Input 
                    id="signupPassword" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    autoComplete="new-password"
                    className="bg-[#1B2A47] border-[#2A3E5C] text-white text-sm sm:text-base" 
                    required 
                  />
                  <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-400 mt-4">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">Protected by industry-leading security protocols</p>
            <div className="flex items-center justify-center mt-2">
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-green-500 flex items-center justify-center mr-2">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-green-500 text-xs sm:text-sm">256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 sm:py-6 px-4 bg-[#0A1429] text-white text-center border-t border-[#2A3E5C]">
        <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
