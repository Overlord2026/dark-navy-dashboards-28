import data from "@/content/pricing_content.json";
import { Link } from "react-router-dom";

export default function RiaSeatTable() {
  const s = data.ria;

  return (
    <section id="ria" className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">{s.headline}</h2>
          <p className="mt-2 text-white/70">{s.subhead}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pricing table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Seat-based pricing</h3>
            <p className="mt-1 text-sm text-white/70">{s.platform_minimum}</p>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Seats</th>
                    <th className="px-4 py-2 text-left font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {s.seat_tiers.map((row) => (
                    <tr key={row.range} className="odd:bg-white/0 even:bg-white/[0.03]">
                      <td className="px-4 py-2">{row.range}</td>
                      <td className="px-4 py-2">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-white/70">{s.annual_discount}</p>

            <Link
              to={s.cta.href}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-bfo-gold px-4 py-2 font-medium text-bfo-black hover:bg-bfo-gold/90"
            >
              {s.cta.label}
            </Link>
          </div>

          {/* What's included / Add-ons */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">What's included</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {s.included.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-bfo-gold" />
                  {i}
                </li>
              ))}
            </ul>

            <h4 className="mt-6 text-sm font-semibold opacity-80">Add-ons</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {s.addons.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-bfo-gold" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}