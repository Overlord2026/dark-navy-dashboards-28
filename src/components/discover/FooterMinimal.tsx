import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const FooterMinimal: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' }
    ],
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'API', href: '/api' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' }
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' }
    ]
  };

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                Family Office Platform
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              One shared workspace for families and their trusted professionals. 
              AI you can trust, receipts you can prove.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>© {currentYear}</span>
              <span>Patent-pending</span>
              <span>SOC 2 Compliant</span>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Button variant="link" asChild className="h-auto p-0 text-white/80 hover:text-white justify-start">
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Button variant="link" asChild className="h-auto p-0 text-white/80 hover:text-white justify-start">
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Button variant="link" asChild className="h-auto p-0 text-white/80 hover:text-white justify-start">
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Button variant="link" asChild className="h-auto p-0 text-white/80 hover:text-white justify-start">
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <div className="flex items-center gap-4">
            <span>Built with security and compliance first</span>
            <span>•</span>
            <span>Zero-knowledge privacy</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="link" asChild className="h-auto p-0 text-white/60 hover:text-white">
              <a href="/accessibility">Accessibility</a>
            </Button>
            <Button variant="link" asChild className="h-auto p-0 text-white/60 hover:text-white">
              <a href="/sitemap">Sitemap</a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};