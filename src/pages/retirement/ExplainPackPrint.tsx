import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { CoverPage } from '@/components/retirement/print/CoverPage';
import { ExecutiveSummary } from '@/components/retirement/print/ExecutiveSummary';
import { InputsOverview } from '@/components/retirement/print/InputsOverview';
import { PolicyConfiguration } from '@/components/retirement/print/PolicyConfiguration';
import { AnalysisResults } from '@/components/retirement/print/AnalysisResults';
import { AssumptionsPage } from '@/components/retirement/print/AssumptionsPage';
import { DisclosuresPage } from '@/components/retirement/print/DisclosuresPage';
import type { SwagExplainPack } from '@/lib/explainpack';
import type { RetirementAnalysisResults } from '@/types/retirement';

interface PrintData {
  explainPack: SwagExplainPack;
  currentResult: RetirementAnalysisResults;
}

export default function ExplainPackPrint() {
  const [data, setData] = useState<PrintData | null>(null);

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem('swag-print-data');
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
        // Clear after loading
        sessionStorage.removeItem('swag-print-data');
      } catch (error) {
        console.error('Failed to parse print data:', error);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading print view...</div>
          <div className="text-sm text-muted-foreground">
            Preparing your retirement analysis report
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="print-document bg-background text-foreground">
      {/* Cover Page */}
      <CoverPage explainPack={data.explainPack} />
      
      {/* Executive Summary */}
      <ExecutiveSummary 
        explainPack={data.explainPack}
        result={data.currentResult}
      />
      
      {/* Inputs */}
      <InputsOverview inputs={data.explainPack.inputs} />
      
      {/* Policy */}
      <PolicyConfiguration policy={data.explainPack.policy} />
      
      {/* Results */}
      <AnalysisResults 
        summary={data.explainPack.summary}
        result={data.currentResult}
      />
      
      {/* Assumptions */}
      <AssumptionsPage />
      
      {/* Disclosures */}
      <DisclosuresPage explainPack={data.explainPack} />
      
      {/* Print Button (visible on screen, hidden in print) */}
      <div className="no-print fixed bottom-4 right-4 z-50">
        <Button onClick={() => window.print()} size="lg" className="shadow-lg">
          <Printer className="mr-2 h-5 w-5" />
          Print to PDF
        </Button>
      </div>
    </div>
  );
}
