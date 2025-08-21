import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Crown, Download } from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getReports, getReportConfig, AVAILABLE_REPORTS } from '@/features/reports/config';

export default function ReportsPage() {
  const { persona, tier } = usePersonalizationStore();
  const availableReports = getReports(persona, tier);
  
  const foundationalReports = availableReports.filter(id => 
    getReportConfig(id)?.tier === 'foundational'
  );
  const advancedReports = availableReports.filter(id => 
    getReportConfig(id)?.tier === 'advanced'
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <TrendingUp className="h-5 w-5" />;
      case 'tax':
        return <FileText className="h-5 w-5" />;
      case 'entity':
        return <BarChart3 className="h-5 w-5" />;
      case 'estate':
        return <Crown className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId);
    // In real implementation, this would trigger report generation
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports based on your {persona} profile
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={tier === 'advanced' ? 'default' : 'outline'}>
            {tier} tier
          </Badge>
          <span className="text-sm text-muted-foreground">
            {availableReports.length} reports available
          </span>
        </div>
      </div>

      {/* Foundational Reports */}
      {foundationalReports.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Essential Reports</h2>
            <Badge variant="outline">Foundational</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foundationalReports.map((reportId) => {
              const config = getReportConfig(reportId);
              if (!config) return null;
              
              return (
                <Card key={reportId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(config.category)}
                      {config.title}
                    </CardTitle>
                    <CardDescription>
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {config.category}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => handleGenerateReport(reportId)}
                      className="w-full"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Reports */}
      {tier === 'advanced' && advancedReports.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Advanced Reports</h2>
            <Badge className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Advanced
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedReports.map((reportId) => {
              const config = getReportConfig(reportId);
              if (!config) return null;
              
              return (
                <Card key={reportId} className="hover:shadow-md transition-shadow border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(config.category)}
                      {config.title}
                    </CardTitle>
                    <CardDescription>
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {config.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Advanced
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => handleGenerateReport(reportId)}
                      className="w-full"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Report Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{foundationalReports.length}</div>
              <div className="text-sm text-muted-foreground">Essential</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{advancedReports.length}</div>
              <div className="text-sm text-muted-foreground">Advanced</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{AVAILABLE_REPORTS.length}</div>
              <div className="text-sm text-muted-foreground">Total Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round((availableReports.length / AVAILABLE_REPORTS.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Access Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Debug: Report Access Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Current Persona:</strong> {persona}
          </div>
          <div>
            <strong>Current Tier:</strong> {tier}
          </div>
          <div>
            <strong>Available Reports:</strong> [{availableReports.join(', ')}]
          </div>
          <div>
            <strong>Foundational:</strong> [{foundationalReports.join(', ')}]
          </div>
          <div>
            <strong>Advanced:</strong> [{advancedReports.join(', ')}]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}