import { HealthHeader } from '@/components/healthcare/HealthHeader';
import { HSAPlannerCard } from '@/components/healthcare/HSAPlannerCard';
import { EnhancedScreeningNavigator } from '@/components/healthcare/EnhancedScreeningNavigator';
import { ConsentPassport } from '@/components/healthcare/ConsentPassport';
import { VaultEvidencePack } from '@/components/healthcare/VaultEvidencePack';
import { HealthQADashboard } from '@/components/healthcare/HealthQADashboard';

export default function HealthDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <HealthHeader />
      
      {/* Main content with top padding to account for fixed header */}
      <div className="pt-20 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Healthcare Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive health management with RDS-based compliance and audit trails
            </p>
          </div>

          {/* H1 - HSA+ Planner */}
          <section id="hsa-planner">
            <HSAPlannerCard />
          </section>

          {/* H2 - Enhanced Screening & Prevention with ZKP */}
          <section id="screening-navigator">
            <EnhancedScreeningNavigator />
          </section>

          {/* H3 - Consent Passport */}
          <section id="consent-passport">
            <ConsentPassport />
          </section>

          {/* H4 - Vault Evidence Pack */}
          <section id="vault-evidence-pack">
            <VaultEvidencePack />
          </section>

          {/* H5 - Health QA/Performance */}
          <section id="health-qa-dashboard">
            <HealthQADashboard />
          </section>
        </div>
      </div>
    </div>
  );
}