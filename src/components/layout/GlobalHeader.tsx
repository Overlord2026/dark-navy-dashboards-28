
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";

export const GlobalHeader = () => {
  const location = useLocation();
  const { userProfile } = useUser();
  
  // Extract the page title from the path
  const getPageTitle = (path: string): string => {
    const pathSegments = path.split('/').filter(segment => segment);
    if (pathSegments.length === 0) return "Dashboard";
    
    // Convert path segment to title case
    const segment = pathSegments[0];
    return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
  };
  
  const pageTitle = getPageTitle(location.pathname);
  
  // Get user initials for avatar
  const getInitials = (): string => {
    if (!userProfile.firstName && !userProfile.lastName) return "U";
    return `${userProfile.firstName?.charAt(0) || ""}${userProfile.lastName?.charAt(0) || ""}`;
  };

  return (
    <div className="w-full py-2 px-4 flex items-center justify-between bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img 
            src="/lovable-uploads/a93cf10c-65af-4633-b8cb-13838adf42d5.png" 
            alt="Boutique Family Office Logo" 
            className="h-10 w-auto"
          />
        </Link>
        <div className="h-6 w-px bg-[#1E293B] mx-2 hidden md:block" />
        <h1 className="text-xl font-semibold text-white hidden md:block">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-[#FFC107] flex items-center justify-center text-[#0F172A] font-medium">
            {getInitials()}
          </div>
          <span className="text-white font-medium hidden md:inline-block">
            {userProfile.firstName} {userProfile.lastName}
          </span>
        </Link>
      </div>
    </div>
  );
};
