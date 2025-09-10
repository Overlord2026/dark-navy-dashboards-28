import React from "react";
import { CheckCircle, Activity } from "lucide-react";

export default function HealthCheck() {
  return (
    <div className="min-h-screen bg-bfo-navy flex items-center justify-center p-4">
      <div className="bfo-card max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-bfo-black mb-4">
          Preview is up ✅
        </h1>
        
        <p className="text-gray-600 mb-6">
          This route renders without auth. Use it to confirm the bundle is healthy.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-bfo-gold">
          <Activity className="w-4 h-4" />
          <span>System Status: Operational</span>
        </div>
        
        <div className="mt-6 pt-4 border-t border-bfo-gold/20">
          <p className="text-xs text-gray-500">
            Health check endpoint for monitoring and debugging
          </p>
        </div>
      </div>
    </div>
  );
}