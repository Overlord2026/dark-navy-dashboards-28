// Task 4: Persona Navigation Component
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { track } from '@/lib/bfoAnalytics';
import { cn } from '@/lib/utils';

const familySegments = [
  { label: 'Retirees', slug: 'retirees', description: 'Retirement income and legacy planning' },
  { label: 'Aspiring Wealthy', slug: 'aspiring-wealthy', description: 'Building wealth foundations' },
  { label: 'High Net Worth', slug: 'high-net-worth', description: 'Advanced wealth management' },
  { label: 'Business Owners', slug: 'business-owners', description: 'Exit and succession planning' },
  { label: 'Entrepreneurs/Founders', slug: 'entrepreneurs', description: 'Startup equity and growth' },
  { label: 'Corporate Executives', slug: 'executives', description: 'Executive compensation strategies' },
  { label: 'Physicians', slug: 'physicians', description: 'Medical practice wealth planning' },
  { label: 'Dentists', slug: 'dentists', description: 'Dental practice financial optimization' },
  { label: 'Independent Women', slug: 'independent-women', description: 'Women-focused financial planning' },
  { label: 'Athletes', slug: 'athletes', description: 'Sports career wealth management' },
  { label: 'Entertainers', slug: 'entertainers', description: 'Entertainment industry planning' },
];

const proSegments = [
  { label: 'Advisors', slug: 'advisors', description: 'Financial advisory services' },
  { label: 'Accountants/CPAs', slug: 'accountants-cpas', description: 'Tax and accounting services' },
  { label: 'Estate Attorneys', slug: 'estate-attorneys', description: 'Estate planning legal services' },
  { label: 'Litigation Attorneys', slug: 'litigation-attorneys', description: 'Legal representation services' },
  { label: 'Realtors', slug: 'realtors', description: 'Real estate services' },
  { label: 'Life/Annuities Insurance', slug: 'life-annuities', description: 'Life insurance and annuity products' },
  { label: 'Medicare Supplement', slug: 'medicare-supplement', description: 'Medicare supplement insurance', requiresCallRecording: true },
  { label: 'Long-Term Care', slug: 'long-term-care', description: 'Long-term care planning' },
  { label: 'Healthcare Facilities', slug: 'healthcare-facilities', description: 'Healthcare facility partnerships' },
  { label: 'Influencers', slug: 'influencers', description: 'Thought leadership and content' },
];

export function PersonaNavBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const handleMenuOpen = (menu: 'families' | 'pros') => {
    track({ name: 'nav.menu_open', menu });
  };

  const handlePersonaClick = (realm: 'families' | 'pros', slug: string) => {
    track({ name: 'persona.selected', realm, slug });
    setIsMobileOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">BFO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Families Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  onClick={() => handleMenuOpen('families')}
                  className="h-9"
                >
                  For Families
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                    {familySegments.map((segment) => (
                      <NavigationMenuLink key={segment.slug} asChild>
                        <Link
                          to={`/families/${segment.slug}`}
                          onClick={() => handlePersonaClick('families', segment.slug)}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "group"
                          )}
                        >
                          <div className="text-sm font-medium leading-none group-hover:text-primary">
                            {segment.label}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {segment.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Service Professionals Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  onClick={() => handleMenuOpen('pros')}
                  className="h-9"
                >
                  Service Professionals
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                    {proSegments.map((segment) => (
                      <NavigationMenuLink key={segment.slug} asChild>
                        <Link
                          to={`/pros/${segment.slug}`}
                          onClick={() => handlePersonaClick('pros', segment.slug)}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "group"
                          )}
                        >
                          <div className="text-sm font-medium leading-none group-hover:text-primary flex items-center gap-2">
                            {segment.label}
                            {segment.requiresCallRecording && (
                              <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                                Recording Required
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {segment.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {/* Families Section */}
            <div>
              <h3 className="font-semibold text-sm mb-2">For Families</h3>
              <div className="grid grid-cols-1 gap-2">
                {familySegments.map((segment) => (
                  <Link
                    key={segment.slug}
                    to={`/families/${segment.slug}`}
                    onClick={() => handlePersonaClick('families', segment.slug)}
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="font-medium">{segment.label}</div>
                    <div className="text-xs text-muted-foreground">{segment.description}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Professionals Section */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Service Professionals</h3>
              <div className="grid grid-cols-1 gap-2">
                {proSegments.map((segment) => (
                  <Link
                    key={segment.slug}
                    to={`/pros/${segment.slug}`}
                    onClick={() => handlePersonaClick('pros', segment.slug)}
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="font-medium flex items-center gap-2">
                      {segment.label}
                      {segment.requiresCallRecording && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-800">
                          Recording
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{segment.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}