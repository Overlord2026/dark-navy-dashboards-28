import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { usePersonaStore } from '@/store/personaStore';
import { 
  Persona, 
  FAMILY_MENU_GROUPS, 
  PROFESSIONAL_MENU_GROUPS, 
  RESOURCE_MENU_GROUPS,
  EDUCATION_MENU_GROUPS,
  SOLUTIONS_MENU_GROUPS,
  MenuGroup
} from '@/lib/persona';

interface PersonaNavProps {
  className?: string;
}

interface NavMenuProps {
  label: string;
  groups: MenuGroup[];
  isActive: boolean;
  onPersonaSelect?: (persona: Persona) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ label, groups, isActive, onPersonaSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isFocused) {
        setIsOpen(false);
      }
    }, 150);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!menuRef.current?.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const menuId = `menu-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <button
        className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isActive 
            ? 'text-primary bg-primary/10' 
            : 'text-foreground hover:text-primary hover:bg-muted/50'
        }`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={menuId}
          className="absolute top-full left-0 w-96 bg-background border border-border rounded-lg shadow-lg mt-1 z-40 animate-fade-in"
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
        >
          <div className="p-4 grid gap-6">
            {groups.map((group, groupIndex) => (
              <div key={group.label} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block p-2 text-sm text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      role="menuitem"
                      tabIndex={isOpen ? 0 : -1}
                      onClick={() => {
                        if (item.segment && onPersonaSelect) {
                          const persona = label === 'Families' ? Persona.FAMILY : Persona.PROFESSIONAL;
                          onPersonaSelect(persona);
                        }
                        setIsOpen(false);
                        setIsFocused(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.currentTarget.click();
                        }
                      }}
                    >
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const PersonaNav: React.FC<PersonaNavProps> = ({ className = '' }) => {
  const location = useLocation();
  const { setPersona } = usePersonaStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActiveRoute = (path: string) => location.pathname.startsWith(path);

  const handlePersonaSelect = (persona: Persona) => {
    setPersona(persona);
  };

  return (
    <>
      <nav className={`sticky top-14 z-40 w-full bg-background border-b border-border ${className}`}>
        <div className="container">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 h-12">
            <NavMenu
              label="Families"
              groups={FAMILY_MENU_GROUPS}
              isActive={isActiveRoute('/families')}
              onPersonaSelect={handlePersonaSelect}
            />
            <NavMenu
              label="Professionals"
              groups={PROFESSIONAL_MENU_GROUPS}
              isActive={isActiveRoute('/pros')}
              onPersonaSelect={handlePersonaSelect}
            />
            <NavMenu
              label="Resources"
              groups={RESOURCE_MENU_GROUPS}
              isActive={isActiveRoute('/resources')}
            />
            <NavMenu
              label="Education"
              groups={EDUCATION_MENU_GROUPS}
              isActive={isActiveRoute('/education')}
            />
            <NavMenu
              label="Solutions"
              groups={SOLUTIONS_MENU_GROUPS}
              isActive={isActiveRoute('/solutions')}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center justify-between h-12 px-4">
            <span className="text-sm font-medium text-foreground">Navigation</span>
            <button
              className="p-2 text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl overflow-y-auto animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 id="mobile-menu-title" className="text-lg font-semibold text-foreground">
                  Navigation
                </h2>
                <button
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Families', groups: FAMILY_MENU_GROUPS, path: '/families' },
                  { label: 'Professionals', groups: PROFESSIONAL_MENU_GROUPS, path: '/pros' },
                  { label: 'Resources', groups: RESOURCE_MENU_GROUPS, path: '/resources' },
                  { label: 'Education', groups: EDUCATION_MENU_GROUPS, path: '/education' },
                  { label: 'Solutions', groups: SOLUTIONS_MENU_GROUPS, path: '/solutions' }
                ].map((section) => (
                  <div key={section.label} className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      {section.label}
                    </h3>
                    {section.groups.map((group) => (
                      <div key={group.label} className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {group.label}
                        </h4>
                        <div className="space-y-1 pl-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block py-2 text-sm text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
                              onClick={() => {
                                if (item.segment) {
                                  const persona = section.label === 'Families' ? Persona.FAMILY : Persona.PROFESSIONAL;
                                  handlePersonaSelect(persona);
                                }
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};