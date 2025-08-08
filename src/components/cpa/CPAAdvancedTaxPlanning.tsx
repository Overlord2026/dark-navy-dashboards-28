import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Building, 
  MapPin, 
  DollarSign, 
  BarChart3,
  FileText,
  ArrowRight,
  Plus,
  Target
} from 'lucide-react';

interface CPAAdvancedTaxPlanningProps {
  isPremium?: boolean;
}

export const CPAAdvancedTaxPlanning: React.FC<CPAAdvancedTaxPlanningProps> = ({ isPremium }) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('multi-year');

  const scenarios = [
    {
      id: 'multi-year',
      title: 'Multi-Year Tax Projection',
      description: 'Model tax scenarios across multiple years',
      icon: TrendingUp,
      features: ['5-year projections', 'Income smoothing', 'Tax bracket optimization']
    },
    {
      id: 'roth-conversion',
      title: 'Roth Conversion Optimizer',
      description: 'Optimize Roth IRA conversion timing and amounts',
      icon: Target,
      features: ['Conversion ladders', 'Tax-efficient timing', 'Break-even analysis']
    },
    {
      id: 'entity-structure',
      title: 'Entity Structure Analysis',
      description: 'Compare entity types and structures',
      icon: Building,
      features: ['S-Corp vs LLC', 'Pass-through analysis', 'State considerations']
    },
    {
      id: 'state-residency',
      title: 'State Residency Planning',
      description: 'Analyze state tax implications',
      icon: MapPin,
      features: ['Multi-state analysis', 'Residency requirements', 'Tax savings calculator']
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      client: 'Johnson Family Trust',
      type: 'Roth Conversion',
      projectedSavings: '$47,500',
      date: '2024-03-10',
      status: 'Completed'
    },
    {
      id: 2,
      client: 'TechStart LLC',
      type: 'Entity Structure',
      projectedSavings: '$23,800',
      date: '2024-03-08',
      status: 'In Progress'
    },
    {
      id: 3,
      client: 'Mitchell Holdings',
      type: 'State Residency',
      projectedSavings: '$156,000',
      date: '2024-03-05',
      status: 'Draft'
    }
  ];

  const renderScenarioCard = (scenario: typeof scenarios[0]) => {
    const IconComponent = scenario.icon;
    
    return (
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="cursor-pointer"
        onClick={() => setSelectedScenario(scenario.id)}
      >
        <Card className={`h-full border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-lg ${
          selectedScenario === scenario.id ? 'border-primary' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <CardDescription className="text-sm">
                  {scenario.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              {scenario.features.map((feature, index) => (
                <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  {feature}
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Start Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Tax Scenarios</TabsTrigger>
          <TabsTrigger value="calculator">Quick Calculator</TabsTrigger>
          <TabsTrigger value="reports">Analysis Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Advanced Tax Planning Scenarios</h3>
              <p className="text-muted-foreground">Choose a planning tool to start your analysis</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Custom Scenario
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map(renderScenarioCard)}
          </div>

          {selectedScenario && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {scenarios.find(s => s.id === selectedScenario)?.title} Tool
                </CardTitle>
                <CardDescription>
                  Configure your analysis parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="johnson">Johnson Family Trust</SelectItem>
                        <SelectItem value="techstart">TechStart LLC</SelectItem>
                        <SelectItem value="mitchell">Sarah Mitchell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Analysis Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                  <Button variant="outline">Save Template</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tax Calculator</CardTitle>
              <CardDescription>Fast calculations for common tax scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income</Label>
                  <Input id="income" placeholder="$0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="mfj">Married Filing Jointly</SelectItem>
                      <SelectItem value="mfs">Married Filing Separately</SelectItem>
                      <SelectItem value="hoh">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Tax
              </Button>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$0</div>
                  <div className="text-sm text-muted-foreground">Federal Tax</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$0</div>
                  <div className="text-sm text-muted-foreground">State Tax</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$0</div>
                  <div className="text-sm text-muted-foreground">Total Tax</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Tax Analysis Reports</h3>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export All
            </Button>
          </div>

          <div className="grid gap-4">
            {recentAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{analysis.client}</div>
                        <div className="text-sm text-muted-foreground">{analysis.type} Analysis</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Projected Savings</div>
                        <div className="font-bold text-green-600">{analysis.projectedSavings}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium">{analysis.date}</div>
                      </div>
                      <Badge variant={analysis.status === 'Completed' ? 'default' : 'secondary'}>
                        {analysis.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};