import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Scale, Shield } from 'lucide-react';
import { GoldButton } from '@/components/ui/brandButtons';
import SecondaryNav from '@/components/layout/SecondaryNav';

export default function MarketplaceIndex() {
  const navigate = useNavigate();

  return (
    <>
      <SecondaryNav />
      <div className="min-h-screen bg-bfo-black" style={{ paddingTop: '120px' }}>
        <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Elite wealth solutions with <span className="text-bfo-gold">Family Office Marketplace</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto">
            Connect with premier financial professionals tailored to your family's unique needs. 
            Build wealth, protect assets, and secure your legacy with military-grade security.
          </p>
        </div>

        {/* Professional Categories */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Financial Advisors */}
            <div className="text-center">
              <div className="w-16 h-16 bg-bfo-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-bfo-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Financial Advisors</h2>
              <p className="text-white/80 mb-6">
                Find certified financial advisors to help with investment planning, retirement strategies, and wealth management.
              </p>
              <GoldButton onClick={() => navigate('/marketplace/advisors')}>
                Browse Advisors
              </GoldButton>
            </div>

            {/* Attorneys */}
            <div className="text-center">
              <div className="w-16 h-16 bg-bfo-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-bfo-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Attorneys</h2>
              <p className="text-white/80 mb-6">
                Connect with qualified attorneys specializing in estate planning, tax law, and financial litigation.
              </p>
              <GoldButton onClick={() => navigate('/marketplace/attorneys')}>
                Browse Attorneys
              </GoldButton>
            </div>

            {/* Insurance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-bfo-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-bfo-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Insurance</h2>
              <p className="text-white/80 mb-6">
                Connect with licensed insurance professionals for P&C, life insurance, annuities, and Medicare coverage.
              </p>
              <GoldButton onClick={() => navigate('/marketplace/insurance')}>
                Browse Insurance
              </GoldButton>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoldButton onClick={() => navigate('/marketplace/advisors')}>
              Find a Financial Advisor
            </GoldButton>
            <GoldButton onClick={() => navigate('/marketplace/attorneys')}>
              Find an Estate Attorney
            </GoldButton>
            <GoldButton onClick={() => navigate('/marketplace/insurance')}>
              Get Insurance Quotes
            </GoldButton>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}