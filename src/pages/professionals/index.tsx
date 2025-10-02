import HeaderSpacer from "@/components/layout/HeaderSpacer";

export default function ProfessionalsHub() {
  return (
    <div className="container mx-auto px-4 py-10 text-bfo-ivory space-y-8">
      <HeaderSpacer />
      <header className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-semibold">For Professionals</h1>
        <p className="text-white/70 max-w-3xl">
          Work with families in a secure, compliant workspace—model scenarios, exchange documents, and keep a clean trail.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <a href="/professionals/financial-advisors" className="rounded-xl border border-white/15 p-5 hover:bg-white/5 transition">
          <h3 className="font-semibold mb-2">Financial Advisors</h3>
          <p className="text-white/70">Scenario runs with guardrails, artifacts clients understand, fewer email chases.</p>
          <span className="inline-block mt-3 underline">Explore →</span>
        </a>

        <a href="/professionals/accountants" className="rounded-xl border border-white/15 p-5 hover:bg-white/5 transition">
          <h3 className="font-semibold mb-2">Accountants (CPAs)</h3>
          <p className="text-white/70">Organized requests, receipts, and retirement outputs that tie back to tax estimates.</p>
          <span className="inline-block mt-3 underline">Explore →</span>
        </a>

        <a href="/professionals/attorneys" className="rounded-xl border border-white/15 p-5 hover:bg-white/5 transition">
          <h3 className="font-semibold mb-2">Attorneys</h3>
          <p className="text-white/70">Estate & entity work with jurisdiction checks and a traceable review trail.</p>
          <span className="inline-block mt-3 underline">Explore →</span>
        </a>
      </section>
    </div>
  );
}
