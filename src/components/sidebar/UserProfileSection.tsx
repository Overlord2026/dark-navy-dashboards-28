
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileSectionProps {
  showLogo?: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  showLogo = false 
}) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      {showLogo && (
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-8 w-auto mr-2"
          />
          <span className="font-semibold">Family Office</span>
        </div>
      )}
      
      <div className={`flex items-center ${!showLogo ? 'ml-auto' : ''}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">Premium</p>
        </div>
      </div>
    </div>
  );
};
