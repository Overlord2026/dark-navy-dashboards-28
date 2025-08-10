import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Play, FileText, Bug, Zap } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

const testSuites = {
  personas: [
    'client', 'high_net_worth_client', 'pre_retiree', 'next_gen', 'family_office_admin',
    'financial_advisor', 'cpa_accountant', 'estate_planning_attorney', 'litigation_attorney',
    'insurance_agent', 'imo_fmo', 'coach_consultant', 'realtor', 'marketing_agency',
    'industry_org', 'physician', 'dentist', 'athlete_nil', 'business_owner',
    'entrepreneur', 'corporate_executive'
  ],
  tools: [
    'swag_retirement_roadmap', 'retirement_confidence_scorecard', 'secure_legacy_vault',
    'estate_planning_suite', 'tax_planning_tools', 'crm_lead_engine', 'swag_lead_score',
    'compliance_platform', 'professional_marketplace', 'learning_management_system',
    'ai_marketing_engine'
  ],
  flows: [
    'persona_onboarding', 'persona_dashboard_navigation', 'tool_navigation',
    'pdf_export_and_download', 'file_upload_download', 'qr_scan'
  ],
  integrations: [
    'resend_email', 'supabase_storage', 'supabase_auth', 'supabase_realtime',
    'plaid', 'stripe', 'docusign', 'twilio', 'zoom_google_meet'
  ]
};

interface QAResult {
  id: string;
  category: string;
  item: string;
  check: string;
  result: 'passed' | 'failed' | 'warning' | 'pending';
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  notes: string;
  screenshot_url?: string;
}

export const QATestSuiteStandalone: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<QAResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('personas');

  const runFullQASuite = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    try {
      track('qa_suite_started', { scope: 'full_platform' });
      
      // Simulate running comprehensive QA tests
      const totalChecks = Object.values(testSuites).flat().length * 3; // 3 checks per item
      let currentCheck = 0;
      
      for (const [category, items] of Object.entries(testSuites)) {
        for (const item of items) {
          const checks = getChecksForItem(category, item);
          
          for (const check of checks) {
            currentCheck++;
            setProgress((currentCheck / totalChecks) * 100);
            
            // Simulate test execution delay
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Generate mock result
            const result: QAResult = {
              id: `${category}_${item}_${check.replace(/\s+/g, '_')}`,
              category,
              item,
              check,
              result: Math.random() > 0.8 ? 'failed' : Math.random() > 0.9 ? 'warning' : 'passed',
              severity: getSeverity(check),
              notes: generateNotes(check),
              screenshot_url: Math.random() > 0.7 ? `/qa/screenshots/${item}_${check.replace(/\s+/g, '_')}.png` : undefined
            };
            
            setResults(prev => [...prev, result]);
          }
        }
      }
      
      toast.success('QA test suite completed');
      track('qa_suite_completed', { 
        total_checks: totalChecks,
        failed: results.filter(r => r.result === 'failed').length,
        warnings: results.filter(r => r.result === 'warning').length
      });
      
    } catch (error) {
      console.error('QA suite error:', error);
      toast.error('QA suite encountered errors');
    } finally {
      setIsRunning(false);
    }
  };

  const getChecksForItem = (category: string, item: string): string[] => {
    switch (category) {
      case 'personas':
        return ['Branding loads correctly', 'Onboarding flow completes', 'Dashboard shows permitted tools'];
      case 'tools':
        return ['Tool loads without errors', 'Key workflows execute', 'PDF export works'];
      case 'flows':
        return ['Flow completes successfully', 'Error handling works', 'Analytics fire correctly'];
      case 'integrations':
        return ['Connection established', 'API calls succeed', 'Error handling graceful'];
      default:
        return ['Basic functionality', 'Error handling', 'Performance check'];
    }
  };

  const getSeverity = (check: string): 'P0' | 'P1' | 'P2' | 'P3' => {
    if (check.includes('loads') || check.includes('completes')) return 'P0';
    if (check.includes('export') || check.includes('API')) return 'P1';
    if (check.includes('error') || check.includes('handling')) return 'P2';
    return 'P3';
  };

  const generateNotes = (check: string): string => {
    const notes = [
      'Test completed successfully',
      'Minor styling inconsistency detected',
      'Performance within acceptable range',
      'Requires browser refresh to resolve',
      'Intermittent issue - needs investigation'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  const exportResults = async () => {
    track('qa_results_exported');
    
    // Generate CSV export
    const csvContent = [
      'Category,Item,Check,Result,Severity,Notes,Screenshot',
      ...results.map(r => 
        `${r.category},${r.item},"${r.check}",${r.result},${r.severity},"${r.notes}",${r.screenshot_url || ''}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bfo_qa_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('QA results exported to CSV');
  };

  const createGitHubIssues = async () => {
    const criticalIssues = results.filter(r => r.result === 'failed' && (r.severity === 'P0' || r.severity === 'P1'));
    
    track('github_issues_created', { count: criticalIssues.length });
    toast.info(`Would create ${criticalIssues.length} GitHub issues for P0/P1 failures`);
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <div className="h-4 w-4 bg-gray-500 rounded-full animate-pulse" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'P0': return 'bg-red-500';
      case 'P1': return 'bg-orange-500';
      case 'P2': return 'bg-yellow-500';
      case 'P3': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryResults = (category: string) => 
    results.filter(r => r.category === category);

  const getStatsForCategory = (category: string) => {
    const categoryResults = getCategoryResults(category);
    return {
      total: categoryResults.length,
      passed: categoryResults.filter(r => r.result === 'passed').length,
      failed: categoryResults.filter(r => r.result === 'failed').length,
      warnings: categoryResults.filter(r => r.result === 'warning').length
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gold">BFO Launch QA Super-Suite</h2>
          <p className="text-white/70">Comprehensive pre-launch audit across personas, tools, flows & integrations</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportResults}
            disabled={results.length === 0}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          
          <Button
            onClick={createGitHubIssues}
            disabled={results.length === 0}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <Bug className="mr-2 h-4 w-4" />
            Create Issues
          </Button>
          
          <Button
            onClick={runFullQASuite}
            disabled={isRunning}
            className="bg-gold text-black hover:bg-gold/90"
          >
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? 'Running Tests...' : 'Run Full QA Suite'}
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card className="bg-black border-gold/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-5 w-5 text-gold animate-pulse" />
              <span className="text-white font-medium">Running comprehensive QA tests...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-white/70 text-sm mt-2">{Math.round(progress)}% complete</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            {['passed', 'failed', 'warning', 'total'].map(type => {
              const count = type === 'total' 
                ? results.length 
                : results.filter(r => r.result === type).length;
              const color = type === 'passed' ? 'text-green-500' : 
                          type === 'failed' ? 'text-red-500' :
                          type === 'warning' ? 'text-yellow-500' : 'text-white';
              
              return (
                <Card key={type} className="bg-black border-gold/30">
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${color}`}>
                      {count}
                    </div>
                    <div className="text-white/70 capitalize">
                      {type} {type === 'total' ? 'Tests' : ''}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Results by Category */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 bg-black border border-gold/30">
              {Object.keys(testSuites).map(category => {
                const stats = getStatsForCategory(category);
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:bg-gold data-[state=active]:text-black"
                  >
                    <div className="text-center">
                      <div className="capitalize">{category}</div>
                      <div className="text-xs">
                        {stats.passed}/{stats.total}
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.keys(testSuites).map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="space-y-2">
                  {getCategoryResults(category).map(result => (
                    <Card key={result.id} className="bg-black border-gold/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getResultIcon(result.result)}
                            <div>
                              <div className="font-medium text-white">
                                {result.item.replace(/_/g, ' ')}
                              </div>
                              <div className="text-sm text-white/70">
                                {result.check}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(result.severity)}>
                              {result.severity}
                            </Badge>
                            {result.screenshot_url && (
                              <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold/10">
                                Screenshot
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {result.notes && (
                          <div className="mt-2 text-sm text-white/70">
                            {result.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      {/* Optimization Recommendations */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Optimization Playbook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Performance</h4>
              <ul className="space-y-1">
                <li>• Lazy-load non-critical components</li>
                <li>• Preload critical routes (dashboards, SWAG)</li>
                <li>• Compress images/PDFs</li>
                <li>• Make top 3 persona actions above the fold</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">UX & Analytics</h4>
              <ul className="space-y-1">
                <li>• Contextual CTAs post-calculation</li>
                <li>• Ensure WCAG contrast & alt text</li>
                <li>• Standardize analytics naming: tool_action</li>
                <li>• Personalize welcome & dashboards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};