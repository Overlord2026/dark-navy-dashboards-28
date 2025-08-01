import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { 
  Settings, 
  Download, 
  FileText, 
  GripVertical, 
  Plus, 
  BarChart, 
  PieChart, 
  TrendingUp,
  Shield,
  Building2,
  Star
} from 'lucide-react';

interface ReportSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  customNotes: string;
}

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    assetClass: 'stock' | 'bond' | 'reit' | 'commodity' | 'cash';
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

interface PortfolioMetrics {
  beta: number;
  volatility: number;
  yield: number;
}

interface ReportSectionSelectorProps {
  sections: ReportSection[];
  onSectionsChange: (sections: ReportSection[]) => void;
  onClose: () => void;
}

function ReportSectionSelector({ sections, onSectionsChange, onClose }: ReportSectionSelectorProps) {
  const [localSections, setLocalSections] = useState(sections);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(localSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalSections(items);
  };

  const toggleSection = (id: string) => {
    setLocalSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setLocalSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, customNotes: notes } : section
      )
    );
  };

  const handleSave = () => {
    onSectionsChange(localSections);
    onClose();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configure Report Sections
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select sections to include in your report and drag to reorder. Add custom notes for each section as needed.
        </p>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {localSections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div 
                              {...provided.dragHandleProps}
                              className="flex items-center justify-center w-6 h-6 text-muted-foreground cursor-grab"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={section.enabled}
                                onCheckedChange={() => toggleSection(section.id)}
                              />
                              <div className="text-primary">{section.icon}</div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <h4 className="font-medium">{section.name}</h4>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                              </div>
                              
                              {section.enabled && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Custom Notes (Optional)
                                  </label>
                                  <Textarea
                                    value={section.customNotes}
                                    onChange={(e) => updateNotes(section.id, e.target.value)}
                                    placeholder="Add custom notes or commentary for this section..."
                                    className="mt-1 text-sm"
                                    rows={2}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </div>
    </DialogContent>
  );
}

interface AdvisorReportBuilderProps {
  currentPortfolio: Portfolio;
  proposedPortfolio?: Portfolio;
  currentMetrics: PortfolioMetrics;
  proposedMetrics?: PortfolioMetrics;
  marketData: Record<string, any>;
  clientName: string;
}

export function AdvisorReportBuilder({ 
  currentPortfolio, 
  proposedPortfolio, 
  currentMetrics, 
  proposedMetrics,
  marketData,
  clientName 
}: AdvisorReportBuilderProps) {
  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      icon: <FileText className="w-4 h-4" />,
      description: 'High-level portfolio overview and key metrics',
      enabled: true,
      customNotes: ''
    },
    {
      id: 'holdings-table',
      name: 'Holdings Analysis',
      icon: <BarChart className="w-4 h-4" />,
      description: 'Detailed breakdown of all portfolio holdings',
      enabled: true,
      customNotes: ''
    },
    {
      id: 'risk-return',
      name: 'Risk & Return Analysis',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Portfolio vs. benchmark performance and risk metrics',
      enabled: true,
      customNotes: ''
    },
    {
      id: 'income-analysis',
      name: 'Income Analysis',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Dividend yield and income generation analysis',
      enabled: false,
      customNotes: ''
    },
    {
      id: 'asset-allocation',
      name: 'Asset Allocation',
      icon: <PieChart className="w-4 h-4" />,
      description: 'Visual breakdown by asset class and sector',
      enabled: true,
      customNotes: ''
    },
    {
      id: 'sector-map',
      name: 'Sector Analysis',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Sector concentration and diversification analysis',
      enabled: false,
      customNotes: ''
    },
    {
      id: 'top-holdings',
      name: 'Top Holdings',
      icon: <Star className="w-4 h-4" />,
      description: 'Focus on largest positions and concentration risk',
      enabled: false,
      customNotes: ''
    }
  ]);

  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [reportTitle, setReportTitle] = useState('Portfolio Analysis Report');
  const [advisorNotes, setAdvisorNotes] = useState('');

  // Calculate summary statistics
  const summaryStats = {
    totalValue: currentPortfolio.totalValue,
    beta: currentMetrics.beta,
    yield: currentMetrics.yield,
    volatility: currentMetrics.volatility,
    topSectors: getTopSectors(currentPortfolio.holdings, marketData),
    holdingsCount: currentPortfolio.holdings.length,
    riskLevel: getRiskLevel(currentMetrics.beta)
  };

  function getTopSectors(holdings: Portfolio['holdings'], marketData: Record<string, any>) {
    const sectorMap = new Map<string, number>();
    
    holdings.forEach(holding => {
      const sector = marketData[holding.symbol]?.sector || 'Technology';
      const value = sectorMap.get(sector) || 0;
      sectorMap.set(sector, value + holding.allocation);
    });

    return Array.from(sectorMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sector, allocation]) => ({ sector, allocation }));
  }

  function getRiskLevel(beta: number) {
    if (beta < 0.7) return { level: "Conservative", color: "text-green-600" };
    if (beta < 1.0) return { level: "Moderate", color: "text-blue-600" };
    if (beta < 1.3) return { level: "Growth", color: "text-orange-600" };
    return { level: "Aggressive", color: "text-red-600" };
  }

  const enabledSections = reportSections.filter(section => section.enabled);

  const exportToPDF = () => {
    console.log('Exporting comprehensive advisor report with sections:', enabledSections.map(s => s.name));
    // This would generate a branded PDF with selected sections
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Portfolio Summary Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(summaryStats.totalValue)}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{summaryStats.beta.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Portfolio Beta</div>
              <Badge className={`mt-1 ${summaryStats.riskLevel.color}`} variant="outline">
                {summaryStats.riskLevel.level}
              </Badge>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{formatPercentage(summaryStats.yield)}</div>
              <div className="text-sm text-muted-foreground">Portfolio Yield</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{summaryStats.holdingsCount}</div>
              <div className="text-sm text-muted-foreground">Holdings</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Top Sectors</h4>
            <div className="flex gap-4">
              {summaryStats.topSectors.map((sector, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{sector.sector}:</span> {formatPercentage(sector.allocation)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Detailed Holdings Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Source: Market data from Finnhub API, benchmark comparisons vs. SPY/AGG
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Ticker</th>
                  <th className="text-left p-2 text-sm font-medium">Name</th>
                  <th className="text-left p-2 text-sm font-medium">Sector</th>
                  <th className="text-right p-2 text-sm font-medium">Allocation</th>
                  <th className="text-right p-2 text-sm font-medium">Beta</th>
                  <th className="text-right p-2 text-sm font-medium">Yield</th>
                  <th className="text-right p-2 text-sm font-medium">1yr</th>
                  <th className="text-right p-2 text-sm font-medium">3yr</th>
                  <th className="text-right p-2 text-sm font-medium">5yr</th>
                </tr>
              </thead>
              <tbody>
                {currentPortfolio.holdings.map((holding, index) => {
                  const data = marketData[holding.symbol] || {};
                  return (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-2 text-sm font-medium">{holding.symbol}</td>
                      <td className="p-2 text-sm">{holding.name}</td>
                      <td className="p-2 text-sm">{data.sector || 'Technology'}</td>
                      <td className="p-2 text-sm text-right">{formatPercentage(holding.allocation)}</td>
                      <td className="p-2 text-sm text-right">{data.beta ? data.beta.toFixed(2) : 'N/A'}</td>
                      <td className="p-2 text-sm text-right">{data.yield ? formatPercentage(data.yield) : 'N/A'}</td>
                      <td className={`p-2 text-sm text-right ${(data.oneYearReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.oneYearReturn ? formatPercentage(data.oneYearReturn) : 'N/A'}
                      </td>
                      <td className="p-2 text-sm text-right">{data.threeYearReturn ? formatPercentage(data.threeYearReturn) : 'N/A'}</td>
                      <td className="p-2 text-sm text-right">{data.fiveYearReturn ? formatPercentage(data.fiveYearReturn) : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Report Title</label>
            <Input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Advisor Notes</label>
            <Textarea
              value={advisorNotes}
              onChange={(e) => setAdvisorNotes(e.target.value)}
              placeholder="Add general notes or commentary for the entire report..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Dialog open={showSectionSelector} onOpenChange={setShowSectionSelector}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configure Sections ({enabledSections.length})
                </Button>
              </DialogTrigger>
              <ReportSectionSelector
                sections={reportSections}
                onSectionsChange={setReportSections}
                onClose={() => setShowSectionSelector(false)}
              />
            </Dialog>
            
            <Button onClick={exportToPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Branded PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Sections Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sections will appear in this order in the final report
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {enabledSections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">{index + 1}.</div>
                <div className="text-primary">{section.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{section.name}</div>
                  {section.customNotes && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Note: {section.customNotes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {enabledSections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sections selected. Configure sections to build your report.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Compliance Disclosure</h4>
              <p className="text-sm text-orange-700 mt-1">
                This report is generated for informational purposes only and does not constitute investment advice. 
                Past performance does not guarantee future results. All data sources are clearly attributed. 
                Market data provided by Finnhub. Benchmark comparisons use SPY (S&P 500) and AGG (US Aggregate Bonds) as applicable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}