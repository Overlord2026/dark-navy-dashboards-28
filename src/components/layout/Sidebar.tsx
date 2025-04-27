
import React, { useState } from "react";
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
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FamilyProfile } from "@/components/sidebar/FamilyProfile";
import { AdvisorProfile } from "@/components/sidebar/AdvisorProfile";

interface NavSection {
  id: string;
  label: string;
  icon?: React.ElementType;
  items?: { label: string; href: string; icon: React.ElementType }[];
  href?: string;
}

export const Sidebar = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(["education", "planning"]);

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
      href: "/wealth-management",
    },
    {
      id: "planning",
      label: "Planning & Services",
      icon: FileText,
      items: [
        { label: "Financial Planning", href: "/financial-planning", icon: FileText },
        { label: "Investments", href: "/investments", icon: TrendingUp },
        { label: "Tax Planning", href: "/tax-planning", icon: FileText },
        { label: "Estate Planning", href: "/estate-planning", icon: FileText },
        { label: "Insurance", href: "/insurance", icon: Shield },
        { label: "Lending", href: "/lending", icon: Banknote },
      ],
    },
    {
      id: "collaboration",
      label: "Collaboration",
      icon: MessageSquare,
      href: "/collaboration",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="w-60 h-screen bg-background border-r border-border flex flex-col">
      <FamilyProfile />
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.id} className="mb-2">
            {section.items ? (
              // Collapsible section
              <div>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    {section.icon && <section.icon className="h-4 w-4" />}
                    {section.label}
                  </div>
                  {openSections.includes(section.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {openSections.includes(section.id) && (
                  <div className="mt-1">
                    {section.items.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 text-sm hover:bg-accent",
                          isActive(item.href) && "bg-accent font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Single link
              <Link
                to={section.href!}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent",
                  isActive(section.href!) && "bg-accent font-medium"
                )}
              >
                {section.icon && <section.icon className="h-4 w-4" />}
                {section.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <AdvisorProfile />
    </aside>
  );
};

