import { Link } from "react-router-dom";

type Plan = {
  key: "free" | "premium" | "pro";
  name: string;
  price: string;
  tagline: string;
  features: string[];
  ctaText: string;
  to: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Basic",
    price: "Free",
    tagline: "Learn, plan, and organize — no integrations required.",
    features: [
      "Catalog & Guides",
      "Education Center (courses)",
      "Vault uploads (quota)",
      "Templates & Checklists",
      "Pros directory",
      "Manual Goals & Budget",
      "Demo views for data features",
    ],
    ctaText: "Start Free",
    to: "/signup?plan=free",
  },
  {
    key: "premium",
    name: "Premium",
    price: "$29/mo",
    tagline: "Unlock advanced tools and limited data connections.",
    features: [
      "Wealth Wall & Reports",
      "Retirement Roadmap",
      "Goals & Budget (enhanced)",
      "Limited account connections",
      "Higher Vault storage",
      "Education Center (all courses)",
    ],
    ctaText: "Choose Premium",
    to: "/pricing/checkout?plan=premium",
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$59/mo",
    tagline: "Full planning suite and collaboration features.",
    features: [
      "All Premium features",
      "Tax Planner (advanced)",
      "Estate Organizer (advanced)",
      "Expanded connections & exports",
      "Share with spouse/pro",
      "Priority support",
    ],
    ctaText: "Choose Pro",
    to: "/pricing/checkout?plan=pro",
  },
];

export default function PricingTable() {
  return (
    <section className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">Pricing</h2>
          <p className="mt-2 text-white/70">Start free. Upgrade anytime for connected data and advanced planning tools.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`rounded-2xl border p-6 ${
                p.highlight
                  ? "border-bfo-gold/40 bg-bfo-gold/5 shadow-[0_0_0_2px_rgba(212,175,55,0.08)]"
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-bfo-gold"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={p.to}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium ${
                  p.highlight
                    ? "bg-bfo-gold text-bfo-black hover:bg-bfo-gold/90"
                    : "border border-white/15 hover:bg-white/5"
                }`}
              >
                {p.ctaText}
              </Link>

              {p.key === "free" && (
                <p className="mt-3 text-xs text-white/60">
                  Free focuses on education, organization, and self-service tools. Premium adds connected data and advanced planning.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}