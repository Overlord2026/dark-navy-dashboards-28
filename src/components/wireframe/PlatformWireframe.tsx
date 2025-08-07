import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  Calculator, 
  Scale, 
  Shield, 
  Settings,
  Download,
  Eye,
  FileText,
  CreditCard,
  Home,
  Phone,
  Building,
  Globe,
  Heart,
  DollarSign,
  Lock,
  TrendingUp,
  Calendar,
  Mail,
  MessageSquare,
  Search,
  Star,
  Target,
  Zap
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonaFlow {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<any>;
  modules: string[];
}

interface PlatformModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  personas: string[];
  features: string[];
  integrations: string[];
}

// Platform Architecture Data
const personaFlows: PersonaFlow[] = [
  {
    id: 'client',
    name: 'Client Family',
    color: '#3b82f6',
    icon: Users,
    modules: ['dashboard', 'vault', 'billpay', 'communication', 'onboarding']
  },
  {
    id: 'advisor',
    name: 'Financial Advisor',
    color: '#10b981',
    icon: Briefcase,
    modules: ['practice', 'clients', 'communication', 'marketplace', 'compliance', 'lending']
  },
  {
    id: 'cpa',
    name: 'CPA/Accountant',
    color: '#f59e0b',
    icon: Calculator,
    modules: ['practice', 'clients', 'tax', 'compliance', 'communication']
  },
  {
    id: 'attorney',
    name: 'Attorney/Legal',
    color: '#8b5cf6',
    icon: Scale,
    modules: ['practice', 'clients', 'legal', 'compliance', 'communication']
  },
  {
    id: 'healthcare',
    name: 'Healthcare Provider',
    color: '#ef4444',
    icon: Heart,
    modules: ['practice', 'patients', 'compliance', 'communication']
  },
  {
    id: 'admin',
    name: 'Platform Admin',
    color: '#6b7280',
    icon: Settings,
    modules: ['analytics', 'users', 'compliance', 'system', 'billing']
  }
];

const platformModules: PlatformModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Hub',
    description: 'Personalized overview and quick actions',
    icon: Home,
    personas: ['client', 'advisor', 'cpa', 'attorney', 'healthcare'],
    features: ['Overview Cards', 'Quick Actions', 'Recent Activity', 'Notifications'],
    integrations: ['Analytics', 'Calendar', 'Tasks', 'Communications']
  },
  {
    id: 'onboarding',
    name: 'Smart Onboarding',
    description: 'Guided setup and activation flows',
    icon: Zap,
    personas: ['client', 'advisor', 'cpa', 'attorney'],
    features: ['Welcome Wizard', 'Document Upload', 'Identity Verification', 'Training'],
    integrations: ['Twilio', 'SendGrid', 'Trusted Activation', 'Linda AI']
  },
  {
    id: 'vault',
    name: 'Secure Document Vault',
    description: 'Encrypted document storage and sharing',
    icon: Lock,
    personas: ['client', 'advisor', 'cpa', 'attorney'],
    features: ['File Storage', 'Version Control', 'Access Controls', 'E-Signatures'],
    integrations: ['Encryption', 'Audit Logs', 'Compliance', 'Backup']
  },
  {
    id: 'billpay',
    name: 'Bill Pay & Banking',
    description: 'Integrated payment and banking services',
    icon: CreditCard,
    personas: ['client'],
    features: ['Bill Payment', 'ACH Transfers', 'Account Management', 'Payment History'],
    integrations: ['Plaid', 'Stripe', 'Banking APIs', 'Fraud Detection']
  },
  {
    id: 'communication',
    name: 'Communications Suite',
    description: 'Unified messaging, calls, and video',
    icon: Phone,
    personas: ['client', 'advisor', 'cpa', 'attorney', 'healthcare'],
    features: ['SMS/Voice', 'Video Calls', 'Email', 'Support Chat'],
    integrations: ['Twilio', 'SendGrid', 'Flex', 'Linda AI']
  },
  {
    id: 'practice',
    name: 'Practice Management',
    description: 'Professional workflow and client management',
    icon: Building,
    personas: ['advisor', 'cpa', 'attorney', 'healthcare'],
    features: ['Client CRM', 'Scheduling', 'Task Management', 'Billing'],
    integrations: ['Calendar', 'Communications', 'Analytics', 'Compliance']
  },
  {
    id: 'marketplace',
    name: 'Deal Marketplace',
    description: 'Private market investments and opportunities',
    icon: Globe,
    personas: ['advisor', 'client'],
    features: ['Deal Flow', 'Investment Tracking', 'Due Diligence', 'Allocations'],
    integrations: ['KYC/AML', 'Banking', 'Legal', 'Analytics']
  },
  {
    id: 'lending',
    name: 'Lending Platform',
    description: 'Loan origination and management',
    icon: DollarSign,
    personas: ['advisor', 'client'],
    features: ['Loan Applications', 'Underwriting', 'Portfolio Management', 'Servicing'],
    integrations: ['Credit APIs', 'Banking', 'Legal', 'Compliance']
  },
  {
    id: 'compliance',
    name: 'Compliance Center',
    description: 'Regulatory compliance and audit tools',
    icon: Shield,
    personas: ['advisor', 'cpa', 'attorney', 'admin'],
    features: ['Audit Trails', 'Reporting', 'Policy Management', 'Risk Assessment'],
    integrations: ['All Modules', 'Regulatory APIs', 'Archive', 'Analytics']
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    description: 'Business intelligence and reporting',
    icon: TrendingUp,
    personas: ['advisor', 'admin'],
    features: ['Dashboards', 'Custom Reports', 'Performance Metrics', 'Forecasting'],
    integrations: ['Segment CDP', 'All Data Sources', 'Export Tools', 'API']
  }
];

// Custom Node Components
const PersonaNode = ({ data }: { data: any }) => {
  const persona = personaFlows.find(p => p.id === data.personaId);
  if (!persona) return null;

  return (
    <div 
      className="px-6 py-4 rounded-lg border-2 bg-white shadow-lg min-w-[200px]"
      style={{ borderColor: persona.color }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="p-2 rounded-full"
          style={{ backgroundColor: `${persona.color}20`, color: persona.color }}
        >
          <persona.icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{persona.name}</h3>
          <p className="text-sm text-gray-500">{data.userCount || '1.2K'} users</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {persona.modules.slice(0, 3).map(moduleId => {
          const module = platformModules.find(m => m.id === moduleId);
          return module ? (
            <div key={moduleId} className="flex items-center gap-2 text-sm">
              <module.icon className="h-4 w-4 text-gray-400" />
              <span>{module.name}</span>
            </div>
          ) : null;
        })}
        {persona.modules.length > 3 && (
          <p className="text-xs text-gray-400">+{persona.modules.length - 3} more modules</p>
        )}
      </div>
    </div>
  );
};

const ModuleNode = ({ data }: { data: any }) => {
  const module = platformModules.find(m => m.id === data.moduleId);
  if (!module) return null;

  return (
    <div className="px-4 py-3 rounded-lg border bg-white shadow-md min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <module.icon className="h-5 w-5 text-blue-600" />
        <h4 className="font-medium">{module.name}</h4>
      </div>
      <p className="text-xs text-gray-500 mb-2">{module.description}</p>
      
      <div className="flex flex-wrap gap-1">
        {module.personas.slice(0, 3).map(personaId => {
          const persona = personaFlows.find(p => p.id === personaId);
          return persona ? (
            <Badge 
              key={personaId} 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: persona.color, color: persona.color }}
            >
              {persona.name.split(' ')[0]}
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  persona: PersonaNode,
  module: ModuleNode,
};

export function PlatformWireframe() {
  const flowRef = useRef<HTMLDivElement>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showModuleDetails, setShowModuleDetails] = useState(false);

  // Generate nodes and edges for the flow
  const generateFlowData = () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add persona nodes in a circle
    personaFlows.forEach((persona, index) => {
      const angle = (index / personaFlows.length) * 2 * Math.PI;
      const radius = 300;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      nodes.push({
        id: `persona-${persona.id}`,
        type: 'persona',
        position: { x: x + 400, y: y + 300 },
        data: { personaId: persona.id },
        draggable: true,
      });
    });

    // Add module nodes in inner circle
    platformModules.forEach((module, index) => {
      const angle = (index / platformModules.length) * 2 * Math.PI;
      const radius = 150;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      nodes.push({
        id: `module-${module.id}`,
        type: 'module',
        position: { x: x + 400, y: y + 300 },
        data: { moduleId: module.id },
        draggable: true,
      });

      // Connect modules to their personas
      module.personas.forEach(personaId => {
        edges.push({
          id: `${module.id}-${personaId}`,
          source: `module-${module.id}`,
          target: `persona-${personaId}`,
          type: 'smoothstep',
          style: { 
            stroke: personaFlows.find(p => p.id === personaId)?.color || '#666',
            strokeWidth: 2,
            opacity: 0.6
          },
          animated: false,
        });
      });
    });

    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } = generateFlowData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const exportToPDF = async () => {
    if (!flowRef.current) return;

    try {
      const canvas = await html2canvas(flowRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a3');
      
      const imgWidth = 420;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title page
      pdf.setFontSize(24);
      pdf.text('BFO Platform Architecture Map', 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add personas overview
      let yPos = 60;
      pdf.setFontSize(16);
      pdf.text('Platform Personas:', 20, yPos);
      yPos += 10;
      
      personaFlows.forEach(persona => {
        pdf.setFontSize(12);
        pdf.text(`• ${persona.name}`, 25, yPos);
        yPos += 7;
      });
      
      // Add modules overview
      yPos += 10;
      pdf.setFontSize(16);
      pdf.text('Core Modules:', 20, yPos);
      yPos += 10;
      
      platformModules.forEach(module => {
        if (yPos > 180) {
          pdf.addPage();
          yPos = 30;
        }
        pdf.setFontSize(12);
        pdf.text(`• ${module.name}: ${module.description}`, 25, yPos);
        yPos += 7;
      });
      
      // Add the visual map
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      pdf.save('bfo-platform-wireframe.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">BFO Platform Architecture Map</h1>
            <p className="text-gray-600">Interactive wireframe of the complete platform ecosystem</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowModuleDetails(!showModuleDetails)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              {showModuleDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r p-6 overflow-y-auto">
          <Tabs defaultValue="personas">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personas" className="space-y-4">
              <h3 className="font-semibold">Platform Personas</h3>
              {personaFlows.map(persona => (
                <Card 
                  key={persona.id}
                  className={`cursor-pointer transition-all ${
                    selectedPersona === persona.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPersona(
                    selectedPersona === persona.id ? null : persona.id
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${persona.color}20`, color: persona.color }}
                      >
                        <persona.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{persona.name}</h4>
                        <p className="text-sm text-gray-500">{persona.modules.length} modules</p>
                      </div>
                    </div>
                    
                    {selectedPersona === persona.id && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Available Modules:</p>
                        <div className="space-y-1">
                          {persona.modules.map(moduleId => {
                            const module = platformModules.find(m => m.id === moduleId);
                            return module ? (
                              <div key={moduleId} className="flex items-center gap-2 text-sm">
                                <module.icon className="h-3 w-3 text-gray-400" />
                                <span>{module.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-4">
              <h3 className="font-semibold">Platform Modules</h3>
              {platformModules.map(module => (
                <Card key={module.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <module.icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm">{module.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Used by:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {module.personas.map(personaId => {
                            const persona = personaFlows.find(p => p.id === personaId);
                            return persona ? (
                              <Badge 
                                key={personaId} 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: persona.color, color: persona.color }}
                              >
                                {persona.name.split(' ')[0]}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      {showModuleDetails && (
                        <>
                          <div>
                            <p className="text-xs font-medium text-gray-600">Features:</p>
                            <ul className="text-xs text-gray-500 ml-2">
                              {module.features.slice(0, 3).map(feature => (
                                <li key={feature}>• {feature}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-600">Integrations:</p>
                            <ul className="text-xs text-gray-500 ml-2">
                              {module.integrations.slice(0, 3).map(integration => (
                                <li key={integration}>• {integration}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Flow Area */}
        <div className="flex-1 h-screen" ref={flowRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            style={{ backgroundColor: '#f9fafb' }}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'persona') {
                  const persona = personaFlows.find(p => p.id === node.data.personaId);
                  return persona?.color || '#666';
                }
                return '#3b82f6';
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background variant={"dots" as any} gap={20} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Legend */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold mb-3">Platform Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-white"></div>
            <span className="text-sm">Persona Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-blue-50"></div>
            <span className="text-sm">Platform Module</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gray-400"></div>
            <span className="text-sm">Access Connection</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Click personas to expand details. Drag nodes to rearrange the view.
        </p>
      </div>
    </div>
  );
}