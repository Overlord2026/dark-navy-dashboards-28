import data from "@/content/pricing_content.json";
import { Link } from "react-router-dom";

export default function RiaSeatTable() {
  const { headline, subhead, cta, platform_minimum, seat_tiers, annual_discount, included, addons } = data.ria;

  return (
    <section id="ria" className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">{headline}</h2>
          <p className="mt-2 text-white/70">{subhead}</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Platform Minimum */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-bfo-gold mb-2">Platform Minimum</h3>
              <p className="text-lg">{platform_minimum}</p>
              <p className="text-sm text-white/70 mt-2">{annual_discount}</p>
            </div>
          </div>

          {/* Seat Tiers Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="bg-bfo-gold/10 px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold">Additional Seats</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {seat_tiers.map((tier) => (
                  <div key={tier.range} className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
                    <span className="text-lg">{tier.range}</span>
                    <span className="text-xl font-bold text-bfo-gold">{tier.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Included Features */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Included Features</h3>
              <ul className="space-y-3">
                {included.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-bfo-gold flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add-ons */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Available Add-ons</h3>
              <ul className="space-y-3">
                {addons.map((addon) => (
                  <li key={addon} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40 flex-shrink-0" />
                    <span className="text-sm text-white/70">{addon}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to={cta.href}
              className="inline-flex items-center justify-center px-8 py-3 bg-bfo-gold text-bfo-black font-medium rounded-lg hover:bg-bfo-gold/90 transition-colors"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}