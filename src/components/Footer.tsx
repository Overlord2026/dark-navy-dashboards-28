import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bfo-footer w-full py-8" role="contentinfo" aria-label="Footer">
      <div className="container max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-bfo-gold font-semibold text-lg">
              Family Office Marketplace
            </h3>
            <p className="text-sm text-bfo-white/80">
              Connecting families with trusted financial professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-bfo-gold font-medium">Quick Links</h4>
            <nav className="flex flex-col space-y-2" aria-label="Footer navigation">
              <Link 
                to="/marketplace/advisors" 
                className="text-sm hover:text-bfo-white transition-colors"
                aria-label="Find Financial Advisors"
              >
                Find Advisors
              </Link>
              <Link 
                to="/marketplace/cpa" 
                className="text-sm hover:text-bfo-white transition-colors"
                aria-label="Find CPAs"
              >
                Find CPAs
              </Link>
              <Link 
                to="/families" 
                className="text-sm hover:text-bfo-white transition-colors"
                aria-label="Family Dashboard"
              >
                Families
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-bfo-gold font-medium">Resources</h4>
            <nav className="flex flex-col space-y-2" aria-label="Resources navigation">
              <Link 
                to="/admin/publish" 
                className="text-sm hover:text-bfo-white transition-colors"
                aria-label="Pre-publish Checks"
              >
                Pre-publish Checks
              </Link>
              <Link 
                to="/admin/hq/ip-ledger" 
                className="text-sm hover:text-bfo-white transition-colors"
                aria-label="IP Ledger"
              >
                IP Ledger
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-bfo-gold font-medium">Contact</h4>
            <div className="space-y-2 text-sm text-bfo-white/80">
              <p>support@familyoffice.com</p>
              <p>1-800-FAMILY-0</p>
            </div>
          </div>
        </div>

        <div className="border-t border-bfo-gold/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-bfo-white/60">
            © 2024 Family Office Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-sm text-bfo-white/60 hover:text-bfo-gold transition-colors"
              aria-label="Privacy Policy"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-bfo-white/60 hover:text-bfo-gold transition-colors"
              aria-label="Terms of Service"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}