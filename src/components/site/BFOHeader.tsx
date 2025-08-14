import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePersonaSublinks } from '@/hooks/usePersonaSublinks';
import { MEGA_MENU_CONFIG } from '@/config/persona-links';
import { cn } from '@/lib/utils';

interface BFOHeaderProps {
  showPersonaBanner?: boolean;
  className?: string;
}

export const BFOHeader: React.FC<BFOHeaderProps> = ({ 
  showPersonaBanner = true, 
  className 
}) => {
  const personaLinks = usePersonaSublinks();
  const [isConnected] = React.useState(false); // Will be dynamic based on integration status

  return (
    <div className={cn("w-full", className)}>
      {/* Main Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/brand/bfo-emblem-gold.png" 
                  alt="BFO CFO" 
                  className="h-8 w-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <img 
                  src="/brand/bfo-wordmark-horizontal.png" 
                  alt="BFO CFO" 
                  className="h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Link>
              
              {isConnected && (
                <Badge variant="secondary" className="text-xs">
                  Connected
                </Badge>
              )}
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {/* For Families */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>For Families</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <div className="grid gap-1">
                        <h4 className="text-sm font-medium leading-none">Family Types</h4>
                        <p className="text-sm text-muted-foreground">
                          Tailored solutions for every family stage
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {MEGA_MENU_CONFIG.families.sections[0].items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.label}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* For Professionals */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>For Professionals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4">
                      <div className="grid gap-1">
                        <h4 className="text-sm font-medium leading-none">Professional Services</h4>
                        <p className="text-sm text-muted-foreground">
                          Tools and solutions for financial services professionals
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {MEGA_MENU_CONFIG.professionals.sections.map((section) => (
                          <div key={section.title} className="grid gap-2">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {section.title}
                            </h5>
                            {section.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{item.label}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-4">
                      <div className="grid gap-1">
                        <h4 className="text-sm font-medium leading-none">Core Services</h4>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive financial services catalog
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {MEGA_MENU_CONFIG.services.sections[0].items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.label}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4">
                      <div className="grid gap-1">
                        <h4 className="text-sm font-medium leading-none">Guided Solutions</h4>
                        <p className="text-sm text-muted-foreground">
                          Step-by-step workflows for complex financial tasks
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {MEGA_MENU_CONFIG.solutions.sections.map((section) => (
                          <div key={section.title} className="grid gap-2">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {section.title}
                            </h5>
                            {section.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{item.label}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>
                      Access all BFO CFO services and solutions
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    {Object.values(MEGA_MENU_CONFIG).map((section) => (
                      <div key={section.title} className="grid gap-2">
                        <h4 className="font-medium">{section.title}</h4>
                        <div className="grid gap-1 pl-4">
                          {section.sections.map((subsection) => (
                            <div key={subsection.title} className="grid gap-1">
                              <h5 className="text-sm text-muted-foreground">{subsection.title}</h5>
                              {subsection.items.map((item) => (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  className="text-sm hover:underline"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Persona Sub-Banner */}
      {showPersonaBanner && personaLinks.length > 0 && (
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-hide">
              {personaLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-1 flex-shrink-0">
                  <Link
                    to={link.href}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {link.badge}
                      </Badge>
                    )}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                  {index < personaLinks.length - 1 && (
                    <span className="text-muted-foreground/50">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BFOHeader;