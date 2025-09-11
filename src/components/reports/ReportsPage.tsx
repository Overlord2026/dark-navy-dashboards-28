import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Building2, Calculator, Coins, Heart, Users } from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getReports, getReportConfig, AVAILABLE_REPORTS } from '@/features/reports/config';
import { useNavigate } from 'react-router-dom';

const getReportIcon = (category: string, reportId: string) => {
  switch (category) {
    case 'financial':
      if (reportId === 'netWorth') return <BarChart3 className="h-5 w-5" />;
      if (reportId === 'spending') return <TrendingUp className="h-5 w-5" />;
      if (reportId === 'reEquityRollup') return <Coins className="h-5 w-5" />;
      return <FileText className="h-5 w-5" />;
    case 'entity':
      return <Building2 className="h-5 w-5" />;
    case 'tax':
      if (reportId === 'charitableSummary') return <Heart className="h-5 w-5" />;
      return <Calculator className="h-5 w-5" />;
    case 'estate':
      return <Users className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getTierBadgeColor = (tier: string) => {
  return tier === 'advanced' ? 'default' : 'secondary';
};

export const ReportsPage: React.FC = () => {
  const { persona, tier } = usePersonalizationStore();
  const navigate = useNavigate();
  
  const availableReports = getReports(persona, tier);
  const foundationalReports = availableReports.filter(id => 
    AVAILABLE_REPORTS.find(r => r.id === id)?.tier === 'foundational'
  );
  const advancedReports = availableReports.filter(id => 
    AVAILABLE_REPORTS.find(r => r.id === id)?.tier === 'advanced'
  );

  const handleReportClick = (reportId: string) => {
    // Log report access event
    console.info('report.accessed', {
      reportId,
      persona,
      tier,
      timestamp: new Date().toISOString()
    });
    
    // Navigate to specific report or general reports area
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive financial insights based on your {persona} profile
          </p>
        </div>
      </div>

      {/* Foundational Reports */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Essential Reports</h2>
          <Badge variant="secondary" className="text-xs">
            {foundationalReports.length}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundationalReports.map((reportId) => {
            const config = getReportConfig(reportId);
            if (!config) return null;
            
            return (
              <Card 
                key={reportId} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleReportClick(reportId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getReportIcon(config.category, reportId)}
                      <CardTitle className="text-lg">{config.title}</CardTitle>
                    </div>
                    {config.tier !== 'foundational' && (
                      <Badge variant={getTierBadgeColor(config.tier)} className="text-xs">
                        {config.tier}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Advanced Reports */}
      {advancedReports.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Advanced Reports</h2>
            <Badge variant="default" className="text-xs">
              Family Office
            </Badge>
            <Badge variant="outline" className="text-xs">
              {advancedReports.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedReports.map((reportId) => {
              const config = getReportConfig(reportId);
              if (!config) return null;
              
              return (
                <Card 
                  key={reportId} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-primary/20"
                  onClick={() => handleReportClick(reportId)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getReportIcon(config.category, reportId)}
                        <CardTitle className="text-lg">{config.title}</CardTitle>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Advanced
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button size="sm" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade Notice */}
      {tier === 'foundational' && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Family Office Reports
            </CardTitle>
            <CardDescription>
              Unlock advanced reports including Entity & Trust Mapping, K-1 Summary, 
              Real Estate & Equity Rollup, and Charitable Giving Summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing?feature=advanced_reports&plan_hint=premium')}
            >
              Upgrade to Access
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};