import React from 'react';

export default function MarketplaceIndex() {
  return (
    <section className="px-6 md:px-10 py-16 text-white">
      <div className="max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Elite wealth solutions with <span className="text-[var(--bfo-gold)]">Family Office Marketplace</span>
        </h1>
        <p className="mt-6 text-gray-300 max-w-3xl">
          Connect with premier financial advisors tailored to your family's unique needs. Build wealth, protect assets, and secure your legacy with military-grade security.
        </p>
        <div className="mt-8 flex gap-3">
          <a href="/marketplace/advisors" className="px-4 py-2 border border-[var(--bfo-gold)] text-[var(--bfo-gold)] rounded hover:bg-[var(--bfo-gold)] hover:text-black">
            Find an Advisor
          </a>
          <a href="/solutions" className="px-4 py-2 border border-gray-600 text-gray-200 rounded hover:bg-[#152234]">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}