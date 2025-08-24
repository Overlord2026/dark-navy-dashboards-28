import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { LeadCaptureModal } from '@/features/pro/lead/LeadCaptureModal';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { ProPersona } from '@/features/pro/types';

interface ProLeadsPageProps {
  persona: ProPersona;
}

export function ProLeadsPage({ persona }: ProLeadsPageProps) {
  const [showCapture, setShowCapture] = useState(false);
  const [leads] = useState(() => LeadModel.getByPersona(persona));

  const handleExport = () => {
    const csv = LeadModel.exportCSV(persona);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${persona}_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowCapture(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Capture Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['new', 'contacted', 'qualified', 'converted'].map(status => (
          <div key={status} className="p-4 border rounded-lg">
            <h3 className="font-medium capitalize">{status}</h3>
            <p className="text-2xl font-bold">
              {leads.filter(l => l.status === status).length}
            </p>
          </div>
        ))}
      </div>

      <LeadCaptureModal 
        open={showCapture}
        onOpenChange={setShowCapture}
        persona={persona}
      />
    </div>
  );
}