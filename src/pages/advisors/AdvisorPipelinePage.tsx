import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  ArrowRight, 
  Download,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emitReceipt } from '@/lib/analytics';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface Prospect {
  id: string;
  name: string;
  email: string;
  stage: string;
  value: number;
  lastContact: string;
  daysInStage: number;
}

const stages: PipelineStage[] = [
  { id: 'lead', name: 'New Lead', color: 'bg-blue-100 text-blue-800', count: 8 },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800', count: 12 },
  { id: 'meeting', name: 'Meeting Scheduled', color: 'bg-purple-100 text-purple-800', count: 6 },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-orange-100 text-orange-800', count: 4 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-red-100 text-red-800', count: 3 },
  { id: 'closed', name: 'Closed Won', color: 'bg-green-100 text-green-800', count: 5 }
];

export function AdvisorPipelinePage() {
  const { toast } = useToast();
  const [selectedStage, setSelectedStage] = useState<string>('lead');

  const [prospects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      stage: 'lead',
      value: 250000,
      lastContact: '2024-01-15',
      daysInStage: 2
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      stage: 'contacted',
      value: 180000,
      lastContact: '2024-01-14',
      daysInStage: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      stage: 'meeting',
      value: 320000,
      lastContact: '2024-01-13',
      daysInStage: 3
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@example.com',
      stage: 'proposal',
      value: 450000,
      lastContact: '2024-01-12',
      daysInStage: 7
    }
  ];

  const handleStageChange = async (prospectId: string, newStage: string, reasons: string[] = []) => {
    try {
      const prospect = prospects.find(p => p.id === prospectId);
      if (!prospect) return;

      await emitReceipt('Decision-RDS', {
        action: 'pipeline.stage_change',
        prospectId,
        prospectName: prospect.name,
        fromStage: prospect.stage,
        toStage: newStage,
        reasonCodes: reasons.length > 0 ? reasons : ['stage_progression'],
        prospectValue: prospect.value
      });

      toast({
        title: "Stage Updated",
        description: `${prospect.name} moved to ${stages.find(s => s.id === newStage)?.name}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive"
      });
    }
  };

  const handleExportPipeline = () => {
    const csvData = prospects.map(prospect => ({
      Name: prospect.name,
      Email: prospect.email,
      Stage: stages.find(s => s.id === prospect.stage)?.name || prospect.stage,
      'Potential Value': `$${prospect.value.toLocaleString()}`,
      'Last Contact': prospect.lastContact,
      'Days in Stage': prospect.daysInStage
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advisor-pipeline.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Pipeline data exported to CSV successfully"
    });
  };

  const filteredProspects = prospects.filter(p => p.stage === selectedStage);
  const totalPipelineValue = prospects.reduce((sum, p) => sum + p.value, 0);
  const averageDealSize = prospects.length > 0 ? totalPipelineValue / prospects.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track prospects through your sales process</p>
        </div>
        <Button variant="outline" onClick={handleExportPipeline}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Prospects</p>
                <p className="text-2xl font-bold">{prospects.length}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">${averageDealSize.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">22%</p>
              </div>
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 mb-6">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStage === stage.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium text-sm mb-1">{stage.name}</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stage.count}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Stage Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">
              {stages.find(s => s.id === selectedStage)?.name} ({filteredProspects.length})
            </h3>
            
            {filteredProspects.map((prospect) => (
              <div key={prospect.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <h4 className="font-medium">{prospect.name}</h4>
                    <p className="text-sm text-muted-foreground">{prospect.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${prospect.value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Potential AUM</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {prospect.lastContact}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {prospect.daysInStage} days in stage
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedStage !== 'closed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const nextStageIndex = stages.findIndex(s => s.id === selectedStage) + 1;
                        if (nextStageIndex < stages.length) {
                          handleStageChange(prospect.id, stages[nextStageIndex].id, ['qualified']);
                        }
                      }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Advance
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            ))}

            {filteredProspects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No prospects in this stage
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}