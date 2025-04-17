
import React from 'react';
import { EducationTabsManager } from './EducationTabsManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AdminEducationTabsProps {
  tabs: Array<{ id: string; label: string; value: string; }>;
  onUpdateTabs: (tabs: Array<{ id: string; label: string; value: string; }>) => void;
}

export function AdminEducationTabs({ tabs, onUpdateTabs }: AdminEducationTabsProps) {
  const handleExitAdmin = () => {
    toast.info("Exiting admin mode");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Admin Education Management</h2>
        </div>
        <Button variant="outline" onClick={handleExitAdmin}>
          Exit Admin Mode
        </Button>
      </div>
      
      <Card className="p-6 bg-slate-900">
        <div className="space-y-6">
          <EducationTabsManager tabs={tabs} onUpdateTabs={onUpdateTabs} />
        </div>
      </Card>
    </div>
  );
}
