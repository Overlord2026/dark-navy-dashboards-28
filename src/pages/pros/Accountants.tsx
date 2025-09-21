import PersonaSideNav from '@/components/persona/PersonaSideNav';
import { hasAcceptedPersona } from '@/lib/invites';

export default function Accountants() {
  const canEnter = hasAcceptedPersona('accountant');
  
  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <PersonaSideNav />
        <main className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-bfo-gold">Accountant Dashboard</h1>
            <p className="text-white/80">Tax & accounting practice management tools.</p>
          </div>
          <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-white/70">Accountant practice management tools are in development.</p>
          </div>
          
          {canEnter ? (
            <a href="/accountant-dashboard" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold hover:bg-bfo-gold hover:text-bfo-black transition">
              Go to Accountant Dashboard
            </a>
          ) : (
            <a href="/pros/accountants/access" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold/80 hover:bg-white/5 transition">
              Accept your invite to continue
            </a>
          )}
        </main>
      </div>
    </div>
  );
}