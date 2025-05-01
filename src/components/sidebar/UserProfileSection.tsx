
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Logo from "../common/Logo";

interface UserProfileSectionProps {
  showLogo?: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  showLogo = false 
}) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <div className="p-4 border-b border-border">
      {showLogo && (
        <div className="flex items-center mb-3">
          <Logo size="small" showText={false} />
        </div>
      )}
      
      <div 
        className="flex items-center cursor-pointer p-2 rounded-md hover:bg-muted transition-colors"
        onClick={handleProfileClick}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png" alt="User" />
          <AvatarFallback>
            {userProfile?.firstName?.charAt(0) || 'U'}
            {userProfile?.lastName?.charAt(0) || 'S'}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex-1">
          <p className="text-sm font-medium">
            {userProfile?.firstName} {userProfile?.lastName} — Client Profile
          </p>
          <p className="text-xs text-muted-foreground">Premium</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
