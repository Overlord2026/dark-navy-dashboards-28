import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, ExternalLink } from 'lucide-react';
import { getStartedRoute } from '@/utils/getStartedUtils';
import MastheadPersonaToggle from './MastheadPersonaToggle';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
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
import { cn } from '@/lib/utils';
import analytics from '@/lib/analytics';
import { getPersonaGroup } from '@/components/AudienceGuard';
import { servicesMenu, solutionsMenu, personaMenus, PersonaRoot } from '@/lib/persona';

interface BFOHeaderProps {
  showPersonaBanner?: boolean;
  className?: string;
}

export const BFOHeader: React.FC<BFOHeaderProps> = ({ 
  showPersonaBanner = true, 
  className 
}) => {
  // Stub out to prevent duplicate headers
  return null;
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
                {/* Services */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {servicesMenu.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4">
                      {servicesMenu.groups.map((group) => (
                        <div key={group.heading}>
                          <h4 className="text-sm font-medium leading-none mb-3">{group.heading}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {group.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  onClick={() => analytics.track('nav.mega.clicked', { 
                                    group: getPersonaGroup(), 
                                    section: 'services', 
                                    item: item.label 
                                  })}
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
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {solutionsMenu.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[800px] gap-3 p-4 grid-cols-2">
                      {solutionsMenu.groups.map((group) => (
                        <div key={group.heading}>
                          <h4 className="text-sm font-medium leading-none mb-3">{group.heading}</h4>
                          <div className="grid gap-2">
                            {group.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  onClick={() => analytics.track('nav.mega.clicked', { 
                                    group: getPersonaGroup(), 
                                    section: 'solutions', 
                                    item: item.label 
                                  })}
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
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Persona-specific Menu */}
                {(() => {
                  const personaGroup = getPersonaGroup();
                  const personaKey = personaGroup === 'family' ? 'families' : 'professionals';
                  const menu = personaMenus[personaKey as PersonaRoot];
                  
                  return (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        {menu.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[400px] gap-3 p-4">
                          {menu.groups.map((group) => (
                            <div key={group.heading}>
                              <h4 className="text-sm font-medium leading-none mb-3">{group.heading}</h4>
                              <div className="grid gap-2">
                                {group.items.map((item) => (
                                  <NavigationMenuLink key={item.href} asChild>
                                    <Link
                                      to={item.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      onClick={() => analytics.track('nav.mega.clicked', { 
                                        group: personaGroup, 
                                        section: personaKey, 
                                        item: item.label 
                                      })}
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
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })()}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <GoldOutlineRouterLink to="/login">
                Sign In
              </GoldOutlineRouterLink>
              <GoldRouterLink to={getStartedRoute()}>
                Get Started
              </GoldRouterLink>
              
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
                    {/* Services Mobile */}
                    <div className="grid gap-2">
                      <h4 className="font-medium">{servicesMenu.label}</h4>
                      <div className="grid gap-1 pl-4">
                        {servicesMenu.groups.map((group) => (
                          <div key={group.heading}>
                            <h5 className="text-sm text-muted-foreground">{group.heading}</h5>
                            {group.items.map((item) => (
                              <Link key={item.href} to={item.href} className="text-sm hover:underline">
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solutions Mobile */}
                    <div className="grid gap-2">
                      <h4 className="font-medium">{solutionsMenu.label}</h4>
                      <div className="grid gap-1 pl-4">
                        {solutionsMenu.groups.map((group) => (
                          <div key={group.heading}>
                            <h5 className="text-sm text-muted-foreground">{group.heading}</h5>
                            {group.items.map((item) => (
                              <Link key={item.href} to={item.href} className="text-sm hover:underline">
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Persona Menu Mobile */}
                    {(() => {
                      const personaGroup = getPersonaGroup();
                      const personaKey = personaGroup === 'family' ? 'families' : 'professionals';
                      const menu = personaMenus[personaKey as PersonaRoot];
                      
                      return (
                        <div className="grid gap-2">
                          <h4 className="font-medium">{menu.label}</h4>
                          <div className="grid gap-1 pl-4">
                            {menu.groups.map((group) => (
                              <div key={group.heading}>
                                <h5 className="text-sm text-muted-foreground">{group.heading}</h5>
                                {group.items.map((item) => (
                                  <Link key={item.href} to={item.href} className="text-sm hover:underline">
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Persona Toggle */}
      <MastheadPersonaToggle />

      {/* Persona Sub-Banner */}
      {showPersonaBanner && personaLinks.length > 0 && (
        <div className="bg-black text-[#D4AF37] gold-border w-full">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              {personaLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-1 flex-shrink-0">
                  <Link
                    to={link.href}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-white hover:text-[#D4AF37] transition-colors rounded-md hover:bg-[#D4AF37]/10"
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