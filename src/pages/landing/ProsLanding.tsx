import { Link } from 'react-router-dom';

export default function ProsLanding() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Service Professionals</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Choose your professional focus and access specialized tools, workflows, and compliance features.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Financial Advisors" to="/pros/advisors" />
        <Card title="Accountants" to="/pros/accountants" />
        <Card title="Attorneys" to="/pros/attorneys" />
        <Card title="Insurance (Life/Annuity)" to="/pros/insurance/life" />
        <Card title="Insurance (P&C/Medicare/LTC)" to="/pros/insurance/other" />
      </div>
    </div>
  );
}

function Card({ title, to }: { title: string; to: string }) {
  return (
    <Link to={to} className="block rounded-2xl border border-bfo-gold p-6 hover:bg-white/5">
      <h2 className="text-xl mb-2">{title}</h2>
      <span className="text-bfo-gold">Start workspace →</span>
    </Link>
  );
}