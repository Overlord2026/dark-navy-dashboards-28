
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Play, 
  Camera, 
  Laptop, 
  Smartphone, 
  Tablet, 
  BadgeCheck, 
  X,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useVisualTesting } from '@/hooks/useVisualTesting';
import { VisualTestConfig } from '@/types/visualTesting';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { logger } from '@/services/logging/loggingService';

export function VisualTestingRunner() {
  const { 
    isRunning, 
    results, 
    error, 
    runTests, 
    getTestSummary 
  } = useVisualTesting();
  
  const [threshold, setThreshold] = useState([3]); // 3% by default
  const [includeDesktop, setIncludeDesktop] = useState(true);
  const [includeTablet, setIncludeTablet] = useState(true);
  const [includeMobile, setIncludeMobile] = useState(true);
  
  const summary = getTestSummary();
  
  const handleRunTests = async () => {
    // Build the test configuration
    const viewports = [];
    
    if (includeDesktop) {
      viewports.push({ width: 1440, height: 900, deviceType: 'desktop' as const });
    }
    
    if (includeTablet) {
      viewports.push({ width: 768, height: 1024, deviceType: 'tablet' as const });
    }
    
    if (includeMobile) {
      viewports.push({ width: 375, height: 667, deviceType: 'mobile' as const });
    }
    
    if (viewports.length === 0) {
      toast.error('Please select at least one device type');
      return;
    }
    
    // List of pages to test
    const pagesToTest = [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Accounts', url: '/accounts' },
      { name: 'Investments', url: '/investments' }
    ];
    
    // Create configuration with selected viewports for each page
    const config: VisualTestConfig = {
      threshold: threshold[0],
      pages: pagesToTest.map(page => ({
        ...page,
        viewports: viewports
      }))
    };
    
    logger.info('Starting visual tests with config', { config }, 'VisualTestingRunner');
    toast.info(`Starting visual tests for ${pagesToTest.length} pages x ${viewports.length} device types`);
    
    try {
      const results = await runTests(config);
      
      if (results) {
        const failedTests = results.filter(r => !r.passed).length;
        
        if (failedTests > 0) {
          toast.warning(`Found ${failedTests} visual regression issues`, {
            description: 'Check the results tab for details',
            duration: 5000
          });
        } else {
          toast.success('All visual tests passed', {
            description: `${results.length} total tests completed successfully`,
            duration: 3000
          });
        }
      }
    } catch (error) {
      toast.error('Failed to run visual tests', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Visual Testing Runner
            </CardTitle>
            <CardDescription>
              Capture visual snapshots of key pages and compare against baselines
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="setup">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Device Types</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the device types to test
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="desktop" 
                      checked={includeDesktop} 
                      onCheckedChange={setIncludeDesktop}
                    />
                    <div className="flex items-center space-x-2">
                      <Laptop className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="desktop">Desktop (1440x900)</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="tablet" 
                      checked={includeTablet} 
                      onCheckedChange={setIncludeTablet}
                    />
                    <div className="flex items-center space-x-2">
                      <Tablet className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="tablet">Tablet (768x1024)</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="mobile" 
                      checked={includeMobile} 
                      onCheckedChange={setIncludeMobile}
                    />
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="mobile">Mobile (375x667)</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Difference Threshold: {threshold[0]}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {threshold[0] < 1 ? 'Strict' : threshold[0] < 5 ? 'Moderate' : 'Lenient'}
                  </span>
                </div>
                <Slider
                  defaultValue={[3]}
                  max={10}
                  step={0.5}
                  value={threshold}
                  onValueChange={setThreshold}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum allowed percentage difference between baseline and current snapshot
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold">{summary.totalTests}</div>
                      <div className="text-sm font-medium text-muted-foreground">Total Tests</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">{summary.passedTests}</div>
                      <div className="text-sm font-medium text-muted-foreground">Passed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.failedTests}</div>
                      <div className="text-sm font-medium text-muted-foreground">Failed</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="overflow-auto border rounded-md">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-2">Page</th>
                        <th className="text-left px-4 py-2">Device</th>
                        <th className="text-left px-4 py-2">Difference</th>
                        <th className="text-left px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.id} className="border-t">
                          <td className="px-4 py-2">{result.pageUrl}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center space-x-2">
                              {result.viewport.deviceType === 'desktop' && <Laptop className="h-4 w-4" />}
                              {result.viewport.deviceType === 'tablet' && <Tablet className="h-4 w-4" />}
                              {result.viewport.deviceType === 'mobile' && <Smartphone className="h-4 w-4" />}
                              <span>{result.viewport.deviceType}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{result.misMatchPercentage.toFixed(2)}%</td>
                          <td className="px-4 py-2">
                            {result.passed ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <BadgeCheck className="h-3 w-3 mr-1" /> Passed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                <X className="h-3 w-3 mr-1" /> Failed
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-6 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
                <X className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Error Running Tests</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No Tests Run</h3>
                <p className="text-sm">Run visual tests to see results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length > 0 ? `Last run: ${new Date().toLocaleTimeString()}` : 'Ready to run tests'}
        </p>
        <Button 
          onClick={handleRunTests} 
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Visual Tests
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
