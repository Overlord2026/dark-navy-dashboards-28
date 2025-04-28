
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Book, 
  BriefcaseIcon, 
  FileText, 
  TrendingUp, 
  Shield, 
  Banknote,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  VaultIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FamilyProfile } from "@/components/sidebar/FamilyProfile";
import { AdvisorProfile } from "@/components/sidebar/AdvisorProfile";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface NavSection {
  id: string;
  label: string;
  icon?: React.ElementType;
  items?: { label: string; href: string; icon: React.ElementType }[];
  href?: string;
}

export const Sidebar = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(["education", "planning", "wealth"]);
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebarCollapsed", false);

  const navSections: NavSection[] = [
    {
      id: "education",
      label: "Education & Solutions",
      icon: Book,
      items: [
        { label: "Education Center", href: "/education", icon: Book },
        { label: "Courses", href: "/courses", icon: Book },
        { label: "Guides & Whitepapers", href: "/guides", icon: FileText },
        { label: "Books", href: "/books", icon: Book },
        { label: "Planning Examples", href: "/examples", icon: FileText },
        { label: "Presentations", href: "/presentations", icon: FileText },
      ],
    },
    {
      id: "wealth",
      label: "Wealth Management",
      icon: BriefcaseIcon,
      items: [
        { label: "Secure Family Vault", href: "/legacy-vault", icon: VaultIcon },
        { label: "Dashboard", href: "/wealth-management", icon: BriefcaseIcon },
        { label: "Accounts", href: "/accounts", icon: FileText },
        { label: "Financial Plans", href: "/financial-plans", icon: FileText },
        { label: "Investments", href: "/accounts", icon: TrendingUp },
        { label: "Properties", href: "/properties", icon: FileText },
        { label: "Tax & Budgets", href: "/tax-budgets", icon: FileText },
      ],
    },
    {
      id: "planning",
      label: "Planning & Services",
      icon: FileText,
      items: [
        { label: "Financial Planning", href: "/financial-plans", icon: FileText },
        { label: "Investments", href: "/accounts", icon: TrendingUp },
        { label: "Tax Planning", href: "/tax-planning", icon: FileText },
        { label: "Estate Planning", href: "/estate-planning", icon: FileText },
        { label: "Insurance", href: "/insurance", icon: Shield },
        { label: "Lending", href: "/lending", icon: Banknote }, // Updated to correct href
      ],
    },
    {
      id: "collaboration",
      label: "Collaboration",
      icon: MessageSquare,
      href: "/integration",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionActive = (section: NavSection) => {
    const currentPath = location.pathname;

    // Check if section has a direct href and it matches current path
    if (section.href && currentPath === section.href) {
      return true;
    }

    // Check if any of the section's items' href matches current path
    if (section.items && section.items.some(item => item.href === currentPath)) {
      return true;
    }

    return false;
  };

  return (
    <div className={cn("h-full flex flex-col", isCollapsed ? "w-16" : "w-64")}>
      <div className="p-4 flex justify-between items-center border-b">
        {!isCollapsed && <h1 className="font-semibold">Navigation</h1>}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="p-1 rounded hover:bg-muted"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {navSections.map(section => (
          <div key={section.id} className="mb-3">
            {section.items ? (
              <div>
                <button
                  className={cn(
                    "flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition-colors",
                    isSectionActive(section) && "bg-muted/80",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    {section.icon && <section.icon size={18} />}
                    {!isCollapsed && <span>{section.label}</span>}
                  </div>
                  {!isCollapsed && (
                    openSections.includes(section.id) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )
                  )}
                </button>
                
                {openSections.includes(section.id) && !isCollapsed && (
                  <div className="mt-1 ml-6 space-y-1">
                    {section.items.map(item => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors",
                          location.pathname === item.href && "bg-muted font-medium"
                        )}
                      >
                        {item.icon && <item.icon size={16} />}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : section.href ? (
              <Link
                to={section.href}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors",
                  location.pathname === section.href && "bg-muted font-medium",
                  isCollapsed && "justify-center"
                )}
              >
                {section.icon && <section.icon size={18} />}
                {!isCollapsed && <span>{section.label}</span>}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
