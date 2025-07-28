import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertCircle, User, Camera, Monitor, Smartphone } from 'lucide-react';

interface PersonaTest {
  email: string;
  role: string;
  tier: string;
  displayName: string;
  expectedDashboard: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  results?: {
    authSuccess: boolean;
    correctRole: boolean;
    correctRoute: boolean;
    dashboardLoaded: boolean;
    gatingLogic: 'pass' | 'fail' | 'n/a';
    uxConsistency: number; // 1-10
    mobileResponsive: boolean;
    screenshot?: string;
    notes: string;
  };
}

const TEST_PERSONAS: PersonaTest[] = [
  {
    email: 'persona.client@qa.local',
    role: 'client',
    tier: 'basic',
    displayName: 'Client Basic',
    expectedDashboard: '/client-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.client_premium@qa.local',
    role: 'client_premium',
    tier: 'premium',
    displayName: 'Client Premium',
    expectedDashboard: '/client-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.advisor@qa.local',
    role: 'advisor',
    tier: 'basic',
    displayName: 'Financial Advisor',
    expectedDashboard: '/advisor-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.accountant@qa.local',
    role: 'accountant',
    tier: 'basic',
    displayName: 'Accountant',
    expectedDashboard: '/accountant-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.attorney@qa.local',
    role: 'attorney',
    tier: 'basic',
    displayName: 'Attorney',
    expectedDashboard: '/attorney-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.consultant@qa.local',
    role: 'consultant',
    tier: 'basic',
    displayName: 'Consultant',
    expectedDashboard: '/consultant-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.developer@qa.local',
    role: 'developer',
    tier: 'basic',
    displayName: 'Developer',
    expectedDashboard: '/advisor-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.admin@qa.local',
    role: 'admin',
    tier: 'basic',
    displayName: 'Administrator',
    expectedDashboard: '/admin-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.tenant_admin@qa.local',
    role: 'tenant_admin',
    tier: 'basic',
    displayName: 'Tenant Admin',
    expectedDashboard: '/admin-dashboard',
    status: 'pending'
  },
  {
    email: 'persona.system_administrator@qa.local',
    role: 'system_administrator',
    tier: 'basic',
    displayName: 'System Administrator',
    expectedDashboard: '/admin-dashboard',
    status: 'pending'
  }
];

export function PersonaQATestRunner() {
  const [personas, setPersonas] = useState<PersonaTest[]>(TEST_PERSONAS);
  const [currentTest, setCurrentTest] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<any>({});

  const updatePersonaStatus = (index: number, status: PersonaTest['status']) => {
    setPersonas(prev => prev.map((p, i) => i === index ? { ...p, status } : p));
  };

  const updatePersonaResults = (index: number, results: PersonaTest['results']) => {
    setPersonas(prev => prev.map((p, i) => i === index ? { ...p, results } : p));
  };

  const startTest = (index: number) => {
    setCurrentTest(index);
    updatePersonaStatus(index, 'testing');
  };

  const getStatusIcon = (status: PersonaTest['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <User className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const calculateOverallScore = () => {
    const completed = personas.filter(p => p.results);
    if (completed.length === 0) return 0;
    
    const totalScore = completed.reduce((sum, p) => {
      const score = p.results ? 
        (p.results.authSuccess ? 20 : 0) +
        (p.results.correctRole ? 20 : 0) +
        (p.results.correctRoute ? 20 : 0) +
        (p.results.dashboardLoaded ? 20 : 0) +
        (p.results.gatingLogic === 'pass' ? 10 : 0) +
        (p.results.uxConsistency || 0) : 0;
      return sum + score;
    }, 0);
    
    return Math.round(totalScore / completed.length);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            Persona QA Test Runner
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Progress: {personas.filter(p => p.results).length}/{personas.length}</span>
            <span>Overall Score: {calculateOverallScore()}/100</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {personas.map((persona, index) => (
              <Card key={persona.email} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(persona.status)}
                      <div>
                        <div className="font-medium">{persona.displayName}</div>
                        <div className="text-sm text-muted-foreground">{persona.email}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{persona.role}</Badge>
                          <Badge variant="secondary">{persona.tier}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        → {persona.expectedDashboard}
                      </span>
                      <Button
                        variant={persona.status === 'testing' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => startTest(index)}
                      >
                        {persona.status === 'testing' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                  </div>
                  
                  {persona.results && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          {persona.results.authSuccess ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-red-500" />
                          }
                          Auth
                        </div>
                        <div className="flex items-center gap-1">
                          {persona.results.correctRole ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-red-500" />
                          }
                          Role
                        </div>
                        <div className="flex items-center gap-1">
                          {persona.results.correctRoute ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-red-500" />
                          }
                          Route
                        </div>
                        <div className="flex items-center gap-1">
                          {persona.results.mobileResponsive ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-red-500" />
                          }
                          Mobile
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        UX Score: {persona.results.uxConsistency}/10 | 
                        Gating: {persona.results.gatingLogic}
                      </div>
                      {persona.results.notes && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {persona.results.notes}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentTest !== null && (
        <TestingModal
          persona={personas[currentTest]}
          onComplete={(results) => {
            updatePersonaResults(currentTest, results);
            updatePersonaStatus(currentTest, results.authSuccess && results.correctRole && results.correctRoute ? 'passed' : 'failed');
            setCurrentTest(null);
          }}
          onCancel={() => {
            updatePersonaStatus(currentTest, 'pending');
            setCurrentTest(null);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Login Steps:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Open a new incognito/private window</li>
                <li>Navigate to /auth</li>
                <li>Use persona email + password: Test1234!</li>
                <li>Verify successful authentication</li>
                <li>Check dashboard routing is correct</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Validation Points:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Role detection in userProfile</li>
                <li>Dashboard widgets appropriate for role</li>
                <li>Premium features gating (clients)</li>
                <li>Mobile responsiveness (iPhone 13)</li>
                <li>UI consistency across dashboards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TestingModal({ 
  persona, 
  onComplete, 
  onCancel 
}: {
  persona: PersonaTest;
  onComplete: (results: PersonaTest['results']) => void;
  onCancel: () => void;
}) {
  const [results, setResults] = useState<PersonaTest['results']>({
    authSuccess: false,
    correctRole: false,
    correctRoute: false,
    dashboardLoaded: false,
    gatingLogic: 'n/a',
    uxConsistency: 5,
    mobileResponsive: false,
    notes: ''
  });

  const handleSubmit = () => {
    onComplete(results);
  };

  return (
    <Card className="fixed inset-4 z-50 overflow-auto bg-background border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Testing: {persona.displayName}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>×</Button>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Email: {persona.email} | Password: Test1234! | Expected: {persona.expectedDashboard}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Authentication & Routing</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={results?.authSuccess}
                  onChange={(e) => setResults(prev => ({ ...prev!, authSuccess: e.target.checked }))}
                />
                <span className="text-sm">Login successful</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={results?.correctRole}
                  onChange={(e) => setResults(prev => ({ ...prev!, correctRole: e.target.checked }))}
                />
                <span className="text-sm">Correct role detected</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={results?.correctRoute}
                  onChange={(e) => setResults(prev => ({ ...prev!, correctRoute: e.target.checked }))}
                />
                <span className="text-sm">Routed to correct dashboard</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={results?.dashboardLoaded}
                  onChange={(e) => setResults(prev => ({ ...prev!, dashboardLoaded: e.target.checked }))}
                />
                <span className="text-sm">Dashboard loaded completely</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">UX & Features</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={results?.mobileResponsive}
                  onChange={(e) => setResults(prev => ({ ...prev!, mobileResponsive: e.target.checked }))}
                />
                <span className="text-sm">Mobile responsive (iPhone 13)</span>
              </label>
              <div>
                <label className="text-sm font-medium">Gating Logic</label>
                <select
                  value={results?.gatingLogic}
                  onChange={(e) => setResults(prev => ({ ...prev!, gatingLogic: e.target.value as any }))}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="n/a">N/A</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">UX Consistency (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={results?.uxConsistency}
                  onChange={(e) => setResults(prev => ({ ...prev!, uxConsistency: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Notes & Issues</label>
          <Textarea
            value={results?.notes}
            onChange={(e) => setResults(prev => ({ ...prev!, notes: e.target.value }))}
            placeholder="Note any issues, inconsistencies, or observations..."
            className="mt-1"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Complete Test</Button>
        </div>
      </CardContent>
    </Card>
  );
}