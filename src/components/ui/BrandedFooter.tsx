import React from 'react';
import { Link } from 'react-router-dom';
import { withTrademarks } from '@/utils/trademark';

export function BrandedFooter() {
  return (
    <footer className="bg-bfo-black border-t border-bfo-gold/20">
      <div className="container mx-auto px-4 py-4">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-sm mb-3 text-bfo-gold">Family Tools</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/family/tools/retirement" className="hover:text-bfo-gold transition-colors">Retirement Roadmap</Link></li>
              <li><Link to="/family/tools/ss-timing" className="hover:text-bfo-gold transition-colors">Social Security</Link></li>
              <li><Link to="/family/tools/rmd-check" className="hover:text-bfo-gold transition-colors">RMD Check</Link></li>
              <li><Link to="/family/tools/roth-ladder" className="hover:text-bfo-gold transition-colors">Roth Ladder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-bfo-gold">Tools & Calculators</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/family/tools" className="hover:text-bfo-gold transition-colors">All Family Tools</Link></li>
              <li><Link to="/family/tools/taxhub-preview" className="hover:text-bfo-gold transition-colors">TaxHub Preview</Link></li>
              <li><Link to="/family/receipts" className="hover:text-bfo-gold transition-colors">Proof Slips</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-bfo-gold">Marketplace</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/marketplace/advisors" className="hover:text-bfo-gold transition-colors">Financial Advisors</Link></li>
              <li><Link to="/marketplace/attorneys" className="hover:text-bfo-gold transition-colors">Attorneys</Link></li>
              <li><Link to="/marketplace/insurance" className="hover:text-bfo-gold transition-colors">Insurance</Link></li>
              <li><Link to="/healthcare" className="hover:text-bfo-gold transition-colors">Healthcare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-bfo-gold">Resources</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/discover" className="hover:text-bfo-gold transition-colors">Discover</Link></li>
              <li><Link to="/solutions" className="hover:text-bfo-gold transition-colors">Solutions</Link></li>
              <li><Link to="/family/receipts" className="hover:text-bfo-gold transition-colors">Activity Log</Link></li>
              <li><Link to="/docs/legacy" className="hover:text-bfo-gold transition-colors">Legacy (Beta)</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center text-xs text-white/60 border-t border-bfo-gold/20 pt-3">
          <span className="text-bfo-gold">{withTrademarks('Powered by Boutique Family Office')}</span>
        </div>
      </div>
    </footer>
  );
}