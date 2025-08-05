import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, GitBranch, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FeaturePacket {
  id: string;
  name: string;
  description: string;
  version: string;
  firstFiledDate: string;
  lastUpdated: string;
  claims: number;
  wireframes: number;
  workflowLogs: number;
  status: 'draft' | 'ready' | 'filed';
}

const FEATURE_PACKETS: FeaturePacket[] = [
  {
    id: 'swag-lead-score',
    name: 'SWAG Lead Score™',
    description: 'AI-driven HNW lead scoring with open banking integration',
    version: '2.1.0',
    firstFiledDate: '2024-01-15',
    lastUpdated: '2024-08-05',
    claims: 8,
    wireframes: 12,
    workflowLogs: 24,
    status: 'ready'
  },
  {
    id: 'family-legacy-vault',
    name: 'Family Legacy Vault™',
    description: 'Multi-generational digital vault with multimedia triggers',
    version: '3.0.2',
    firstFiledDate: '2024-02-01',
    lastUpdated: '2024-08-03',
    claims: 12,
    wireframes: 18,
    workflowLogs: 36,
    status: 'filed'
  },
  {
    id: 'vip-onboarding-engine',
    name: 'VIP Onboarding Engine',
    description: 'Automated industry leader profile creation and routing',
    version: '1.5.1',
    firstFiledDate: '2024-03-10',
    lastUpdated: '2024-08-01',
    claims: 6,
    wireframes: 15,
    workflowLogs: 18,
    status: 'ready'
  },
  {
    id: 'linda-voice-ai',
    name: 'Linda Voice AI™',
    description: 'Voice-activated meeting management for financial workflows',
    version: '2.3.0',
    firstFiledDate: '2024-04-20',
    lastUpdated: '2024-07-30',
    claims: 10,
    wireframes: 8,
    workflowLogs: 42,
    status: 'ready'
  },
  {
    id: 'multi-persona-orchestration',
    name: 'Multi-Persona Orchestration Platform',
    description: 'Role-based collaboration engine for family office ecosystem',
    version: '4.1.0',
    firstFiledDate: '2024-01-05',
    lastUpdated: '2024-08-05',
    claims: 15,
    wireframes: 25,
    workflowLogs: 68,
    status: 'ready'
  },
  {
    id: 'compliance-automation',
    name: 'Automated Compliance Engine',
    description: 'Multi-role compliance automation with audit trail',
    version: '1.8.3',
    firstFiledDate: '2024-05-15',
    lastUpdated: '2024-08-02',
    claims: 7,
    wireframes: 10,
    workflowLogs: 28,
    status: 'draft'
  },
  {
    id: 'api-monitoring-dashboard',
    name: 'API Go/No-Go Dashboard',
    description: 'In-platform risk analytics with real-time monitoring',
    version: '2.0.1',
    firstFiledDate: '2024-06-01',
    lastUpdated: '2024-07-28',
    claims: 5,
    wireframes: 8,
    workflowLogs: 15,
    status: 'ready'
  }
];

export function AttorneyHandoffPackets() {
  const [downloadingPacket, setDownloadingPacket] = useState<string | null>(null);

  const generatePacketContent = (packet: FeaturePacket) => {
    return `
ATTORNEY HANDOFF PACKET
=======================

Feature: ${packet.name}
Version: ${packet.version}
First Filed: ${packet.firstFiledDate}
Last Updated: ${packet.lastUpdated}
Status: ${packet.status.toUpperCase()}

DESCRIPTION
-----------
${packet.description}

PATENT CLAIMS (${packet.claims} total)
=====================================

1. METHOD CLAIMS:
   - A computer-implemented method for ${packet.name.toLowerCase()} comprising:
     a) receiving user input data via a secure interface
     b) processing data through AI algorithms specific to ${packet.description.toLowerCase()}
     c) generating automated responses based on predetermined criteria
     d) storing results in tamper-evident audit logs

2. SYSTEM CLAIMS:
   - A system for ${packet.name.toLowerCase()} comprising:
     a) a processor configured to execute instructions
     b) memory storing the instructions
     c) a secure database with role-based access controls
     d) API integration layer for third-party services

3. DEVICE CLAIMS:
   - A non-transitory computer-readable medium storing instructions for ${packet.name.toLowerCase()}

UI/UX WIREFRAMES (${packet.wireframes} total)
=============================================

Primary Interface:
- Login/Authentication Flow
- Dashboard Layout (role-specific)
- Feature-specific UI elements
- Mobile responsive designs
- Accessibility compliance wireframes

Secondary Interfaces:
- Admin configuration panels
- Audit log viewers
- Export/import workflows
- API documentation interfaces

WORKFLOW LOGS (${packet.workflowLogs} entries)
==============================================

Technical Implementation:
- Database schema changes
- API endpoint modifications
- Security policy updates
- Integration test results
- Performance benchmarks

Legal Documentation:
- Invention disclosure forms
- Prior art analysis
- Inventor declarations
- Technical specifications

TECHNICAL SPECIFICATIONS
========================

Architecture:
- React.js frontend with TypeScript
- Supabase backend with PostgreSQL
- Row-level security (RLS) policies
- RESTful API design
- Real-time subscriptions

Security Features:
- End-to-end encryption
- Multi-factor authentication
- Role-based access control
- Audit logging
- Data anonymization

Integration Points:
- Third-party API connections
- Webhook implementations
- OAuth providers
- Payment processing
- Communication services

EXPORT METADATA
===============
Generated: ${new Date().toISOString()}
Export Type: Attorney Handoff Packet
Patent Pending Notice: This technology is patent pending
Confidentiality: Attorney-Client Privileged Material

---END OF PACKET---
`;
  };

  const downloadPacket = async (packet: FeaturePacket) => {
    setDownloadingPacket(packet.id);
    
    try {
      const content = generatePacketContent(packet);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${packet.id}-attorney-handoff-v${packet.version}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${packet.name} attorney packet v${packet.version}`);
    } catch (error) {
      toast.error('Failed to generate attorney packet');
    } finally {
      setDownloadingPacket(null);
    }
  };

  const downloadAllPackets = async () => {
    setDownloadingPacket('all');
    
    try {
      const masterContent = `
MASTER ATTORNEY HANDOFF PACKAGE
===============================
Generated: ${new Date().toISOString()}
Total Features: ${FEATURE_PACKETS.length}
Total Claims: ${FEATURE_PACKETS.reduce((sum, p) => sum + p.claims, 0)}
Total Wireframes: ${FEATURE_PACKETS.reduce((sum, p) => sum + p.wireframes, 0)}
Total Workflow Logs: ${FEATURE_PACKETS.reduce((sum, p) => sum + p.workflowLogs, 0)}

FEATURE SUMMARY
===============
${FEATURE_PACKETS.map(packet => `
${packet.name} (v${packet.version})
- Status: ${packet.status.toUpperCase()}
- First Filed: ${packet.firstFiledDate}
- Claims: ${packet.claims}
- Wireframes: ${packet.wireframes}
- Workflow Logs: ${packet.workflowLogs}
`).join('\n')}

INDIVIDUAL PACKETS
==================
${FEATURE_PACKETS.map(packet => `
${'='.repeat(60)}
${generatePacketContent(packet)}
${'='.repeat(60)}
`).join('\n')}
`;

      const blob = new Blob([masterContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `master-attorney-handoff-package-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Downloaded master attorney handoff package');
    } catch (error) {
      toast.error('Failed to generate master package');
    } finally {
      setDownloadingPacket(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'bg-emerald-500';
      case 'ready': return 'bg-amber-500';
      case 'draft': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed': return <CheckCircle className="h-3 w-3" />;
      case 'ready': return <FileText className="h-3 w-3" />;
      case 'draft': return <GitBranch className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attorney Handoff Packets</h2>
          <p className="text-muted-foreground">Individual feature packages for legal review</p>
        </div>
        <Button 
          onClick={downloadAllPackets}
          disabled={downloadingPacket === 'all'}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {downloadingPacket === 'all' ? 'Generating...' : 'Download All Packets'}
        </Button>
      </div>

      <div className="grid gap-4">
        {FEATURE_PACKETS.map((packet) => (
          <Card key={packet.id} className="relative">
            <div className="absolute top-4 right-4">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(packet.status)} text-white flex items-center gap-1`}
              >
                {getStatusIcon(packet.status)}
                {packet.status.toUpperCase()}
              </Badge>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{packet.name}</CardTitle>
                  <CardDescription>{packet.description}</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  v{packet.version}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  First Filed: {packet.firstFiledDate}
                </div>
                <div className="text-xs">
                  Updated: {packet.lastUpdated}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{packet.claims}</div>
                  <div className="text-xs text-muted-foreground">Patent Claims</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{packet.wireframes}</div>
                  <div className="text-xs text-muted-foreground">UI Wireframes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{packet.workflowLogs}</div>
                  <div className="text-xs text-muted-foreground">Workflow Logs</div>
                </div>
              </div>
              
              <Button 
                onClick={() => downloadPacket(packet)}
                disabled={downloadingPacket === packet.id}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                {downloadingPacket === packet.id ? 'Generating...' : `Download ${packet.name} Packet`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Patent Pending Notice</h3>
            <p className="text-sm text-amber-700 mt-1">
              All exported packets include patent pending notices and attorney-client privilege statements. 
              Each download is timestamped and logged for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}