import data from "@/content/pricing_content.json";
import { Link } from "react-router-dom";

type Plan = typeof data.families.plans[number];

export default function PricingTableSite() {
  const plans: Plan[] = data.families.plans;

  return (
    <section id="families" className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">Pricing</h2>
          <p className="mt-2 text-white/70">
            Start free. Upgrade anytime for connected data and advanced planning.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.key}
              className={`rounded-2xl border p-6 ${
                (p as any).highlight
                  ? "border-bfo-gold/40 bg-bfo-gold/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="text-2xl font-extrabold">{p.price}</div>
              </div>

              <p className="mt-1 text-sm text-white/75">{p.tagline}</p>

              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-bfo-gold" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={p.href}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium ${
                  (p as any).highlight
                    ? "bg-bfo-gold text-bfo-black hover:bg-bfo-gold/90"
                    : "border border-white/15 hover:bg-white/10"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}