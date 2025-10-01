import PersonaSideNav from '@/components/persona/PersonaSideNav';
import { hasAcceptedPersona } from '@/lib/invites';
import { Link } from 'react-router-dom';

export default function Accountants() {
  const canEnter = hasAcceptedPersona('accountant');
  
  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <PersonaSideNav />
        <main className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-bfo-gold">For Accountants</h1>
            <p className="text-white/80">Tax & accounting practice management tools.</p>
          </div>
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Client Management</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Manage your accounting clients, track engagements, and organize documents
              </p>
              <Link 
                to="/accountant-dashboard" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                Access Dashboard →
              </Link>
            </div>

            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Tax Tools</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Advanced tax planning, return preparation, and optimization tools
              </p>
              <Link 
                to="/tools/tax-planning" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                Explore Tools →
              </Link>
            </div>

            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Practice Analytics</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Track performance, monitor compliance, and grow your practice
              </p>
              <Link 
                to="/accountant-dashboard" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                View Analytics →
              </Link>
            </div>
          </div>

          {/* Professional Collaboration */}
          <div className="bg-gradient-to-r from-bfo-gold/10 to-white/5 border border-bfo-gold/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-bfo-gold mb-4">Multi-Professional Collaboration</h3>
            <p className="text-white/80 mb-4">
              Coordinate with advisors, attorneys, and other professionals for comprehensive client service
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Accept Family Invitations:</h4>
                <ul className="text-white/70 space-y-1">
                  <li>• Join client family teams</li>
                  <li>• Collaborate on estate planning</li>
                  <li>• Share tax strategies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Professional Network:</h4>
                <ul className="text-white/70 space-y-1">
                  <li>• Connect with estate attorneys</li>
                  <li>• Coordinate with financial advisors</li>
                  <li>• Streamlined referral process</li>
                </ul>
              </div>
            </div>
          </div>
          
          {canEnter ? (
            <Link to="/accountant-dashboard" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold hover:bg-bfo-gold hover:text-bfo-black transition">
              Go to Accountant Dashboard
            </Link>
          ) : (
            <Link to="/pros/accountants/access" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold/80 hover:bg-white/5 transition">
              Accept your invite to continue
            </Link>
          )}
        </main>
      </div>
    </div>
  );
}