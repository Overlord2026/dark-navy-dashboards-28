import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Image, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { PatentClaimDrafts } from './PatentClaimDrafts';
import { UIWireframeExports } from './UIWireframeExports';
import { IPLogExport } from './IPLogExport';
import { PatentPendingAssets } from './PatentPendingAssets';
import { LegalTemplates } from './LegalTemplates';
import { PatentWireframeGenerator } from './PatentWireframeGenerator';
import { TechnicalSpecificationDiagrams } from './TechnicalSpecificationDiagrams';
import { PatentDocumentationPackage } from './PatentDocumentationPackage';
import { TechnicalWorkflowDiagrams } from './TechnicalWorkflowDiagrams';
import { AttorneyHandoffPackets } from './AttorneyHandoffPackets';
import { SWAGPatentPrepPackage } from './SWAGPatentPrepPackage';
import { PatentabilityTestDashboard } from './PatentabilityTestDashboard';

export function IPExportSystem() {
  const [exportStatus, setExportStatus] = useState<Record<string, boolean>>({});

  const deliverables = [
    {
      id: 'technical-docs',
      title: 'Technical Documentation',
      description: 'System diagrams and workflow documentation',
      files: ['BFO_Technical_Architecture.pdf', 'Workflow_Diagrams.mermaid'],
      component: 'TechnicalWorkflowDiagrams'
    },
    {
      id: 'patent-claims',
      title: 'Patent Claim Drafts',
      description: 'Sample patent claims for core innovations',
      files: ['Patent_Claims_Draft.pdf', 'Claims_Family_Vault.txt', 'Claims_SWAG_Score.txt'],
      component: 'PatentClaimDrafts'
    },
    {
      id: 'ui-wireframes',
      title: 'UI/UX Wireframe Exports',
      description: 'Interface designs for patentable features',
      files: ['UI_Wireframes.pdf', 'Figma_Export_Links.txt'],
      component: 'UIWireframeExports'
    },
    {
      id: 'ip-logs',
      title: 'IP Logging System',
      description: 'Invention records and changelog',
      files: ['IP_Invention_Log.csv', 'Innovation_Timeline.pdf'],
      component: 'IPLogExport'
    },
    {
      id: 'pending-notices',
      title: 'Patent Pending Assets',
      description: 'Badges and notices for branding',
      files: ['Patent_Pending_Badge.svg', 'Gold_Tree_Horizontal.svg', 'Legal_Notices.pdf'],
      component: 'PatentPendingAssets'
    },
    {
      id: 'legal-materials',
      title: 'Legal & Onboarding Materials',
      description: 'NDAs, templates, and compliance materials',
      files: ['NDA_Template.pdf', 'Employee_IP_Onboarding.pdf', 'Compliance_Scripts.pdf'],
      component: 'LegalTemplates'
    }
  ];

  const handleExport = (deliverableId: string) => {
    setExportStatus(prev => ({ ...prev, [deliverableId]: true }));
    
    // Simulate export process
    setTimeout(() => {
      console.log(`Exported ${deliverableId} successfully`);
    }, 1000);
  };

  const handleExportAll = () => {
    deliverables.forEach(item => {
      setExportStatus(prev => ({ ...prev, [item.id]: true }));
    });
    
    // Create comprehensive export package
    const exportData = {
      timestamp: new Date().toISOString(),
      platform: 'BFO Family Office Platform',
      version: '1.0.0',
      deliverables: deliverables.map(item => ({
        ...item,
        exported: true,
        exportDate: new Date().toISOString()
      }))
    };
    
    console.log('Complete IP Export Package:', exportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">IP Documentation Export System</h1>
          <p className="text-muted-foreground mt-2">
            Complete patent and IP protection deliverables for legal handoff
          </p>
        </div>
        <Button onClick={handleExportAll} className="bg-gradient-to-r from-amber-500 to-amber-600">
          <Download className="h-4 w-4 mr-2" />
          Export Complete Package
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-amber-600" />
            <div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 mb-2">
                Patent Documentation Ready
              </Badge>
              <p className="text-sm text-amber-700">
                All deliverables prepared for patent attorney review and legal submission.
                Export quality optimized for USPTO filing requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Export Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Docs</TabsTrigger>
          <TabsTrigger value="claims">Patent Claims</TabsTrigger>
          <TabsTrigger value="wireframes">UI Wireframes</TabsTrigger>
          <TabsTrigger value="assets">Pending Assets</TabsTrigger>
          <TabsTrigger value="legal">Legal Materials</TabsTrigger>
          <TabsTrigger value="attorney-packets">Attorney Packets</TabsTrigger>
          <TabsTrigger value="swag-patent">SWAG Patent</TabsTrigger>
          <TabsTrigger value="patentability-test" className="text-emerald-600 flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Patentability Test</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {exportStatus[item.id] && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {item.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3" />
                        <span className="font-mono">{file}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handleExport(item.id)}
                    disabled={exportStatus[item.id]}
                    variant={exportStatus[item.id] ? "secondary" : "default"}
                    className="w-full"
                  >
                    {exportStatus[item.id] ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Exported
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalWorkflowDiagrams />
        </TabsContent>

        <TabsContent value="claims">
          <PatentClaimDrafts />
        </TabsContent>


        <TabsContent value="assets">
          <PatentPendingAssets />
        </TabsContent>

        <TabsContent value="legal">
          <LegalTemplates />
        </TabsContent>

        <TabsContent value="attorney-packets">
          <AttorneyHandoffPackets />
        </TabsContent>
        
        <TabsContent value="swag-patent">
          <SWAGPatentPrepPackage />
        </TabsContent>

        <TabsContent value="patentability-test">
          <PatentabilityTestDashboard />
        </TabsContent>

        <TabsContent value="package">
          <PatentDocumentationPackage />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Legal Handoff Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="technical" className="rounded" />
              <label htmlFor="technical" className="text-sm">
                Technical documentation and system diagrams exported
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="claims" className="rounded" />
              <label htmlFor="claims" className="text-sm">
                Patent claim drafts prepared for all core innovations
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="wireframes" className="rounded" />
              <label htmlFor="wireframes" className="text-sm">
                UI/UX wireframes exported in attorney-ready format
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="ip-log" className="rounded" />
              <label htmlFor="ip-log" className="text-sm">
                IP invention log with dates and inventor records
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="assets" className="rounded" />
              <label htmlFor="assets" className="text-sm">
                Patent pending assets and branding materials
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="legal" className="rounded" />
              <label htmlFor="legal" className="text-sm">
                Legal templates and compliance materials ready
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="package" className="rounded" />
              <label htmlFor="package" className="text-sm">
                Complete export package delivered to patent attorney
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}