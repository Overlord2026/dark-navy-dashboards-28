
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";

interface BrandedHeaderProps {
  isConnected?: boolean;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({ isConnected = false }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-background border-b border-border z-50">
      <div className="flex items-center space-x-4">
        <div className="font-bold text-xl">Family Office</div>
        {isConnected && (
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
            <Network className="h-3 w-3" />
            <span>Connected</span>
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex items-center space-x-4">
          <a href="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</a>
          <a href="/integration" className="text-sm font-medium hover:text-primary">Integration</a>
          <a href="/profile" className="text-sm font-medium hover:text-primary">Profile</a>
        </nav>
      </div>
    </header>
  );
};
