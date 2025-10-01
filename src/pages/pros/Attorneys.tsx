import PersonaSideNav from '@/components/persona/PersonaSideNav';
import { hasAcceptedPersona } from '@/lib/invites';

export default function Attorneys() {
  const canEnter = hasAcceptedPersona('attorney');
  
  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <PersonaSideNav />
        <main className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-bfo-gold">For Attorneys</h1>
            <p className="text-white/80">Legal practice management and client services.</p>
          </div>
          
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Case Management</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Manage cases, track deadlines, and organize legal documents
              </p>
              <a 
                href="/attorney-dashboard" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                Access Dashboard →
              </a>
            </div>

            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">📜</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Estate Planning</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                SWAG™ Legacy Planning tool for comprehensive estate analysis
              </p>
              <a 
                href="/tools/estate-planning" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                Launch Tool →
              </a>
            </div>

            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-bfo-gold/20">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-lg font-semibold text-bfo-gold">Compliance</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Track compliance requirements and litigation deadlines
              </p>
              <a 
                href="/attorney-dashboard" 
                className="text-bfo-gold hover:text-white text-sm font-medium"
              >
                View Compliance →
              </a>
            </div>
          </div>

          {/* Professional Collaboration */}
          <div className="bg-gradient-to-r from-bfo-gold/10 to-white/5 border border-bfo-gold/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-bfo-gold mb-4">Family Office Integration</h3>
            <p className="text-white/80 mb-4">
              Collaborate directly with families, advisors, and other professionals in unified workflows
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Estate Planning Collaboration:</h4>
                <ul className="text-white/70 space-y-1">
                  <li>• Review family SWAG™ analyses</li>
                  <li>• Draft estate documents</li>
                  <li>• Coordinate with tax professionals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Professional Network:</h4>
                <ul className="text-white/70 space-y-1">
                  <li>• Accept family team invitations</li>
                  <li>• Streamlined document sharing</li>
                  <li>• Automated workflow handoffs</li>
                </ul>
              </div>
            </div>
          </div>
          
          {canEnter ? (
            <a href="/attorney-dashboard" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold hover:bg-bfo-gold hover:text-bfo-black transition">
              Go to Attorney Dashboard
            </a>
          ) : (
            <a href="/pros/attorneys/access" className="inline-flex items-center gap-2 mt-6 rounded-lg border border-bfo-gold/30 px-4 py-2 text-bfo-gold/80 hover:bg-white/5 transition">
              Accept your invite to continue
            </a>
          )}
        </main>
      </div>
    </div>
  )
}