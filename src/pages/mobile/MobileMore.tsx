
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Link } from "react-router-dom";
import { 
  User, 
  UserPlus, 
  LogOut, 
  Shield, 
  GraduationCap, 
  BookOpen,
  PieChart,
  FileText,
  Settings,
  BellRing,
  HelpCircle,
  Info,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Building,
  DollarSign,
  Landmark,
  BriefcaseIcon
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";

export default function MobileMore() {
  const { logout, userProfile } = useUser();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    if (logout) logout();
  };

  return (
    <MobileLayout title="More">
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Profile</h2>
          <div className="space-y-1">
            <Link to="/profile" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">My Profile</span>
              </div>
              <div className="text-gray-500">{userProfile?.name || "Not logged in"}</div>
            </Link>
            
            <Link to="/advisor-profile" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">My Advisor</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Education & Planning Section */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Education & Planning</h2>
          <div className="space-y-1">
            <Link to="/education" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Education Center</span>
              </div>
            </Link>
            
            <Link to="/tax-planning" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <PieChart className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Tax Planning</span>
              </div>
            </Link>
            
            <Link to="/documents" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Documents & Guides</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Alternative Investments Section - Reorganized by category */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Alternative Investments</h2>
          <div className="space-y-1">
            <Link to="/investments/alternative/private-equity" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Private Equity</span>
              </div>
            </Link>
            
            <Link to="/investments/alternative/private-debt" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Private Debt</span>
              </div>
            </Link>
            
            <Link to="/investments/alternative/real-assets" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Real Assets</span>
              </div>
            </Link>
            
            <Link to="/investments/alternative/digital-assets" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Digital Assets</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Fund Managers Section */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Fund Managers</h2>
          <div className="space-y-1">
            <Link to="/alternatives/blackstone" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Landmark className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Blackstone Funds</span>
              </div>
            </Link>
            
            <Link to="/alternatives/apollo" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Apollo Funds</span>
              </div>
            </Link>
            
            <Link to="/alternatives/kkr" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">KKR Funds</span>
              </div>
            </Link>
            
            <Link to="/alternatives/cliffwater" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Cliffwater Funds</span>
              </div>
            </Link>
            
            <Link to="/alternatives/stepstone" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">StepStone Funds</span>
              </div>
            </Link>
            
            <Link to="/alternatives/amg" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Landmark className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">AMG Pantheon</span>
              </div>
            </Link>
            
            <Link to="/alternatives/hamilton-lane" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Hamilton Lane</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Settings Section */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Settings</h2>
          <div className="space-y-1">
            <Link to="/security-settings" className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Security</span>
              </div>
            </Link>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">App Settings</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <BellRing className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Notifications</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help & Support Section */}
        <div>
          <h2 className="text-lg text-gray-400 mb-3">Help & Support</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Help Center</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">Contact Support</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">About</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div 
          className="flex items-center p-4 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3 text-red-400" />
          <span className="font-medium text-red-400">Logout</span>
        </div>
      </div>
    </MobileLayout>
  );
}
