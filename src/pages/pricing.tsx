import { Helmet } from 'react-helmet-async';
import PricingTableSite from '@/components/pricing/PricingTableSite';

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing — Family Office Platform</title>
        <meta
          name="description"
          content="Family office pricing plans for wealth management, financial planning, and estate organization."
        />
        <meta name="keywords" content="pricing, family office, wealth management, financial planning" />
        <meta property="og:title" content="Pricing — Family Office Platform" />
        <meta
          property="og:description"
          content="Family office pricing plans for wealth management, financial planning, and estate organization."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/pricing" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 text-center bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your family's wealth management journey, from getting organized to advanced planning.
            </p>
          </div>
        </section>

        {/* Family Plans */}
        <PricingTableSite />

        {/* Coming Soon Sections */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              More Plans Coming Soon
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-background/50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Advisor Plans</h3>
                <p className="text-muted-foreground">
                  Professional tools for financial advisors and wealth managers.
                </p>
              </div>
              <div className="bg-background/50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Enterprise (RIA)</h3>
                <p className="text-muted-foreground">
                  Enterprise solutions for registered investment advisory firms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}