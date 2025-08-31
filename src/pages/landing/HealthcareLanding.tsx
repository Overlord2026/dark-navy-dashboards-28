import { Link } from 'react-router-dom';

export default function HealthcareLanding() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Healthcare</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Healthspan tools, HSA+, screening navigator, and consent vaults—all orchestrated with
        policy gates and receipts.
      </p>
      <div className="flex gap-4 flex-wrap">
        <CTA to="/health/tools" label="Open Health Tools" />
        <CTA to="/pros/health" label="Provider Dashboard" outline />
      </div>
    </div>
  );
}

function CTA({ to, label, outline = false }: { to: string; label: string; outline?: boolean }) {
  const cls = outline
    ? 'rounded-xl border border-bfo-gold px-5 py-3 text-bfo-gold hover:bg-white/5'
    : 'rounded-xl bg-bfo-gold px-5 py-3 text-bfo-black hover:opacity-90';
  return <Link to={to} className={cls}>{label}</Link>;
}