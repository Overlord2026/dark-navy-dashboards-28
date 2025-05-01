
import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Shield, Lock, CheckCircle2, BadgeCheck } from "lucide-react";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  
  // If user is already authenticated, redirect to dashboard with segment parameter if available
  if (isAuthenticated) {
    return <Navigate to={segment ? `/dashboard?segment=${segment}` : "/dashboard"} replace />;
  }
  
  return (
    <div className="min-h-screen bg-[#0A1F44] text-white">
      <div className="pt-[80px] px-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-md mb-8">
          {/* Connected Badge */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-12 w-12">
              <img 
                src="/assets/logo-gold-tree.svg" 
                alt="Boutique Family Office Logo" 
                className="h-full w-auto"
              />
            </div>
            <ConnectedBadge />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[#D4AF37]">Access Your Financial Dashboard</h1>
            <p className="mt-2 text-gray-300 text-lg">
              Log in securely to manage your wealth or create a new account
            </p>
          </div>
          
          <AuthForm segment={segment} />
        </div>
        
        <div className="w-full max-w-md flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-300 mb-8">
          <div className="flex items-start gap-2 bg-black/20 p-4 rounded-lg border border-gray-800 flex-1">
            <Shield className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#D4AF37]">Enterprise-Grade Security</h3>
              <p>SOC 2 Type II certified security protocols</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 bg-black/20 p-4 rounded-lg border border-gray-800 flex-1">
            <Lock className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#D4AF37]">Data Protection</h3>
              <p>AES-256 encryption at rest and in transit</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 bg-black/20 p-4 rounded-lg border border-gray-800 flex-1">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#D4AF37]">Trusted Infrastructure</h3>
              <p>Built on Tier-4 certified data centers</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md text-center p-4 bg-black/20 rounded-lg border border-gray-700 shadow-md">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-sm text-gray-300">
              Protected by industry-leading security protocols
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 mt-2">
            <div className="flex items-center">
              <div className="rounded-full bg-green-900/40 p-1 mr-1">
                <Shield className="h-3 w-3 text-green-500" />
              </div>
              <span className="text-xs text-gray-400">256-bit encryption</span>
            </div>
            <div className="h-3 w-px bg-gray-700"></div>
            <div className="flex items-center">
              <div className="rounded-full bg-green-900/40 p-1 mr-1">
                <Lock className="h-3 w-3 text-green-500" />
              </div>
              <span className="text-xs text-gray-400">Secure authentication</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
