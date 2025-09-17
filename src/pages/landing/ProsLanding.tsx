import { Link } from 'react-router-dom';
import RunAdvisorDemo from '@/components/demos/RunAdvisorDemo';
import { Button } from '@/components/ui/button';

export default function ProsLanding() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Service Professionals</h1>
      <p className="mb-6 max-w-2xl text-lg opacity-80">
        Choose your practice area to load a demo dashboard with tools and automations.
      </p>
      <div className="flex gap-3 mb-8 flex-wrap">
        <RunAdvisorDemo />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Tile label="Financial Advisors" to="/pros/advisors" />
        <Tile label="Accountants (CPA/EA)" to="/pros/accountants" />
        <Tile label="Attorneys" to="/pros/attorneys" />
        <Tile label="Insurance (Life/Annuity)" to="/pros/insurance/life" />
        <Tile label="Insurance (P&C/Medicare/LTC)" to="/pros/insurance/other" />
        <Tile label="Healthcare Providers" to="/health" />
      </div>
    </div>
  );
}

function Tile({ label, to }: { label: string; to: string }) {
  return (
    <Link to={to} className="block rounded-2xl border border-bfo-gold p-6 hover:bg-white/5">
      <span className="text-xl">{label}</span>
      <div className="text-bfo-gold mt-2">Open dashboard →</div>
    </Link>
  );
}