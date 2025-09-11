import { Link } from "react-router-dom";
import { PROS, FAMILIES } from "@/config/personas";

export default function ProsHub() {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Service Professionals</h1>
        <p className="text-muted-foreground">Pick your role to see tailored tools, onboarding, and quick links.</p>
      </header>

      <section aria-labelledby="pros" className="mb-10">
        <h2 id="pros" className="sr-only">Professionals</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROS.map(p => (
            <li key={p.key} className="border rounded-lg hover:shadow-sm bg-card">
              <Link to={p.to} className="block p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg">
                <div className="text-lg font-medium">{p.label}</div>
                <p className="text-sm text-muted-foreground mt-1">{p.blurb}</p>
                <div className="mt-3 text-sm text-primary">Where to start →</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="families" className="border-t pt-6">
        <h2 id="families" className="text-lg font-medium mb-3">Families</h2>
        <div className="flex flex-wrap gap-3">
          {FAMILIES.map(f => (
            <Link key={f.key} to={f.to} className="px-3 py-2 border rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20">
              {f.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}