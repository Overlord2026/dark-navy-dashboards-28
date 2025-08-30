import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calculator, 
  FileText, 
  Shield, 
  Building2, 
  TrendingUp, 
  GraduationCap,
  Download,
  Play,
  Briefcase
} from 'lucide-react';

interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  persona: string[];
  icon: React.ReactNode;
  demoData?: any;
  status: 'active' | 'beta' | 'coming_soon';
}

const TOOLS_REGISTRY: ToolConfig[] = [
  // Family Tools
  {
    id: 'retirement-roadmap',
    name: 'Retirement Roadmap',
    description: 'Comprehensive retirement planning with Monte Carlo simulations',
    category: 'planning',
    persona: ['family'],
    icon: <TrendingUp className="h-4 w-4" />,
    status: 'active',
    demoData: { scenarios: 3, probability: 85, shortfall: '$125k' }
  },
  {
    id: 'estate-workbench',
    name: 'Estate Workbench',
    description: 'State-specific estate planning with document packs',
    category: 'legal',
    persona: ['family'],
    icon: <FileText className="h-4 w-4" />,
    status: 'active',
    demoData: { state: 'CA', documents: 12, completed: 8 }
  },
  {
    id: 'tax-analyzer',
    name: 'Tax Analyzer',
    description: 'Tax optimization and projection tools',
    category: 'tax',
    persona: ['family'],
    icon: <Calculator className="h-4 w-4" />,
    status: 'active',
    demoData: { savings: '$15.2k', strategies: 5 }
  },
  {
    id: 'hnw-asset-registry',
    name: 'HNW Asset Registry',
    description: 'High net worth asset tracking and management',
    category: 'assets',
    persona: ['family'],
    icon: <Building2 className="h-4 w-4" />,
    status: 'active',
    demoData: { assets: 47, value: '$5.2M' }
  },

  // Advisor Tools
  {
    id: '401k-control-plane',
    name: '401(k) Control Plane',
    description: 'Plan management with PTE 2020-02 compliance',
    category: 'retirement',
    persona: ['advisor'],
    icon: <Shield className="h-4 w-4" />,
    status: 'active',
    demoData: { plans: 8, participants: 1250, compliance: '100%' }
  },
  {
    id: 'trading-governance',
    name: 'Trading Governance OS',
    description: 'ADV compliance with wash sale detection',
    category: 'trading',
    persona: ['advisor'],
    icon: <TrendingUp className="h-4 w-4" />,
    status: 'active',
    demoData: { trades: 342, violations: 0, savings: '$8.7k' }
  },

  // CPA Tools
  {
    id: 'ce-tracker',
    name: 'CE Record Tracker',
    description: 'Continuing education compliance tracking',
    category: 'compliance',
    persona: ['cpa'],
    icon: <GraduationCap className="h-4 w-4" />,
    status: 'active',
    demoData: { required: 40, completed: 32, remaining: 8 }
  },
  {
    id: 'tax-projector',
    name: 'Tax Projector',
    description: 'Multi-year tax planning and projections',
    category: 'tax',
    persona: ['cpa'],
    icon: <Calculator className="h-4 w-4" />,
    status: 'active',
    demoData: { years: 5, scenarios: 3, optimization: '$125k' }
  },

  // Attorney Tools
  {
    id: 'estate-toolkit',
    name: 'Estate & RON Toolkit',
    description: 'Estate planning with remote online notarization',
    category: 'legal',
    persona: ['attorney'],
    icon: <FileText className="h-4 w-4" />,
    status: 'active',
    demoData: { templates: 25, completed: 15 }
  },
  {
    id: 'litigation-pack',
    name: 'Litigation Template Pack',
    description: 'Legal document templates and workflows',
    category: 'legal',
    persona: ['attorney'],
    icon: <Briefcase className="h-4 w-4" />,
    status: 'active',
    demoData: { templates: 150, categories: 12 }
  },

  // Insurance Tools
  {
    id: 'pc-pipeline',
    name: 'P&C Pipeline',
    description: 'Property & casualty insurance workflow',
    category: 'insurance',
    persona: ['insurance'],
    icon: <Shield className="h-4 w-4" />,
    status: 'active',
    demoData: { quotes: 45, policies: 23, claims: 8 }
  },
  {
    id: 'life-annuity-suite',
    name: 'Life/Annuity Suite',
    description: 'Life insurance and annuity suitability tools',
    category: 'insurance',
    persona: ['insurance'],
    icon: <TrendingUp className="h-4 w-4" />,
    status: 'active',
    demoData: { applications: 12, approved: 10 }
  }
];

interface ToolsRegistryProps {
  currentPersona: string;
  enabledTools?: string[];
}

export function ToolsRegistry({ currentPersona, enabledTools = [] }: ToolsRegistryProps) {
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);

  const filteredTools = TOOLS_REGISTRY.filter(tool => 
    tool.persona.includes(currentPersona) || tool.persona.includes('all')
  );

  const categories = Array.from(new Set(filteredTools.map(tool => tool.category)));

  const handleRunDemo = (tool: ToolConfig) => {
    // Mock demo runner
    console.log(`Running demo for ${tool.name}`, tool.demoData);
  };

  const handleExportCSV = (tool: ToolConfig) => {
    // Mock CSV export
    const csvData = `Tool,Status,Demo Data\n${tool.name},${tool.status},${JSON.stringify(tool.demoData)}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.id}-demo.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tools Registry</h2>
          <p className="text-muted-foreground">
            Tools available for {currentPersona} persona
          </p>
        </div>
        <Badge variant="outline">
          {filteredTools.length} tools available
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 4).map(category => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isEnabled={enabledTools.includes(tool.id)}
                onRunDemo={() => handleRunDemo(tool)}
                onExportCSV={() => handleExportCSV(tool)}
                onViewDetails={() => setSelectedTool(tool)}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isEnabled={enabledTools.includes(tool.id)}
                    onRunDemo={() => handleRunDemo(tool)}
                    onExportCSV={() => handleExportCSV(tool)}
                    onViewDetails={() => setSelectedTool(tool)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Tool Details Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTool?.icon}
              {selectedTool?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTool && (
            <div className="space-y-4">
              <p>{selectedTool.description}</p>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedTool.category}</Badge>
                <Badge variant={selectedTool.status === 'active' ? 'default' : 'secondary'}>
                  {selectedTool.status}
                </Badge>
              </div>

              {selectedTool.demoData && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Demo Data</h4>
                  <pre className="text-sm">
                    {JSON.stringify(selectedTool.demoData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleRunDemo(selectedTool)} className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportCSV(selectedTool)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolCard({ 
  tool, 
  isEnabled, 
  onRunDemo, 
  onExportCSV, 
  onViewDetails 
}: {
  tool: ToolConfig;
  isEnabled: boolean;
  onRunDemo: () => void;
  onExportCSV: () => void;
  onViewDetails: () => void;
}) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      isEnabled ? 'ring-2 ring-primary ring-opacity-20' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tool.icon}
            <CardTitle className="text-lg">{tool.name}</CardTitle>
          </div>
          <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className="text-xs">
            {tool.status}
          </Badge>
        </div>
        <CardDescription className="text-sm">{tool.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {tool.demoData && (
            <div className="text-xs text-muted-foreground space-y-1">
              {Object.entries(tool.demoData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button size="sm" onClick={onRunDemo} className="flex-1 gap-1">
              <Play className="h-3 w-3" />
              Demo
            </Button>
            <Button size="sm" variant="outline" onClick={onExportCSV} className="gap-1">
              <Download className="h-3 w-3" />
              CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}