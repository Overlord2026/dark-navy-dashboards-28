import React from 'react';
import { Link } from 'react-router-dom';
import HeaderSpacer from '@/components/layout/HeaderSpacer';

export function HomePage() {
  return (
    <>
      <HeaderSpacer />
      <main className="container mx-auto px-4 py-12 space-y-12 text-bfo-ivory">
      
      <section className="text-center space-y-6">
        <h1 className="text-3xl lg:text-4xl font-semibold">
          Your Boutique Family Office—one secure place for families and professionals to work together.
        </h1>
        <p className="text-bfo-ivory/80 max-w-3xl mx-auto text-lg">
          We bring your financial picture, your documents, and your trusted team into a single, compliant workspace—so decisions get made and life keeps moving.
        </p>
        <p className="text-bfo-ivory/70 max-w-3xl mx-auto text-base border-t border-white/10 pt-4 mt-4">
          Built for families—designed for collaboration. Advisors, CPAs, and attorneys work together in one place so you don't have to run point.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link className="btn-primary-gold min-h-[44px] px-6 py-3 text-lg font-medium rounded-lg flex items-center justify-center" to="/families">
            Get Started (Family)
          </Link>
          <Link className="rounded-lg border border-bfo-gold/30 text-bfo-ivory px-6 py-3 text-lg font-medium hover:bg-bfo-gold/10 transition-colors min-h-[44px] flex items-center justify-center" to="/pros">
            For Professionals
          </Link>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-white/15 p-5">
          <h3 className="font-semibold mb-2">Families first</h3>
          <p className="text-white/70">Accounts, goals, tasks, and documents—organized in one place, with permissions you control.</p>
        </div>
        <div className="rounded-xl border border-white/15 p-5">
          <h3 className="font-semibold mb-2">Work together, not by email</h3>
          <p className="text-white/70">Requests, uploads, signatures, and approvals—tracked with a timestamp and a receipt.</p>
        </div>
        <div className="rounded-xl border border-white/15 p-5">
          <h3 className="font-semibold mb-2">Decisions you can trust</h3>
          <p className="text-white/70">Rule-based tools with advisor oversight and plain-English outputs.</p>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/15 p-5">
          <h3 className="font-semibold mb-2">For Families</h3>
          <p className="text-white/70">Start with the essentials—accounts, goals, documents—and invite the professionals you already trust.</p>
          <a href="/families" className="inline-block mt-3 underline hover:text-bfo-gold transition-colors">
            Explore families →
          </a>
        </div>
        <div className="rounded-xl border border-white/15 p-5">
          <h3 className="font-semibold mb-2">For Professionals</h3>
          <ul className="text-white/70 list-disc pl-5 space-y-1">
            <li><strong>Financial Advisors:</strong> scenarios with guardrails, artifacts clients understand.</li>
            <li><strong>Accountants (CPAs):</strong> organized requests, receipts, and retirement outputs for tax planning.</li>
            <li><strong>Attorneys:</strong> estate/entity workflows with jurisdiction checks and review trail.</li>
          </ul>
          <a href="/professionals" className="inline-block mt-3 underline hover:text-bfo-gold transition-colors">
            See professional tools →
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-white/15 p-5">
        <h3 className="font-semibold mb-2">How it works</h3>
        <ol className="text-white/70 list-decimal pl-5 space-y-1">
          <li>Connect & organize (secure links and the Family Vault)</li>
          <li>Model & choose (retirement, tax, estate—plain-English outputs)</li>
          <li>Execute & track (tasks, signatures, ProofSlips)</li>
          <li>Review & adjust (versioned, audit-friendly)</li>
        </ol>
      </section>

    </main>
    </>
  );
}
