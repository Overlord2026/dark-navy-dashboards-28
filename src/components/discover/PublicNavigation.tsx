import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LogIn, ArrowRight, ChevronDown, Award, Play, Building2, Search } from 'lucide-react';
import { getFlag } from '@/config/flags';

export const PublicNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNilOpen, setIsNilOpen] = useState(false);

  const navItems = [
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Goals', href: '/goals' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Personas', href: '/discover#personas' },
    { label: 'Proof', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' }
  ];

  // NIL Menu Items with feature flag gating
  const nilItems = [
    { 
      label: 'NIL Hub', 
      href: '/nil',
      icon: Award,
      description: 'Name, Image & Likeness marketplace'
    },
    { 
      label: 'Weekly NIL Index', 
      href: '/nil/index',
      icon: Award,
      description: 'Market trends and opportunities'
    },
    ...(getFlag('DEMOS_ENABLED') ? [
      { 
        label: '60-sec demo: Athlete', 
        href: '/demos/nil-athlete',
        icon: Play,
        description: 'Athlete journey demonstration'
      },
      { 
        label: '60-sec demo: School/University', 
        href: '/demos/nil-school',
        icon: Play,
        description: 'School & university compliance demonstration'
      }
    ] : []),
    ...(getFlag('BRAND_PUBLIC_ENABLED') ? [
      { 
        label: 'For Brands & Local Businesses', 
        href: '/start/brand',
        icon: Building2,
        description: 'Start your NIL campaign in 2 clicks'
      }
    ] : [])
  ];

  const handleLogin = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('login.click', { source: 'nav' });
    }
    
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { source: 'nav' });
    }
    
    window.location.href = '/onboarding';
  };

  // Keyboard navigation for mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setIsNilOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/discover" className="flex items-center">
              <img src="/brand/bfo-logo-gold.svg" alt="Boutique Family Office" className="h-6 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* NIL Dropdown - First Priority */}
            {(window as any).__ENABLE_NIL__ && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      // Analytics
                      if (typeof window !== 'undefined' && (window as any).analytics) {
                        (window as any).analytics.track('nav.nil.open', { source: 'desktop-dropdown' });
                      }
                    }}
                  >
                    NIL
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 bg-background border shadow-lg z-50"
                  align="start"
                >
                  {nilItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <a
                        href={item.href}
                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          // Analytics for different targets
                          if (typeof window !== 'undefined' && (window as any).analytics) {
                            let target = 'unknown';
                            if (item.href === '/nil') target = 'hub';
                            else if (item.href === '/nil/index') target = 'index';
                            else if (item.href === '/demos/nil-athlete') target = 'demo-athlete';
                            else if (item.href === '/demos/nil-school') target = 'demo-school';
                            else if (item.href === '/start/brand') target = 'brand-start';
                            
                            (window as any).analytics.track('nav.nil.click', { 
                              target,
                              source: 'desktop-dropdown'
                            });
                          }
                        }}
                      >
                        <item.icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Other Nav Items */}
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Button>
            <Button size="sm" className="bg-gold hover:bg-gold-hover text-navy" onClick={handleGetStarted}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Get started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  aria-label="Open navigation menu"
                  className="focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-72 bg-navy-900"
                onKeyDown={handleKeyDown}
              >
                <div className="space-y-6 mt-6">
                   {/* NIL Accordion Section */}
                   {(window as any).__ENABLE_NIL__ && (
                    <div className="space-y-2">
                      <Collapsible open={isNilOpen} onOpenChange={setIsNilOpen}>
                         <CollapsibleTrigger asChild>
                           <Button
                             variant="ghost"
                             className="w-full justify-between text-left text-white hover:text-[#D4AF37] hover:bg-white/10 focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0 min-h-[44px] transition-colors duration-200"
                             aria-expanded={isNilOpen}
                             onClick={() => {
                               // Analytics
                               if (typeof window !== 'undefined' && (window as any).analytics) {
                                 (window as any).analytics.track('nav.nil.open', { source: 'mobile-accordion' });
                               }
                             }}
                           >
                             <div className="flex items-center gap-2">
                               <Award className="h-5 w-5" />
                               <span className="font-medium">NIL</span>
                             </div>
                             <ChevronDown 
                               className={`h-4 w-4 transition-transform duration-200 ${
                                 isNilOpen ? 'rotate-180' : ''
                               }`} 
                             />
                           </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pl-2">
                          {nilItems.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              className="group block p-3 rounded-md text-white hover:text-[#D4AF37] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0 min-h-[44px] transition-colors duration-200"
                              onClick={() => {
                                setIsOpen(false);
                                // Analytics for brand clicks
                                if (item.href === '/start/brand' && typeof window !== 'undefined' && (window as any).analytics) {
                                  (window as any).analytics.track('brand.start.click', { 
                                    source: 'nil-mobile-menu',
                                    campaign: 'quick-start'
                                  });
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <item.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium">{item.label}</div>
                                  <div className="text-xs text-gray-300 group-hover:text-gray-200">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* Divider */}
                      <div className="border-t border-white/20 pt-4" />
                    </div>
                  )}

                   {/* Navigation Links */}
                   <div className="space-y-4">
                     {navItems.map((item) => (
                       <a
                         key={item.label}
                         href={item.href}
                         className="block text-lg font-medium text-white hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0 min-h-[44px] flex items-center gap-2 transition-colors duration-200"
                         onClick={() => setIsOpen(false)}
                       >
                         {item.icon && <item.icon className="h-5 w-5" />}
                         {item.label}
                       </a>
                     ))}
                   </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-6 border-t border-white/20">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/30 text-white hover:text-[#D4AF37] hover:bg-white/10 focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0 min-h-[44px]" 
                      onClick={() => {
                        setIsOpen(false);
                        handleLogin();
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Button>
                    <Button 
                      className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-navy-900 focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-0 min-h-[44px]" 
                      onClick={() => {
                        setIsOpen(false);
                        handleGetStarted();
                      }}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Get started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};