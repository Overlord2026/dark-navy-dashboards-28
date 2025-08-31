import { Link } from 'react-router-dom';

export default function HealthcareLanding() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Healthcare</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Access healthcare tools and provider dashboards with privacy-first data management.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/health/tools" className="block rounded-2xl border border-bfo-gold p-8 hover:bg-white/5">
          <h2 className="text-2xl mb-4">Health Tools</h2>
          <p className="mb-4 opacity-70">Personal health tracking, FHIR integration, and wellness planning</p>
          <span className="text-bfo-gold">Access Tools →</span>
        </Link>
        
        <Link to="/health/providers" className="block rounded-2xl border border-bfo-gold p-8 hover:bg-white/5">
          <h2 className="text-2xl mb-4">Provider Dashboard</h2>
          <p className="mb-4 opacity-70">Clinical workflows, patient management, and compliance tools</p>
          <span className="text-bfo-gold">Access Dashboard →</span>
        </Link>
      </div>
    </div>
  );
}