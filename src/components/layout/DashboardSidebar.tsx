
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LucideIcon, BookOpen, BriefcaseIcon, FileText, MessageSquare, ChevronDown, ChevronRight, User, VaultIcon, BanknoteIcon } from "lucide-react";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { AdvisorProfile } from "@/components/sidebar/AdvisorProfile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  name: string;
  href: string;
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  href?: string;
  items?: NavItem[];
}

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebarCollapsed", false);
  const [expandedSections, setExpandedSections] = useLocalStorage("expandedSections", {
    education: true,
    planning: true,
    wealth: true, // Set wealth to be expanded by default
  });
  
  const navigationGroups: NavGroup[] = [
    {
      name: "Education & Solutions",
      icon: BookOpen,
      items: [
        { name: "Education Center", href: "/education" },
        { name: "Courses", href: "/courses" },
        { name: "Guides & Whitepapers", href: "/guides" },
        { name: "Books", href: "/books" },
        { name: "Planning Examples", href: "/examples" },
        { name: "Presentations", href: "/presentations" },
      ],
    },
    {
      name: "Wealth Management",
      icon: BriefcaseIcon,
      items: [
        { name: "Secure Family Vault", href: "/legacy-vault" },
        { name: "Accounts", href: "/accounts" },
        { name: "Financial Plans", href: "/financial-plans" },
        { name: "Investments", href: "/accounts" },
        { name: "Tax & Budgets", href: "/tax-budgets" },
        { name: "Properties", href: "/properties" },
      ],
    },
    {
      name: "Planning & Services",
      icon: FileText,
      items: [
        { name: "Financial Planning", href: "/financial-plans" },
        { name: "Investments", href: "/accounts" },
        { name: "Tax Planning", href: "/tax-planning" },
        { name: "Estate Planning", href: "/estate-planning" },
        { name: "Insurance", href: "/insurance" },
        { name: "Lending", href: "/lending" }, // Updated to correct href
      ],
    },
    {
      name: "Collaboration",
      icon: MessageSquare,
      href: "/integration"
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="hidden md:flex w-64 flex-col h-screen bg-card border-r border-border">
      {/* User Profile Section at the top */}
      <UserProfileSection showLogo={true} />

      <nav className="flex-1 overflow-y-auto p-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 mb-4 p-2.5 rounded-md hover:bg-muted bg-amber-100/50 text-amber-900 font-medium shadow-sm border border-amber-200/50 mt-2"
        >
          <User className="h-4 w-4" />
          <span className="text-sm">Investor Profile</span>
        </Link>

        {navigationGroups.map((group) => (
          <div key={group.name} className="mb-3">
            {group.items ? (
              <Collapsible
                open={expandedSections[group.name.toLowerCase().replace(/\s+/g, '-')]}
                onOpenChange={() => toggleSection(group.name.toLowerCase().replace(/\s+/g, '-'))}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <group.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{group.name}</span>
                  </div>
                  {expandedSections[group.name.toLowerCase().replace(/\s+/g, '-')] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-6 mt-1 space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                to={group.href!}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
              >
                <group.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{group.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <AdvisorProfile />
    </aside>
  );
}
