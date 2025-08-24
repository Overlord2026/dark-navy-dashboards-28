import React from 'react';
import { Link } from 'react-router-dom';
import { withTrademarks } from '@/utils/trademark';

export function BrandedFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6 mb-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Family Tools</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/family/tools/retirement" className="hover:text-foreground">Retirement Roadmap</Link></li>
              <li><Link to="/family/tools/ss-timing" className="hover:text-foreground">Social Security</Link></li>
              <li><Link to="/family/tools/rmd-check" className="hover:text-foreground">RMD Check</Link></li>
              <li><Link to="/family/tools/roth-ladder" className="hover:text-foreground">Roth Ladder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Tools & Calculators</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/family/tools" className="hover:text-foreground">All Family Tools</Link></li>
              <li><Link to="/family/tools/taxhub-preview" className="hover:text-foreground">TaxHub Preview</Link></li>
              <li><Link to="/family/receipts" className="hover:text-foreground">Proof Slips</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Resources</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/discover" className="hover:text-foreground">Discover</Link></li>
              <li><Link to="/solutions" className="hover:text-foreground">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Support</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/family/receipts" className="hover:text-foreground">Activity Log</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm text-muted-foreground border-t pt-4">
          <span>{withTrademarks('Powered by Boutique Family Office')}</span>
        </div>
      </div>
    </footer>
  );
}