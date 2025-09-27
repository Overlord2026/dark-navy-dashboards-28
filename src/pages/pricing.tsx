import { Helmet } from 'react-helmet-async';
import PricingTable from '@/components/pricing/PricingTable';
import pricingContent from '@/content/pricing_content.json';

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>{pricingContent.meta.title}</title>
        <meta
          name="description"
          content={pricingContent.meta.description}
        />
        <meta name="keywords" content="pricing, family office, advisor, RIA, legacy planning, SWAG" />
        <meta property="og:title" content={pricingContent.meta.title} />
        <meta
          property="og:description"
          content={pricingContent.meta.description}
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
        <PricingTable />

        {/* Advisor Solo - Placeholder */}
        <section className="py-16 bg-muted/30" id="advisor">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {pricingContent.advisor.headline}
            </h2>
            <p className="text-muted-foreground mb-8">
              {pricingContent.advisor.subhead}
            </p>
            <div className="bg-background/50 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                Advisor pricing coming soon. Contact us for early access.
              </p>
            </div>
          </div>
        </section>

        {/* RIA Teams - Placeholder */}
        <section className="py-16" id="ria">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {pricingContent.ria.headline}
            </h2>
            <p className="text-muted-foreground mb-8">
              {pricingContent.ria.subhead}
            </p>
            <div className="bg-muted/30 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                RIA pricing coming soon. Contact us for enterprise solutions.
              </p>
            </div>
          </div>
        </section>

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