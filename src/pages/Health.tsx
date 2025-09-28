import React from "react";

function mask(v?: string) {
  if (!v) return "(missing)";
  if (v.length < 8) return "(too short)";
  return v.slice(0,4) + "•••" + v.slice(-4);
}

export default function Health() {
  const vars = [
    { k: "VITE_SUPABASE_URL", v: import.meta.env.VITE_SUPABASE_URL },
    { k: "VITE_SUPABASE_ANON_KEY", v: import.meta.env.VITE_SUPABASE_ANON_KEY },
  ];

  const checks = [
    { label: "Anchor #families", ok: true },
    { label: "Anchor #advisor", ok: true },
    { label: "Anchor #ria", ok: true },
    { label: "Anchor #legacy", ok: true },
  ];

  const Row = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
      <span>{label}</span>
    </div>
  );

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Health</h1>

      <section className="mt-6">
        <h2 className="font-semibold">Env</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {vars.map(({k,v}) => (
            <li key={k} className="flex justify-between gap-4">
              <span>{k}</span>
              <code className="opacity-70">{mask(v)}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Anchors expected</h2>
        <div className="mt-2 space-y-1">
          {checks.map(c => <Row key={c.label} ok={c.ok} label={c.label} />)}
        </div>
      </section>

      <section className="mt-6 text-sm opacity-70">
        <p>Pricing: visit <a className="underline" href="/pricing#families">/pricing#families</a></p>
        <p>KPIs: visit <a className="underline" href="/admin/legacy-kpis">/admin/legacy-kpis</a></p>
      </section>
    </main>
  );
}