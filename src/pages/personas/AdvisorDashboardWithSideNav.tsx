import PersonaSideNav from '@/components/persona/PersonaSideNav'

export default function AdvisorDashboard() {
  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <PersonaSideNav />
        <main className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-bfo-gold">Financial Advisor Dashboard</h1>
            <p className="text-white/80">Your professional dashboard with tools and client management.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-4">
              <h3 className="text-bfo-gold text-sm uppercase tracking-wider mb-2">Active Clients</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-4">
              <h3 className="text-bfo-gold text-sm uppercase tracking-wider mb-2">This Month AUM</h3>
              <p className="text-2xl font-bold">$12.4M</p>
            </div>
            <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-4">
              <h3 className="text-bfo-gold text-sm uppercase tracking-wider mb-2">Tasks Pending</h3>
              <p className="text-2xl font-bold">7</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-bfo-gold/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bfo-gold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span>Client meeting scheduled with Johnson Family</span>
                <span className="text-sm text-white/60">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span>Portfolio review completed for Smith Trust</span>
                <span className="text-sm text-white/60">5 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Retirement plan updated for Davis couple</span>
                <span className="text-sm text-white/60">1 day ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}