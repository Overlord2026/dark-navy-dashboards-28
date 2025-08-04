import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Users,
  ExternalLink
} from 'lucide-react';

interface QATestResultsProps {
  complianceResults: any;
  onboardingResults: any;
}

export function QATestResults({ complianceResults, onboardingResults }: QATestResultsProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Pass</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/10 text-red-700 border-red-500/20">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatSectionName = (sectionKey: string) => {
    return sectionKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderSystemResults = (
    title: string, 
    icon: React.ElementType, 
    results: any, 
    systemPrefix: string
  ) => {
    if (!results) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              {React.createElement(icon, { className: "h-5 w-5" })}
              <span>No {title.toLowerCase()} test results available</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    const allTests = Object.values(results).flat() as any[];
    const passed = allTests.filter(t => t.status === 'pass').length;
    const failed = allTests.filter(t => t.status === 'fail').length;
    const warnings = allTests.filter(t => t.status === 'warning').length;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(icon, { className: "h-5 w-5 text-primary" })}
              {title}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{allTests.length} tests</Badge>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                {passed} passed
              </Badge>
              {failed > 0 && (
                <Badge className="bg-red-500/10 text-red-700 border-red-500/20">
                  {failed} failed
                </Badge>
              )}
              {warnings > 0 && (
                <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                  {warnings} warnings
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(results).map(([sectionKey, tests]: [string, any]) => {
            const sectionId = `${systemPrefix}-${sectionKey}`;
            const isOpen = openSections[sectionId];
            const sectionTests = tests as any[];
            const sectionPassed = sectionTests.filter(t => t.status === 'pass').length;
            const sectionFailed = sectionTests.filter(t => t.status === 'fail').length;

            return (
              <Collapsible key={sectionKey} open={isOpen} onOpenChange={() => toggleSection(sectionId)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">{formatSectionName(sectionKey)}</span>
                      <Badge variant="outline" className="ml-2">
                        {sectionTests.length} tests
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {sectionPassed > 0 && (
                        <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs">
                          {sectionPassed}✓
                        </Badge>
                      )}
                      {sectionFailed > 0 && (
                        <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs">
                          {sectionFailed}✗
                        </Badge>
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2">
                  {sectionTests.map((test: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium text-sm">{test.name}</div>
                          <div className="text-xs text-muted-foreground">{test.message}</div>
                          {test.route && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <ExternalLink className="h-3 w-3" />
                              {test.route}
                            </div>
                          )}
                          {test.error && (
                            <div className="text-xs text-red-600 mt-1">
                              Error: {test.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(test.status)}
                        <Badge variant="outline" className="text-xs">
                          {test.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderSystemResults(
        'Compliance Management System',
        Shield,
        complianceResults,
        'compliance'
      )}

      {renderSystemResults(
        'Mass Onboarding & Migration',
        Users,
        onboardingResults,
        'onboarding'
      )}
    </div>
  );
}