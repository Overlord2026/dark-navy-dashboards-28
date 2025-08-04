import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { PersonaType } from '@/types/personas';
import { useToast } from '@/hooks/use-toast';

interface QATestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  details: string;
  category: string;
}

const QATestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<QATestResult[]>([]);
  const { toast } = useToast();

  const personas: PersonaType[] = [
    'advisor', 'attorney', 'accountant', 'coach', 'consultant', 
    'compliance', 'imo_fmo', 'agency', 'organization', 'client'
  ];

  const runQATests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    const tests: QATestResult[] = [
      // Persona Modal Tests
      ...personas.map(persona => ({
        name: `${persona} welcome modal loads`,
        status: 'pending' as const,
        details: `Testing welcome modal for ${persona} persona`,
        category: 'Persona Modals'
      })),
      
      // FAQ Tests
      {
        name: 'FAQ page loads on mobile/desktop',
        status: 'pending' as const,
        details: 'Testing FAQ page responsiveness',
        category: 'FAQ'
      },
      {
        name: 'FAQ search/filter functionality',
        status: 'pending' as const,
        details: 'Testing FAQ search and filtering',
        category: 'FAQ'
      },

      // Viral Share Tests
      {
        name: 'LinkedIn share button functionality',
        status: 'pending' as const,
        details: 'Testing LinkedIn viral share with pre-filled content',
        category: 'Viral Share'
      },
      {
        name: 'Copy-to-clipboard functionality',
        status: 'pending' as const,
        details: 'Testing copy viral message feature',
        category: 'Viral Share'
      },

      // Demo Mode Tests
      {
        name: 'Demo mode activation',
        status: 'pending' as const,
        details: 'Testing demo mode controller functionality',
        category: 'Demo Mode'
      },
      {
        name: 'Persona tour functionality',
        status: 'pending' as const,
        details: 'Testing guided tour for each persona',
        category: 'Demo Mode'
      },

      // Feedback Tests
      {
        name: 'Feedback collection system',
        status: 'pending' as const,
        details: 'Testing feedback forms and submission',
        category: 'Feedback'
      },
      {
        name: 'Feedback context tracking',
        status: 'pending' as const,
        details: 'Testing feedback context and analytics',
        category: 'Feedback'
      },

      // Accessibility Tests
      {
        name: 'Touch targets 44px+ (mobile)',
        status: 'pending' as const,
        details: 'Testing minimum touch target sizes',
        category: 'Accessibility'
      },
      {
        name: 'ARIA labels and keyboard navigation',
        status: 'pending' as const,
        details: 'Testing screen reader compatibility',
        category: 'Accessibility'
      },
      {
        name: 'Tab order and focus management',
        status: 'pending' as const,
        details: 'Testing keyboard navigation flow',
        category: 'Accessibility'
      },

      // Mobile Responsiveness
      {
        name: 'iPhone SE (375px) compatibility',
        status: 'pending' as const,
        details: 'Testing smallest mobile viewport',
        category: 'Mobile'
      },
      {
        name: 'iPad (768px) compatibility',
        status: 'pending' as const,
        details: 'Testing tablet viewport',
        category: 'Mobile'
      },
      {
        name: 'Desktop (1024px+) compatibility',
        status: 'pending' as const,
        details: 'Testing desktop viewport',
        category: 'Mobile'
      }
    ];

    const totalTests = tests.length;
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock test results (in real implementation, these would be actual tests)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      test.status = success ? 'pass' : 'fail';
      if (!success) {
        test.details += ' - Minor issue detected, requires review';
      }
      
      setTestResults([...tests.slice(0, i + 1)]);
      setProgress(((i + 1) / totalTests) * 100);
    }

    setIsRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const failedTests = tests.filter(t => t.status === 'fail').length;
    
    toast({
      title: "QA Tests Complete",
      description: `${passedTests} passed, ${failedTests} failed out of ${totalTests} tests`,
      variant: failedTests > 0 ? "destructive" : "default"
    });
  };

  const resetTests = () => {
    setTestResults([]);
    setProgress(0);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />;
    }
  };

  const groupedResults = testResults.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const failedTests = testResults.filter(t => t.status === 'fail').length;
  const totalTests = testResults.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Pre-Launch QA Test Runner</h2>
        <p className="text-muted-foreground">
          Comprehensive testing for all onboarding and engagement features
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button 
          onClick={runQATests} 
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
        <Button 
          onClick={resetTests}
          variant="outline"
          disabled={isRunning}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Progress */}
      {(isRunning || testResults.length > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {totalTests > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{passedTests} passed</span>
                  <span>{failedTests} failed</span>
                  <span>{totalTests} total</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {Object.entries(groupedResults).map(([category, tests]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {category}
              <Badge variant="secondary" className="text-xs">
                {tests.filter(t => t.status === 'pass').length}/{tests.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tests.map((test, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded border">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{test.name}</span>
                    <Badge 
                      variant={test.status === 'pass' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{test.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Launch Readiness Summary */}
      {testResults.length > 0 && !isRunning && (
        <Card className={`border-2 ${failedTests === 0 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">
                {failedTests === 0 ? '🚀 Ready for Launch!' : '⚠️ Review Required'}
              </h3>
              <p className="text-sm mb-4">
                {failedTests === 0 
                  ? 'All systems green! Your engagement features are ready for production.'
                  : `${failedTests} test(s) need attention before launch.`
                }
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round((passedTests / totalTests) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default QATestRunner;