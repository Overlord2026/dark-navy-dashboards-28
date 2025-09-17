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
import { PERSONA_CONFIG } from "@/config/personaConfig";
import { SOLUTIONS_CONFIG } from "@/config/solutionsConfig";
import catalogConfig from "@/config/catalogConfig.json";

// Group personas from config
const familyPersonas = PERSONA_CONFIG.filter(p => p.persona === 'families');
const advisorPersonas = PERSONA_CONFIG.filter(p => p.persona === 'advisors');
const cpaPersonas = PERSONA_CONFIG.filter(p => p.persona === 'cpas');
const attorneyPersonas = PERSONA_CONFIG.filter(p => p.persona === 'attorneys');
const insurancePersonas = PERSONA_CONFIG.filter(p => p.persona === 'insurance');
const healthcarePersonas = PERSONA_CONFIG.filter(p => p.persona === 'healthcare');
const realtorPersonas = PERSONA_CONFIG.filter(p => p.persona === 'realtor');
// Removed NIL personas - focusing on advisor/family workflows

// Get top tools per persona for "Tools you'll use today"
const getTopToolsForPersona = (personaTags: string[]) => {
  return (catalogConfig as any[])
    .filter(tool => tool.personas?.some((p: string) => personaTags.includes(p)))
    .slice(0, 3);
};

const MEGA_MENU = {
  families: familyPersonas.map(p => ({
    title: p.segment ? `${p.segment.charAt(0).toUpperCase() + p.segment.slice(1)} Families` : p.label.split(' — ')[1],
    href: `/families/${p.segment || p.persona}`,
    desc: p.benefit
  })),
  professionals: [
    ...advisorPersonas.map(p => ({ title: p.label.split(' — ')[0], href: `/pros/advisors`, desc: p.benefit })),
    ...cpaPersonas.map(p => ({ title: p.label.split(' — ')[0], href: `/pros/cpas`, desc: p.benefit })),
    ...attorneyPersonas.map(p => ({ title: p.label.split(' — ')[0], href: `/pros/attorneys`, desc: p.benefit })),
    ...insurancePersonas.map(p => ({ title: `${p.label.split(' — ')[1]}`, href: `/pros/insurance/${p.segment}`, desc: p.benefit })),
    ...healthcarePersonas.map(p => ({ title: `Healthcare ${p.segment}`, href: `/pros/healthcare/${p.segment}`, desc: p.benefit })),
    ...realtorPersonas.map(p => ({ title: p.label.split(' — ')[0], href: `/pros/realtor`, desc: p.benefit })),
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
  solutions: SOLUTIONS_CONFIG.map(s => ({
    title: s.label,
    href: s.route,
    desc: `Complete ${s.label.toLowerCase()} tools and workflows`
  })),
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
                <div className="w-[600px] p-6 md:w-[700px] lg:w-[800px]">
                  <Tabs defaultValue="aspiring" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="aspiring">Aspiring</TabsTrigger>
                      <TabsTrigger value="retirees">Retirees</TabsTrigger>
                    </TabsList>
                    
                    {familyPersonas.map((persona) => (
                      <TabsContent key={persona.segment} value={persona.segment} className="space-y-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/families/${persona.segment}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={() => handlePersonaClick(`/families/${persona.segment}`, 'family')}
                          >
                            <div className="text-sm font-medium leading-none">{persona.label}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {persona.benefit}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* For Professionals */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-navy-foreground hover:bg-navy-foreground/10">
                For Professionals
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[700px] p-6 md:w-[800px] lg:w-[900px]">
                  <div className="grid gap-6">
                    {/* Single personas */}
                    <div className="grid grid-cols-2 gap-3">
                      {[...advisorPersonas, ...cpaPersonas, ...attorneyPersonas, ...realtorPersonas].map((persona) => (
                        <NavigationMenuLink key={persona.persona} asChild>
                          <Link
                            to={`/pros/${persona.persona}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={() => handlePersonaClick(`/pros/${persona.persona}`, 'professional')}
                          >
                            <div className="text-sm font-medium leading-none">{persona.label}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {persona.benefit}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>

                    {/* Tabbed sections */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Insurance */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Insurance</h4>
                        <Tabs defaultValue="life-annuity" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger value="life-annuity" className="text-xs">Life & Annuity</TabsTrigger>
                            <TabsTrigger value="medicare-ltc" className="text-xs">Medicare & LTC</TabsTrigger>
                          </TabsList>
                          {insurancePersonas.map((persona) => (
                            <TabsContent key={persona.segment} value={persona.segment} className="mt-2">
                              <NavigationMenuLink asChild>
                                <Link
                                  to={`/pros/insurance/${persona.segment}`}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  onClick={() => handlePersonaClick(`/pros/insurance/${persona.segment}`, 'professional')}
                                >
                                  <div className="text-xs font-medium leading-none">{persona.label}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {persona.benefit}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>

                      {/* Healthcare */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Healthcare</h4>
                        <Tabs defaultValue="providers" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger value="providers" className="text-xs">Providers</TabsTrigger>
                            <TabsTrigger value="influencers" className="text-xs">Coaches</TabsTrigger>
                          </TabsList>
                          {healthcarePersonas.map((persona) => (
                            <TabsContent key={persona.segment} value={persona.segment} className="mt-2">
                              <NavigationMenuLink asChild>
                                <Link
                                  to={`/pros/healthcare/${persona.segment}`}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  onClick={() => handlePersonaClick(`/pros/healthcare/${persona.segment}`, 'professional')}
                                >
                                  <div className="text-xs font-medium leading-none">{persona.label}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {persona.benefit}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </div>
                  </div>
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
                <div className="w-[600px] p-6 md:w-[700px]">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Link to="/solutions" className="block p-3 rounded-md hover:bg-accent">
                        <div className="text-sm font-medium mb-1">All Solutions</div>
                        <div className="text-xs text-muted-foreground">View complete solutions hub</div>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {MEGA_MENU.solutions.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          to={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Tools you'll use today</div>
                    <div className="grid grid-cols-3 gap-2">
                      {getTopToolsForPersona(['family', 'advisor']).map((tool: any) => (
                        <Link
                          key={tool.key}
                          to={tool.route}
                          className="text-xs p-2 rounded hover:bg-accent block"
                        >
                          {tool.label}
                        </Link>
                      ))}
                    </div>
                  </div>
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