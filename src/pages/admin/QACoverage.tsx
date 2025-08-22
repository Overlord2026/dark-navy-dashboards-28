import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { validateConfigs, exportCoverageCSV, type ValidationResult } from '@/utils/validateConfigs';
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
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runValidation = async () => {
      setLoading(true);
      try {
        const result = validateConfigs();
        setValidation(result);
      } catch (error) {
        console.error('Validation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    runValidation();
  }, []);

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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Coverage Dashboard</h1>
          <p className="text-muted-foreground">
            Validate configs and check coverage across personas and solutions
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validation.stats.totalTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validation.stats.readyTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{validation.stats.betaTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{validation.stats.errorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{validation.stats.warningCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coverage" className="w-full">
        <TabsList>
          <TabsTrigger value="coverage">Coverage Matrix</TabsTrigger>
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

        <TabsContent value="issues" className="space-y-4">
          {validation.issues.length === 0 ? (
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
              {validation.issues.map((issue, index) => (
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