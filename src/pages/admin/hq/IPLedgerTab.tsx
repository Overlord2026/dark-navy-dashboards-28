import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Award, Plus } from 'lucide-react';

export function IPLedgerTab() {
  const ipAssets = [
    {
      id: 'PAT-2024-001',
      title: 'Multi-Persona Financial Orchestration System',
      type: 'Patent Application',
      status: 'Filed',
      priority: 'High',
      filingDate: '2024-03-15',
      description: 'AI-driven system for coordinating multiple financial personas and advisory roles'
    },
    {
      id: 'TM-2024-002',
      title: 'Better Family Office',
      type: 'Trademark',
      status: 'Registered',
      priority: 'Critical',
      filingDate: '2024-01-10',
      description: 'Primary brand trademark for family office services'
    },
    {
      id: 'PAT-2024-003',
      title: 'Blockchain-Anchored Compliance Framework',
      type: 'Patent Application',
      status: 'In Review',
      priority: 'High',
      filingDate: '2024-06-22',
      description: 'Immutable compliance audit trail using blockchain technology'
    },
    {
      id: 'CR-2024-004',
      title: 'BFO Platform Architecture',
      type: 'Copyright',
      status: 'Protected',
      priority: 'Medium',
      filingDate: '2024-02-01',
      description: 'Software architecture and codebase copyright protection'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Registered': case 'Protected': return 'bg-green-600 text-white';
      case 'Filed': case 'In Review': return 'bg-blue-600 text-white';
      case 'Pending': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Patent')) return <FileText className="h-4 w-4" />;
    if (type.includes('Trademark')) return <Award className="h-4 w-4" />;
    if (type.includes('Copyright')) return <Shield className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="bfo-subheader p-4 -m-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-bfo-gold" />
            <h2 className="text-xl font-semibold">Intellectual Property Ledger</h2>
          </div>
          <Button className="bfo-cta-secondary">
            <Plus className="h-4 w-4 mr-2" />
            New Filing
          </Button>
        </div>
        <p className="text-sm mt-1 opacity-80">Track and manage all intellectual property assets</p>
      </div>

      <div className="grid gap-4">
        {ipAssets.map((asset, index) => (
          <Card key={index} className="bfo-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bfo-gold/10 border border-bfo-gold/20">
                    {getTypeIcon(asset.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white">{asset.title}</CardTitle>
                    <p className="text-sm text-gray-300 mt-1">{asset.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(asset.priority)}>
                    {asset.priority}
                  </Badge>
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span><strong>Type:</strong> {asset.type}</span>
                  <span><strong>Filed:</strong> {new Date(asset.filingDate).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-white">{asset.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Summary */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">4</div>
              <div className="text-sm text-gray-300">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">2</div>
              <div className="text-sm text-gray-300">Patent Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">1</div>
              <div className="text-sm text-gray-300">Trademarks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">1</div>
              <div className="text-sm text-gray-300">Copyrights</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}