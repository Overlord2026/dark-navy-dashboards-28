/**
 * Demo page to showcase PersonaCard examples
 */

import React from 'react';
import PersonaCard from '@/components/ui/PersonaCard';

export function PersonaCardDemo() {
  return (
    <div className="min-h-screen bg-[#0B0F14] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Persona Card Examples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your exact example */}
          <PersonaCard
            title="Reg BI Tracker"
            features={['Monitors advice fairness', 'Auto-logs interactions', 'Flags conflicts']}
            tagline="Stay compliant, save hours"
            color="#001F3F"
            icon="⚖️"
          />

          {/* Same with persona auto-mapping */}
          <PersonaCard
            title="Reg BI Tracker"
            persona="advisor" // Auto-applies sky blue + SEC badge
            features={['Monitors advice fairness', 'Auto-logs interactions', 'Flags conflicts']}
            tagline="Stay compliant, save hours"
            icon="⚖️"
          />

          {/* Insurance example */}
          <PersonaCard
            title="10-Year Records Vault"
            persona="insurance"
            features={['NAIC-compliant storage', 'Automated retention', 'Audit-ready exports']}
            tagline="Secure. Compliant. Accessible."
            icon="📋"
          />

          {/* Attorney example */}
          <PersonaCard
            title="Ethics Compliance Hub"
            persona="attorney"
            features={['Bar rule monitoring', 'Conflict checking', 'Trust reconciliation']}
            tagline="Ethical practice, simplified"
            icon="⚖️"
          />

          {/* Healthcare example */}
          <PersonaCard
            title="HIPAA Compliance Center"
            persona="healthcare"
            features={['Privacy assessments', 'Breach notifications', 'Staff training tracker']}
            tagline="Protect patient privacy"
            icon="🏥"
          />

        </div>

        {/* Usage examples */}
        <div className="mt-12 bg-[#2E3A4A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Usage Examples</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-[#0B0F14] p-4 rounded border border-[#D4AF37]">
              <p className="text-[#D4AF37] mb-2 font-mono">// Your exact example:</p>
              <pre className="text-white font-mono">
{`<PersonaCard
  title="Reg BI Tracker"
  features={['Monitors advice fairness', 'Auto-logs interactions', 'Flags conflicts']}
  tagline="Stay compliant, save hours"
  color="#001F3F"
  icon="⚖️"
/>`}
              </pre>
            </div>
            
            <div className="bg-[#0B0F14] p-4 rounded border border-[#6BA6FF]">
              <p className="text-[#6BA6FF] mb-2 font-mono">// With persona auto-mapping:</p>
              <pre className="text-white font-mono">
{`<PersonaCard
  title="Reg BI Tracker"
  persona="advisor"  // Auto-applies #6BA6FF + SEC badge
  features={['Monitors advice fairness', 'Auto-logs interactions', 'Flags conflicts']}
  tagline="Stay compliant, save hours"
  icon="⚖️"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}