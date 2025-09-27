import React, { useState } from 'react';
import { ChevronDown, Home, Users, Building2, GraduationCap, TrendingUp, BookOpen, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function MegaMenuV2() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const handleMenuClick = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  return (
    <nav className="bg-bfo-black border-b border-bfo-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bfo-gold rounded flex items-center justify-center">
              <span className="text-bfo-black font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold">BFO</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Families Hub */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('families')}
                className="flex items-center gap-1 text-white hover:text-bfo-gold transition-colors"
              >
                <Home className="w-4 h-4" />
                Families
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {openMenu === 'families' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-bfo-purple border border-bfo-gold/30 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-bfo-gold font-semibold mb-3">Families Hub</h3>
                    <div className="space-y-2">
                      <Link to="/families" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Hub Home
                      </Link>
                      <Link to="/families/dashboard" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Dashboard
                      </Link>
                      <Link to="/families/wealth" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Wealth Management
                      </Link>
                      <Link to="/families/planning" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Financial Planning
                      </Link>
                      <Link to="/families/education" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Education
                      </Link>
                      <Link to="/families/marketplace" className="block text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                        Find Professionals
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service Pros Suite */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('pros')}
                className="flex items-center gap-1 text-white hover:text-bfo-gold transition-colors"
              >
                <Users className="w-4 h-4" />
                Service Pros
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {openMenu === 'pros' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-bfo-purple border border-bfo-gold/30 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-bfo-gold font-semibold mb-3">Professional Suite</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Workspace</h4>
                        <div className="space-y-1">
                          <Link to="/pros" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Suite Home
                          </Link>
                          <Link to="/pros/dashboard" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Dashboard
                          </Link>
                          <Link to="/pros/clients" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Clients
                          </Link>
                          <Link to="/pros/leads" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Leads
                          </Link>
                          <Link to="/pros/meetings" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Meetings
                          </Link>
                          <Link to="/pros/tools" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Tools
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Specializations</h4>
                        <div className="space-y-1">
                          <Link to="/pros/advisors" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Advisors
                          </Link>
                          <Link to="/pros/cpas" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            CPAs
                          </Link>
                          <Link to="/pros/attorneys" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Attorneys
                          </Link>
                          <Link to="/pros/insurance" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Insurance
                          </Link>
                          <Link to="/pros/healthcare" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Healthcare
                          </Link>
                          <Link to="/pros/marketplace" className="block text-sm text-white hover:text-bfo-gold transition-colors" onClick={handleClose}>
                            Marketplace
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NIL Platform */}
            <Link to="/nil" className="flex items-center gap-1 text-white hover:text-bfo-gold transition-colors">
              <GraduationCap className="w-4 h-4" />
              NIL
            </Link>

            {/* Solutions */}
            <Link to="/solutions" className={`flex items-center gap-1 transition-colors ${
              location.pathname === '/solutions' ? 'text-bfo-gold' : 'text-white hover:text-bfo-gold'
            }`}>
              <TrendingUp className="w-4 h-4" />
              Solutions
            </Link>

            {/* Pricing */}
            <Link to="/pricing#families" className={`flex items-center gap-1 transition-colors ${
              location.pathname === '/pricing' ? 'text-bfo-gold' : 'text-white hover:text-bfo-gold'
            }`}>
              <DollarSign className="w-4 h-4" />
              Pricing
            </Link>

            {/* Learn */}
            <Link to="/learn" className={`flex items-center gap-1 transition-colors ${
              location.pathname === '/learn' ? 'text-bfo-gold' : 'text-white hover:text-bfo-gold'
            }`}>
              <BookOpen className="w-4 h-4" />
              Learn
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay to close menus */}
      {openMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={handleClose}
        />
      )}
    </nav>
  );
}