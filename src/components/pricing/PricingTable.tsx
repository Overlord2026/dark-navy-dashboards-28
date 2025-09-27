import React from "react";
import content from "@/content/pricing_content.json";

type Plan = {
  key: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
};

export default function PricingTable() {
  const plans = content.families.plans as Plan[];

  return (
    <section id="families" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl font-bold text-foreground text-center mb-4">
        Family Plans
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        Choose the plan that fits your family's wealth management needs
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md ${
              plan.highlight 
                ? "border-primary shadow-lg ring-2 ring-primary/20" 
                : "border-border"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.tagline}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                plan.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}