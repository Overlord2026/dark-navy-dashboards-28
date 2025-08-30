import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const STORAGE_KEY = 'nil-compliance-ribbon-dismissed';

export default function ComplianceRibbon() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsDismissed(dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bfo-black text-bfo-gold border-t border-bfo-gold/40 p-3">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>
            Educational demo — not legal, accounting, or advertising advice. Use your org's compliance workflow.
          </span>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-bfo-gold hover:text-bfo-gold hover:bg-bfo-gold/10 p-1 h-auto"
              >
                <FileText className="h-3 w-3 mr-1" />
                Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#24313d] border-bfo-gold/40 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-bfo-gold">Trust Rails & Compliance Explainer</DialogTitle>
                <DialogDescription className="text-white/70">
                  Understanding our privacy-first, content-free receipt system
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-bfo-gold mb-2">🛡️ What are Trust Rails?</h4>
                  <p className="text-white/80">
                    Trust Rails are our cryptographic receipt system that creates tamper-evident audit trails 
                    without storing sensitive content. Every action generates a "content-free" receipt that 
                    proves something happened without revealing what.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-bfo-gold mb-2">🔒 Privacy-First Design</h4>
                  <ul className="space-y-1 text-white/80">
                    <li>• No PII or sensitive data stored in receipts</li>
                    <li>• Only action types, timestamps, and cryptographic hashes</li>
                    <li>• Optional anchoring to blockchain for immutability</li>
                    <li>• Full compliance with FERPA, HIPAA, and privacy regulations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-bfo-gold mb-2">📋 NIL Compliance Notes</h4>
                  <ul className="space-y-1 text-white/80">
                    <li>• This is an educational demo platform</li>
                    <li>• Not legal, accounting, or advertising advice</li>
                    <li>• Use your organization's official compliance workflow</li>
                    <li>• Consult qualified professionals for actual NIL deals</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-bfo-gold mb-2">🔍 Audit & Verification</h4>
                  <p className="text-white/80">
                    All receipts can be verified independently. The "Receipts" section shows your 
                    complete activity history with verification links. Anchored receipts cannot be 
                    altered after creation, providing legal-grade audit trails.
                  </p>
                </div>
                
                <div className="p-3 bg-bfo-gold/10 border border-bfo-gold/30 rounded">
                  <p className="text-xs text-bfo-gold/80">
                    <strong>Disclaimer:</strong> This platform is for educational and demonstration purposes. 
                    Always consult with qualified legal, tax, and compliance professionals before entering 
                    into actual NIL agreements or business relationships.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-bfo-gold hover:text-bfo-gold hover:bg-bfo-gold/10 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}