
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface UserProfileSectionProps {
  showLogo?: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  showLogo = false 
}) => {
  const { user } = useAuth();
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "JD";
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "John Doe";
  const userRole = user?.user_metadata?.role || "Client";

  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      {showLogo && (
        <div className="flex items-center">
          <span className="font-semibold">Family Office</span>
        </div>
      )}
      
      <div className={`flex items-center ${!showLogo ? 'ml-auto' : ''}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>
      </div>
    </div>
  );
};
