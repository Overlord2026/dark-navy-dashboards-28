import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PortfolioReportPDF from "@/components/portfolio/PortfolioReportPDF";
import { FileText, Download, Eye, Settings } from 'lucide-react';

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
  riskScore: number;
}

interface ReportSection {
  id: string;
  label: string;
  checked: boolean;
  description: string;
}

const DEFAULT_SECTIONS: ReportSection[] = [
  { 
    id: 'summary', 
    label: 'Executive Summary', 
    checked: true,
    description: 'High-level portfolio overview and key metrics'
  },
  { 
    id: 'holdings', 
    label: 'Holdings Table', 
    checked: true,
    description: 'Detailed breakdown of all portfolio holdings'
  },
  { 
    id: 'risk', 
    label: 'Risk & Return Analysis', 
    checked: true,
    description: 'Portfolio vs. benchmark performance and risk metrics'
  },
  { 
    id: 'income', 
    label: 'Income/Yield Analysis', 
    checked: false,
    description: 'Dividend yield and income generation analysis'
  },
  { 
    id: 'allocation', 
    label: 'Asset Allocation', 
    checked: false,
    description: 'Visual breakdown by asset class and sector'
  },
  { 
    id: 'sector', 
    label: 'Sector/Region Map', 
    checked: false,
    description: 'Sector concentration and diversification analysis'
  },
  { 
    id: 'notes', 
    label: 'Advisor Notes', 
    checked: true,
    description: 'Custom commentary and recommendations'
  },
];

interface PortfolioReportBuilderProps {
  portfolio: Portfolio;
  proposal?: Portfolio;
  benchmarks?: any;
  currentMetrics: PortfolioMetrics;
  proposedMetrics?: PortfolioMetrics;
  marketData: Record<string, any>;
  clientName: string;
  onDownload?: () => void;
}

export default function PortfolioReportBuilder({ 
  portfolio, 
  proposal, 
  benchmarks, 
  currentMetrics,
  proposedMetrics,
  marketData,
  clientName,
  onDownload 
}: PortfolioReportBuilderProps) {
  const [sections, setSections] = useState<ReportSection[]>(DEFAULT_SECTIONS);
  const [advisorNotes, setAdvisorNotes] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  // Handles section selection logic
  const handleSectionToggle = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, checked: !s.checked } : s
    ));
  };

  const selectedSections = sections.filter(s => s.checked).map(s => s.id);
  const enabledSectionsCount = selectedSections.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Portfolio Report Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure and generate professional portfolio reports with live preview and PDF export
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-4 h-4" />
                Report Sections ({enabledSectionsCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map(section => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={section.id}
                      checked={section.checked}
                      onCheckedChange={() => handleSectionToggle(section.id)}
                    />
                    <label 
                      htmlFor={section.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {section.label}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    {section.description}
                  </p>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-2">
                  Advisor Notes
                </label>
                <Textarea
                  value={advisorNotes}
                  onChange={e => setAdvisorNotes(e.target.value)}
                  placeholder="Add custom commentary, recommendations, or notes that will appear in the report..."
                  rows={4}
                  className="text-sm"
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                
                <PDFDownloadLink
                  document={
                    <PortfolioReportPDF
                      portfolio={portfolio}
                      proposal={proposal}
                      benchmarks={benchmarks}
                      sections={selectedSections}
                      advisorNotes={advisorNotes}
                      currentMetrics={currentMetrics}
                      proposedMetrics={proposedMetrics}
                      marketData={marketData}
                      clientName={clientName}
                    />
                  }
                  fileName={`Portfolio_Review_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                  className="w-full"
                >
                  {({ loading }) => (
                    <Button 
                      disabled={loading || enabledSectionsCount === 0} 
                      className="w-full flex items-center gap-2"
                      onClick={onDownload}
                    >
                      <Download className="w-4 h-4" />
                      {loading ? "Generating PDF..." : "Download PDF Report"}
                    </Button>
                  )}
                </PDFDownloadLink>
                
                {enabledSectionsCount === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Select at least one section to generate report
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-4 h-4" />
                  Live Preview
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This preview shows how your PDF report will look
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-4 shadow-sm max-h-[600px] overflow-y-auto">
                  <PortfolioReportPDF
                    portfolio={portfolio}
                    proposal={proposal}
                    benchmarks={benchmarks}
                    sections={selectedSections}
                    advisorNotes={advisorNotes}
                    previewMode={true}
                    currentMetrics={currentMetrics}
                    proposedMetrics={proposedMetrics}
                    marketData={marketData}
                    clientName={clientName}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}