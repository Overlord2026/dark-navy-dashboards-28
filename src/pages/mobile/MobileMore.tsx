
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { 
  User, 
  UserPlus, 
  Palette, 
  Shield, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MobileMore() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return (
    <MobileLayout title="More">
      <div className="p-4 space-y-1">
        <Link 
          to="/profile"
          className="flex items-center justify-between p-4 border-b border-gray-800"
        >
          <div className="flex items-center">
            <User className="h-5 w-5 mr-3 text-gray-300" />
            <span className="font-medium">Profile</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
        
        <Link 
          to="/advisor-profile"
          className="flex items-center justify-between p-4 border-b border-gray-800"
        >
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 mr-3 text-gray-300" />
            <span className="font-medium">Advisor</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
        
        <Link 
          to="/settings"
          className="flex items-center justify-between p-4 border-b border-gray-800"
        >
          <div className="flex items-center">
            <Palette className="h-5 w-5 mr-3 text-gray-300" />
            <span className="font-medium">Change Appearance</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
        
        <Link 
          to="/security-settings"
          className="flex items-center justify-between p-4 border-b border-gray-800"
        >
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-3 text-gray-300" />
            <span className="font-medium">Security & Access</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 border-b border-gray-800 text-left"
        >
          <div className="flex items-center">
            <LogOut className="h-5 w-5 mr-3 text-gray-300" />
            <span className="font-medium">Log Out</span>
          </div>
        </button>
      </div>
    </MobileLayout>
  );
}
