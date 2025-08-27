import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Users, FileText, Anchor, Receipt } from 'lucide-react';

export default function SummaryPage() {
  // Mock data - in production this would come from API
  const stats = {
    totalPersonas: 12,
    implementedPersonas: 6,
    totalReceipts24h: 1247,
    anchorsPresent: 156,
    vaultDocuments: 8934,
    activeProfessionals: 234
  };

  const personaCoverage = [
    { persona: 'Families (Aspiring)', status: 'complete', coverage: 100 },
    { persona: 'Families (Retirees)', status: 'complete', coverage: 100 },
    { persona: 'Advisors', status: 'complete', coverage: 95 },
    { persona: 'NIL Athletes', status: 'complete', coverage: 90 },
    { persona: 'NIL Schools', status: 'complete', coverage: 90 },
    { persona: 'Attorneys (Estate)', status: 'complete', coverage: 85 },
    { persona: 'CPAs', status: 'partial', coverage: 40 },
    { persona: 'Insurance (Life)', status: 'partial', coverage: 30 },
    { persona: 'Insurance (Medicare)', status: 'partial', coverage: 30 },
    { persona: 'Healthcare Providers', status: 'partial', coverage: 25 },
    { persona: 'Healthcare Coaches', status: 'partial', coverage: 25 },
    { persona: 'Realtors', status: 'partial', coverage: 20 }
  ];

  const outputFiles = [
    { name: 'Summary_Overview.md', description: 'Executive summary of platform status', path: '/out/Summary_Overview.md' },
    { name: 'Persona_Tool_Matrix.csv', description: 'Detailed persona and tool coverage matrix', path: '/out/Persona_Tool_Matrix.csv' },
    { name: 'Receipts_Coverage.csv', description: 'Receipt type implementation analysis', path: '/out/Receipts_Coverage.csv' },
    { name: 'Anchors_Rails.csv', description: 'Trust rails implementation by area', path: '/out/Anchors_Rails.csv' },
    { name: 'Gaps_Prioritized.md', description: 'Prioritized gap analysis and roadmap', path: '/out/Gaps_Prioritized.md' },
    { name: 'Next_Actions_Checklist.md', description: 'Actionable implementation checklist', path: '/out/Next_Actions_Checklist.md' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-green-600';
    if (coverage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">BFO Ops: Platform Summary</h1>
          <p className="text-muted-foreground">Family Office Marketplace Implementation Status</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPersonas}</div>
              <p className="text-xs text-muted-foreground">
                {stats.implementedPersonas} fully implemented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipts (24h)</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReceipts24h.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Trust rail activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anchors Present</CardTitle>
              <Anchor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.anchorsPresent}</div>
              <p className="text-xs text-muted-foreground">
                Merkle root batches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vault Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vaultDocuments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Stored securely
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Professionals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProfessionals}</div>
              <p className="text-xs text-muted-foreground">
                Across all personas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Persona Coverage Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Persona Implementation Coverage</CardTitle>
            <CardDescription>
              Implementation status and completion percentage by persona
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {personaCoverage.map((persona) => (
                <div key={persona.persona} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(persona.status)}`} />
                    <span className="text-sm font-medium">{persona.persona}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getCoverageColor(persona.coverage)}`}>
                      {persona.coverage}%
                    </span>
                    <Badge variant={persona.status === 'complete' ? 'default' : 'secondary'}>
                      {persona.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Files */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Reports</CardTitle>
            <CardDescription>
              Downloadable analysis files generated from platform scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{file.name}</h4>
                    <p className="text-xs text-muted-foreground">{file.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real implementation, this would trigger file download
                        console.log(`Download ${file.path}`);
                        alert(`File download would be triggered for: ${file.name}`);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // In a real implementation, this would open the file path
                        window.open(file.path, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Platform management and monitoring tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/admin/ready-check'}>
                Run Ready Check
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/qa-coverage'}>
                QA Coverage
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/receipts'}>
                View Receipts
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/anchor-list'}>
                Anchor Management
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/migration-hub'}>
                Migration Hub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>BFO Ops Platform Summary - Family Office Marketplace</p>
        </div>
      </div>
    </div>
  );
}