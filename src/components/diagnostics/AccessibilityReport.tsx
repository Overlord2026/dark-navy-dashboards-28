
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Cell,
  Tooltip,
  PieChart,
  Pie 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Check, FileText, HelpCircle, Lightbulb, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AccessibilityAuditResult, 
  AccessibilityAuditSummary 
} from '@/types/accessibility';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AccessibilityReportProps {
  results: AccessibilityAuditResult[];
  summary: AccessibilityAuditSummary;
}

export function AccessibilityReport({ results, summary }: AccessibilityReportProps) {
  // Group issues by rule category for analysis
  const issuesByCategory = results.reduce<Record<string, AccessibilityAuditResult[]>>((acc, issue) => {
    const category = issue.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {});
  
  // Group issues by page for analysis
  const issuesByPage = results.reduce<Record<string, AccessibilityAuditResult[]>>((acc, issue) => {
    const path = new URL(issue.url).pathname;
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(issue);
    return acc;
  }, {});
  
  // Prepare data for charts
  const impactData = [
    { name: 'Critical', value: summary.critical, color: '#f43f5e' },
    { name: 'Serious', value: summary.serious, color: '#f97316' },
    { name: 'Moderate', value: summary.moderate, color: '#eab308' },
    { name: 'Minor', value: summary.minor, color: '#3b82f6' }
  ];
  
  const categoryData = Object.entries(issuesByCategory).map(([category, issues]) => ({
    name: category,
    count: issues.length,
    color: getCategoryColor(category)
  }));
  
  const pageData = Object.entries(issuesByPage)
    .map(([path, issues]) => ({
      name: path,
      count: issues.length,
      color: '#8b5cf6'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'ARIA': return '#8b5cf6';
      case 'Contrast': return '#ec4899';
      case 'Keyboard': return '#06b6d4';
      case 'Forms': return '#14b8a6';
      case 'Images': return '#22c55e';
      case 'Structure': return '#f59e0b';
      default: return '#64748b';
    }
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const renderNoDataView = () => {
    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <HelpCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Audit Data</h3>
          <p className="text-muted-foreground max-w-md">
            Run an accessibility audit first to generate a report
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {renderNoDataView()}
      
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">{summary.total}</CardTitle>
                <CardDescription>Total Issues</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-red-600 dark:text-red-400">{summary.critical}</CardTitle>
                <CardDescription>Critical Issues</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-amber-600 dark:text-amber-400">{summary.serious}</CardTitle>
                <CardDescription>Serious Issues</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">{summary.urlsTested}</CardTitle>
                <CardDescription>Pages Tested</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Issues by Page</CardTitle>
                <CardDescription>
                  Top 10 pages with the most accessibility issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pageData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={150}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} issues`, 'Count']}
                        labelFormatter={(label) => `Page: ${label}`}
                      />
                      <Bar dataKey="count" fill="#8884d8">
                        {pageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Issues by Impact</CardTitle>
                <CardDescription>
                  Distribution of issues by severity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                      >
                        {impactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} issues`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Recommendations</CardTitle>
              <CardDescription>
                Prioritized action items based on audit results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="critical">
                  <AccordionTrigger className="font-medium text-destructive">
                    Critical Issues to Fix First
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="space-y-4">
                        {results.filter(issue => issue.impact === 'critical').map(issue => (
                          <div key={issue.id} className="border-l-4 border-destructive pl-4 py-2">
                            <div className="font-medium">{issue.rule}</div>
                            <div className="text-sm mt-1">{issue.message}</div>
                            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                              <div>Page: {new URL(issue.url).pathname}</div>
                              <div>Element: <code>{issue.element}</code></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="serious">
                  <AccordionTrigger className="font-medium text-amber-500">
                    Serious Issues to Address
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="space-y-4">
                        {results.filter(issue => issue.impact === 'serious').map(issue => (
                          <div key={issue.id} className="border-l-4 border-amber-500 pl-4 py-2">
                            <div className="font-medium">{issue.rule}</div>
                            <div className="text-sm mt-1">{issue.message}</div>
                            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                              <div>Page: {new URL(issue.url).pathname}</div>
                              <div>Element: <code>{issue.element}</code></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="general">
                  <AccordionTrigger>
                    General Recommendations
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-6">
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="h-4 w-4 mt-1 text-yellow-500" />
                        <p>Review components with the most accessibility issues first, especially forms and interactive elements.</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="h-4 w-4 mt-1 text-yellow-500" />
                        <p>Implement a process for testing accessibility early in the development cycle.</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="h-4 w-4 mt-1 text-yellow-500" />
                        <p>Consider adding automated accessibility testing to your CI/CD pipeline.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Audit Details</CardTitle>
              <CardDescription>
                Information about this accessibility audit run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Audit Date</h4>
                    <p>{formatDate(summary.timestamp)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Pages Tested</h4>
                    <p>{summary.urlsTested}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Standards</h4>
                    <p>WCAG 2.1 AA</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="ml-auto gap-2" variant="outline">
                <FileText className="h-4 w-4" />
                Export Full Report
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
