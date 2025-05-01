
import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Shield, Lock, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  
  // If user is already authenticated, redirect to dashboard with segment parameter if available
  if (isAuthenticated) {
    return <Navigate to={segment ? `/dashboard?segment=${segment}` : "/dashboard"} replace />;
  }
  
  return (
    <div className="min-h-screen bg-[#F9F7E8]">
      <div className="pt-[80px] px-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-md space-y-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Access Your Financial Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Log in securely to manage your wealth or create a new account
            </p>
          </div>
          
          <AuthForm segment={segment} />
        </div>
        
        <div className="w-full max-w-md flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600 mb-8">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Enterprise-Grade Security</h3>
              <p>SOC 2 Type II certified security protocols</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Data Protection</h3>
              <p>AES-256 encryption at rest and in transit</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Trusted Infrastructure</h3>
              <p>Built on Tier-4 certified data centers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
