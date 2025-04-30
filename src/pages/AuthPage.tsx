
import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-[#F9F7E8]">
      <div className="pt-[100px] px-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Access Your Financial Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Log in to manage your wealth or create a new account
            </p>
          </div>
          
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
