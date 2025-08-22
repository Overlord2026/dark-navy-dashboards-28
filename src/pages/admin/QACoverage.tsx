import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Download, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { validateConfigs, validateRoutes, exportCoverageCSV, exportDetailedCSV, getValidationStats, type Issue, type CoverageMatrix } from '@/utils/configValidator';
import { validateFamilyTools, getFamilyToolsValidationStatus, formatValidationResults } from '@/tools/validateFamilyTools';
import { FAMILY_SEGMENTS } from '@/data/familySegments';

const SOLUTIONS = [
  { key: 'investments', title: 'Investments' },
  { key: 'annuities', title: 'Annuities' },
  { key: 'insurance', title: 'Insurance' },
  { key: 'tax', title: 'Tax Planning' },
  { key: 'estate', title: 'Estate' },
  { key: 'health', title: 'Health & Longevity' },
  { key: 'practice', title: 'Practice Management' },
  { key: 'compliance', title: 'Compliance' },
  { key: 'nil', title: 'NIL' }
];

export default function QACoverage() {
  const [validation, setValidation] = useState<{
    issues: Issue[];
    coverage: CoverageMatrix;
  } | null>(null);
  const [routeIssues, setRouteIssues] = useState<Issue[]>([]);
  const [familyValidation, setFamilyValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingRoutes, setCheckingRoutes] = useState(false);

  useEffect(() => {
    runValidation();
  }, []);

  const runValidation = async () => {
    setLoading(true);
    try {
      const result = validateConfigs();
      setValidation(result);
      
      // Also run family tools validation
      const familyResult = validateFamilyTools();
      setFamilyValidation(familyResult);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRoutes = async () => {
    setCheckingRoutes(true);
    try {
      const issues = await validateRoutes();
      setRouteIssues(issues);
    } catch (error) {
      console.error('Route validation failed:', error);
    } finally {
      setCheckingRoutes(false);
    }
  };

  const handleExportCSV = () => {
    if (!validation) return;
    
    const csv = exportCoverageCSV(validation.coverage);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa-coverage-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDetailedCSV = () => {
    if (!validation) return;
    
    const csv = exportDetailedCSV(validation.coverage);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa-coverage-detailed.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openRoute = (route: string) => {
    window.open(route, '_blank');
  };

  const getCoverageColor = (count: number) => {
    if (count === 0) return 'destructive';
    if (count < 3) return 'secondary';
    return 'default';
  };

  const getCoverageIcon = (count: number) => {
    if (count === 0) return <XCircle className="w-4 h-4" />;
    if (count < 3) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!validation) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Failed to run validation. Check console for errors.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allIssues = [...validation.issues, ...routeIssues];
  const stats = getValidationStats(allIssues);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Coverage Dashboard</h1>
          <p className="text-muted-foreground">
            Validate configs and check coverage across personas and solutions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={checkRoutes} disabled={checkingRoutes} variant="outline" className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${checkingRoutes ? 'animate-spin' : ''}`} />
            Check Routes
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportDetailedCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Detailed CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.warningCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Catalog Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.catalogIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coverageIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Route Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.routeIssues}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coverage" className="w-full">
        <TabsList>
          <TabsTrigger value="coverage">Coverage Matrix</TabsTrigger>
          <TabsTrigger value="family">Family Tools</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persona × Solution Coverage</CardTitle>
              <CardDescription>
                Number of tools available for each persona/solution combination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Persona</th>
                      {SOLUTIONS.map(solution => (
                        <th key={solution.key} className="text-center p-2 border-b min-w-[100px]">
                          {solution.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FAMILY_SEGMENTS.map(segment => (
                      <tr key={segment.slug}>
                        <td className="p-2 border-b font-medium">{segment.title}</td>
                        {SOLUTIONS.map(solution => {
                          const coverage = validation.coverage[segment.slug]?.[solution.key];
                          const count = coverage?.count || 0;
                          return (
                            <td key={solution.key} className="p-2 border-b text-center">
                              <Badge 
                                variant={getCoverageColor(count)}
                                className="flex items-center gap-1 justify-center"
                              >
                                {getCoverageIcon(count)}
                                {count}
                              </Badge>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Family Tools Validation
                <Badge variant={getFamilyToolsValidationStatus() === 'pass' ? 'default' : 
                              getFamilyToolsValidationStatus() === 'warning' ? 'secondary' : 'destructive'}>
                  {getFamilyToolsValidationStatus().toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                Validation of familyTools.json against catalogConfig.json
              </CardDescription>
            </CardHeader>
            <CardContent>
              {familyValidation && (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{familyValidation.summary.totalTools}</div>
                      <div className="text-sm text-muted-foreground">Total Tools</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{familyValidation.summary.validTools}</div>
                      <div className="text-sm text-muted-foreground">Valid Tools</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{familyValidation.errors.length}</div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{familyValidation.warnings.length}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                  </div>

                  {/* Issues List */}
                  {(familyValidation.errors.length > 0 || familyValidation.warnings.length > 0) && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Issues</h4>
                      {[...familyValidation.errors, ...familyValidation.warnings].map((issue: any, index: number) => (
                        <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            <div className="flex justify-between items-start">
                              <div>
                                <strong>{issue.segment ? `${issue.segment}: ` : ''}</strong>
                                {issue.message}
                                {issue.location && <div className="text-xs text-muted-foreground mt-1">Location: {issue.location}</div>}
                              </div>
                              {issue.toolKey && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {issue.toolKey}
                                </Badge>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {/* Success Message */}
                  {familyValidation.errors.length === 0 && familyValidation.warnings.length === 0 && (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        All family tools configuration is valid! All tool keys exist in catalog and routes are properly configured.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {allIssues.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Issues Found</h3>
                  <p className="text-muted-foreground">All configurations are valid!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {allIssues.map((issue, index) => (
                <Alert key={index} variant={issue.level === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <strong>{issue.where}:</strong> {issue.message}
                    </div>
                    {issue.ref && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoute(issue.ref!)}
                        className="ml-4 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}