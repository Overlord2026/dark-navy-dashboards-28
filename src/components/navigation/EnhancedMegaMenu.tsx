'use client';

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePersonaContext } from "@/hooks/usePersonaContext";

const MEGA_MENU = {
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

const PERSONA_CHIPS = [
  { label: "Retirees", href: "/families/retirees", variant: "secondary" as const },
  { label: "Business Owners", href: "/families/business-owners", variant: "secondary" as const },
  { label: "Advisors", href: "/pros/advisors", variant: "outline" as const },
  { label: "CPAs", href: "/pros/cpas", variant: "outline" as const },
  { label: "Attorneys", href: "/pros/attorneys", variant: "outline" as const },
  { label: "Insurance", href: "/pros/insurance", variant: "outline" as const },
];

interface MegaMenuProps {
  className?: string;
}

export function EnhancedMegaMenu({ className }: MegaMenuProps) {
  const navigate = useNavigate();
  const { selectedPersona, updatePersonaContext } = usePersonaContext();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handlePersonaClick = (href: string, personaType: string) => {
    // Create a basic persona data object for the context
    const personaData = {
      id: personaType as any,
      title: personaType,
      description: `${personaType} persona`,
      ctaText: 'Get Started',
      route: href
    };
    updatePersonaContext(personaType as any, personaData);
    navigate(href);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {/* For Families */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-navy-foreground hover:bg-navy-foreground/10">
                For Families
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-6 md:w-[700px] md:grid-cols-2 lg:w-[800px]">
                  {MEGA_MENU.families.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <Link
                        to={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handlePersonaClick(item.href, 'family')}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.desc}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* For Professionals */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-navy-foreground hover:bg-navy-foreground/10">
                For Professionals
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-6 md:w-[700px] md:grid-cols-2 lg:w-[800px]">
                  {MEGA_MENU.professionals.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <Link
                        to={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handlePersonaClick(item.href, 'professional')}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.desc}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-navy-foreground hover:bg-navy-foreground/10">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] gap-3 p-6 md:w-[600px] md:grid-cols-2">
                  {MEGA_MENU.services.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <Link
                        to={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Solutions */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-navy-foreground hover:bg-navy-foreground/10">
                Solutions
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-1">
                  {MEGA_MENU.solutions.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <Link
                        to={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation - "Choose Your Path" */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          className="w-full justify-start text-navy-foreground"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          Choose Your Path
        </Button>
        
        {isMobileOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background p-4 shadow-lg">
            <Tabs defaultValue="families" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="families">Families</TabsTrigger>
                <TabsTrigger value="professionals">Professionals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="families" className="space-y-2">
                {MEGA_MENU.families.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block p-3 rounded-md hover:bg-accent"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handlePersonaClick(item.href, 'family');
                    }}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </Link>
                ))}
              </TabsContent>
              
              <TabsContent value="professionals" className="space-y-2">
                {MEGA_MENU.professionals.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block p-3 rounded-md hover:bg-accent"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handlePersonaClick(item.href, 'professional');
                    }}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </Link>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Persona Chips */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {PERSONA_CHIPS.map((chip) => (
          <Badge
            key={chip.label}
            variant={chip.variant}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate(chip.href)}
          >
            {chip.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}