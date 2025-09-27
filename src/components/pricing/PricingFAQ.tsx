import data from "@/content/pricing_content.json";

export default function PricingFAQ() {
  const items = data.faq || [];
  const notes = data.footnotes || [];

  return (
    <section id="faq" className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">Frequently asked</h2>
          <p className="mt-2 text-white/70">Short answers to help you decide.</p>
        </header>

        <div className="mx-auto max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          {items.map((it, idx) => (
            <details key={idx} className="group open:bg-white/[0.04]">
              <summary className="cursor-pointer list-none px-5 py-4 font-medium">
                {it.q}
              </summary>
              <div className="px-5 pb-4 text-sm text-white/80">{it.a}</div>
            </details>
          ))}
        </div>

        {notes.length > 0 && (
          <ul className="mx-auto mt-6 max-w-3xl list-disc space-y-1 pl-6 text-xs text-white/60">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}