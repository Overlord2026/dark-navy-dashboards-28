import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePersonaContext } from '@/hooks/usePersonaContext';
import { TreePine, ChevronDown, Users, Building, Settings, Briefcase, ArrowRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

export const MEGA_MENU = {
  families: [
    { title: "Aspiring Families", href: "/families/aspiring", desc: "Early builders—save, invest, protect." },
    { title: "Younger Families", href: "/families/younger", desc: "Career growth, kids, first home." },
    { title: "Wealthy (HNW)", href: "/families/wealthy", desc: "Tax coordination, alternatives, entities." },
    { title: "Executives", href: "/families/executives", desc: "ISOs/RSUs, AMT, 10b5-1 planning." },
    { title: "Retirees", href: "/families/retirees", desc: "Income Now/Later—stay retired." },
    { title: "Business Owners", href: "/families/business-owners", desc: "Exit strategy, entity design." },
  ],
  professionals: [
    { title: "Advisors", href: "/pros/advisors", desc: "Book health, meeting kits, workflows." },
    { title: "CPAs", href: "/pros/cpas", desc: "Quarterlies, K-1, intake & e-sign." },
    { title: "Estate Attorneys", href: "/pros/attorneys", desc: "Titling exceptions, trust funding." },
    { title: "Insurance", href: "/pros/insurance", desc: "Case design, underwriting packets." },
    { title: "Healthcare/Care", href: "/pros/healthcare", desc: "LTC planning & permissions." },
    { title: "Bank/Trust", href: "/pros/bank-trust", desc: "Entity distributions & audits." },
  ],
  services: [
    { title: "SWAG™ Planning Hub", href: "/services/planning" },
    { title: "Private Market Alpha", href: "/services/private-markets" },
    { title: "Cash & Transfers", href: "/services/cash" },
    { title: "Taxes & Quarterlies", href: "/services/taxes" },
    { title: "Estate & Titling", href: "/services/estate" },
    { title: "Entities & Filings", href: "/services/entities" },
    { title: "Documents & E-Sign", href: "/services/documents" },
    { title: "Education & Concierge", href: "/education" },
  ],
  solutions: [
    { title: "Income Now / Later", href: "/solutions/income-now" },
    { title: "RMD Orchestration", href: "/solutions/rmds" },
    { title: "K-1 / Tax Season", href: "/solutions/tax-season" },
    { title: "Subscribe & Capital Calls", href: "/solutions/private-market-alpha" },
    { title: "Entity Renewals & Licenses", href: "/solutions/entities" },
  ],
} as const;

export const MegaMenu: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPersona } = usePersonaContext();

  // Filter menu items based on persona if available
  const getFilteredFamilies = () => {
    if (!selectedPersona || selectedPersona !== 'family') return MEGA_MENU.families;
    // Could add persona-specific filtering here
    return MEGA_MENU.families;
  };

  const getFilteredProfessionals = () => {
    if (!selectedPersona || selectedPersona === 'family') return MEGA_MENU.professionals;
    // Could highlight the selected professional type
    return MEGA_MENU.professionals;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <TreePine className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Family Office</span>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* For Families */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  For Families
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                    {getFilteredFamilies().map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        onClick={() => navigate(item.href)}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.desc}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* For Professionals */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  For Professionals
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                    {getFilteredProfessionals().map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        onClick={() => navigate(item.href)}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.desc}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Services */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] grid-cols-1 gap-3 p-4">
                    {MEGA_MENU.services.map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        onClick={() => navigate(item.href)}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] grid-cols-1 gap-3 p-4">
                    {MEGA_MENU.solutions.map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        onClick={() => navigate(item.href)}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Get Started - Always Persistent */}
          <div className="flex items-center gap-4">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/auth/signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};