import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  User,
  ShieldIcon,
  Palette,
  HelpCircle,
  TestTube,
  Settings,
  Activity,
  FileText,
  Calculator,
  Smartphone,
  LogOut
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function MobileMore() {
  const { userProfile } = useUser();

  const menuSections = [
    {
      title: "Testing & QA",
      items: [
        {
          title: "Mobile QA Test",
          href: "/mobile-qa-test",
          icon: <Smartphone className="h-5 w-5" />,
          description: "Test mobile interface and interactions"
        },
        {
          title: "System Validation",
          href: "/system-validation", 
          icon: <TestTube className="h-5 w-5" />,
          description: "Validate calculators and forms"
        }
      ]
    },
    {
      title: "Tools & Features",
      items: [
        {
          title: "Tax Planning",
          href: "/mobile/tax-planning",
          icon: <Calculator className="h-5 w-5" />,
          description: "Tax strategies and calculators"
        },
        {
          title: "Health Dashboard",
          href: "/health",
          icon: <Activity className="h-5 w-5" />,
          description: "Health metrics and records"
        }
      ]
    },
    {
      title: "Account & Settings",
      items: [
        {
          title: "Profile",
          href: "/profile",
          icon: <User className="h-5 w-5" />,
          description: "Manage your profile"
        },
        {
          title: "Security",
          href: "/security-settings",
          icon: <ShieldIcon className="h-5 w-5" />,
          description: "Security and privacy settings"
        },
        {
          title: "Appearance", 
          href: "/appearance",
          icon: <Palette className="h-5 w-5" />,
          description: "Theme and display settings"
        },
        {
          title: "Help & Support",
          href: "/help",
          icon: <HelpCircle className="h-5 w-5" />,
          description: "Get help and contact support"
        }
      ]
    }
  ];

  return (
    <MobileLayout title="More">
      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        <Card className="bg-[#1B1B32] border border-[#2A2A45]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {userProfile?.firstName} {userProfile?.lastName}
                </h3>
                <p className="text-sm text-gray-400">{userProfile?.role || 'Client'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <Link key={itemIndex} to={item.href}>
                  <Card className="bg-[#1B1B32] border border-[#2A2A45] hover:bg-[#252544] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-400">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <div className="pt-4">
          <button className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 hover:bg-red-600/20 transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}