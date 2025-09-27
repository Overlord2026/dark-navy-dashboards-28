import { Helmet } from 'react-helmet-async';
import FamilyPlans from '@/components/pricing/FamilyPlans';
import AdvisorSolo from '@/components/pricing/AdvisorSolo';
import RiaTeams from '@/components/pricing/RiaTeams';
import LegacyAddOn from '@/components/pricing/LegacyAddOn';

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing — AI you can trust</title>
        <meta
          name="description"
          content="Family, Advisor, and RIA plans with SWAG™ Legacy Planning add-on."
        />
        <meta name="keywords" content="pricing, family office, advisor, RIA, legacy planning, SWAG" />
        <meta property="og:title" content="Pricing — AI you can trust" />
        <meta
          property="og:description"
          content="Family, Advisor, and RIA plans with SWAG™ Legacy Planning add-on."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/pricing" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 text-center bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Transparent Pricing for Every Need
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From families just starting their wealth journey to established RIAs managing billions, 
              we have plans that scale with your success.
            </p>
          </div>
        </section>

        {/* Family Plans */}
        <FamilyPlans />

        {/* Advisor Solo */}
        <AdvisorSolo />

        {/* RIA Teams */}
        <RiaTeams />

        {/* SWAG™ Legacy Planning Add-on */}
        <LegacyAddOn />

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Questions About Pricing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our pricing is designed to be transparent and scalable. All plans include our core platform 
              with different feature sets and support levels to match your needs.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Contact Sales
              </button>
              <button className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/50 transition-colors">
                View FAQ
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}