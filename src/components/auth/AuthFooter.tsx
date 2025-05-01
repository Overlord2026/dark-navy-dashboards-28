
import React from "react";
import { Shield } from "lucide-react";

export const AuthFooter: React.FC = () => {
  return (
    <div className="flex justify-center border-t border-gray-800 pt-4 flex-col space-y-2">
      <div className="text-sm text-gray-400 text-center">
        <span>Protected by industry-leading security protocols</span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className="rounded-full bg-green-900/40 p-1">
          <Shield className="h-3 w-3 text-green-500" />
        </div>
        <span className="text-xs text-gray-400">256-bit encryption</span>
      </div>
    </div>
  );
};
