import React from "react";
import content from "@/content/pricing_content.json";

type Tier = {
  key: string;
  name: string;
  blurb?: string;
  price: { monthly: number; yearly: number | null; yearly_note?: string };
  bullets: string[];
  featured?: boolean;
};

export default function PricingTable() {
  const families = content.families;
  const tiers = families.tiers as Tier[];

  return (
    <section id="families" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        {families.headline}
      </h2>
      <p className="mt-2 text-center text-gray-600">{families.subhead}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t) => {
          const monthly =
            t.price.monthly === 0 ? "$0" : `$${t.price.monthly}`;
          const cta = (content.ctas as any)[t.key] as string;
          const badge = (content.badges as any)[t.key] as string;

          return (
            <div
              key={t.key}
              className={[
                "rounded-2xl border p-6 shadow-sm",
                t.featured ? "ring-2 ring-gray-900 shadow-md" : ""
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <span className="rounded-md border px-2 py-0.5 text-xs text-gray-700">
                  {badge}
                </span>
              </div>
              {t.blurb ? (
                <p className="mt-1 text-gray-600">{t.blurb}</p>
              ) : null}
              <div className="mt-4 text-4xl font-bold">
                {monthly}
                <span className="text-base font-medium text-gray-500">/mo</span>
              </div>
              {t.price.yearly_note ? (
                <p className="text-xs text-gray-500">{t.price.yearly_note}</p>
              ) : null}
              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                {t.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <a
                href={cta}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-white"
              >
                {t.key === "family_free"
                  ? "Create free account"
                  : t.key === "family_premium"
                  ? "Start 14-day trial"
                  : "Upgrade to Pro"}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}