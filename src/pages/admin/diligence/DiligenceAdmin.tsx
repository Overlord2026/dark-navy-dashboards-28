import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  openCase, 
  scoreCase, 
  fetchBrokerCheck, 
  fetchIAPD, 
  getCaseSummary, 
  listCases,
  getRubric,
  type DiligenceCase,
  type RubricCriteria 
} from '@/services/diligence';
import { Shield, Search, FileSearch, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

export default function DiligenceAdmin() {
  const [cases, setCases] = useState<DiligenceCase[]>([]);
  const [rubric, setRubric] = useState<RubricCriteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    advisor_name: '',
    crd: '',
    iard: ''
  });

  const fetchCases = async () => {
    setLoading(true);
    try {
      const casesData = await listCases();
      setCases(casesData);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRubric = () => {
    const rubricData = getRubric();
    setRubric(rubricData);
  };

  const handleCreateCase = async () => {
    if (!newCaseForm.advisor_name) return;

    setLoading(true);
    try {
      await openCase({
        advisor_name: newCaseForm.advisor_name,
        crd: newCaseForm.crd || undefined,
        iard: newCaseForm.iard || undefined,
        created_by: 'current_user' // Would get from auth
      });
      
      setNewCaseForm({ advisor_name: '', crd: '', iard: '' });
      setShowNewCase(false);
      await fetchCases();
    } catch (error) {
      console.error('Failed to create case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBackgroundCheck = async (caseData: DiligenceCase) => {
    setLoading(true);
    try {
      if (caseData.crd_number) {
        const brokerCheck = await fetchBrokerCheck(caseData.crd_number);
        console.log('BrokerCheck result:', brokerCheck);
      }
      
      if (caseData.iard_number) {
        const iapdCheck = await fetchIAPD(caseData.iard_number);
        console.log('IAPD result:', iapdCheck);
      }
    } catch (error) {
      console.error('Failed to run background check:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 8) return 'Low Risk';
    if (score >= 6) return 'Medium Risk';
    return 'High Risk';
  };

  useEffect(() => {
    fetchCases();
    fetchRubric();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Advisor Due Diligence
          </h1>
          <p className="text-muted-foreground">
            Background checks and compliance scoring with content-free receipts
          </p>
        </div>
        <Button onClick={() => setShowNewCase(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {showNewCase && (
        <Card>
          <CardHeader>
            <CardTitle>Open New Due Diligence Case</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Advisor Name</label>
                <Input
                  value={newCaseForm.advisor_name}
                  onChange={(e) => setNewCaseForm(prev => ({ ...prev, advisor_name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CRD Number (optional)</label>
                <Input
                  value={newCaseForm.crd}
                  onChange={(e) => setNewCaseForm(prev => ({ ...prev, crd: e.target.value }))}
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IARD Number (optional)</label>
                <Input
                  value={newCaseForm.iard}
                  onChange={(e) => setNewCaseForm(prev => ({ ...prev, iard: e.target.value }))}
                  placeholder="67890"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCase} disabled={loading || !newCaseForm.advisor_name}>
                Open Case
              </Button>
              <Button variant="outline" onClick={() => setShowNewCase(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cases">Active Cases</TabsTrigger>
          <TabsTrigger value="rubric">Scoring Rubric</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>CRD/IARD</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseData) => (
                    <TableRow key={caseData.id}>
                      <TableCell className="font-mono text-sm">
                        {caseData.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {caseData.crd_number && <div>CRD: {caseData.crd_number}</div>}
                          {caseData.iard_number && <div>IARD: {caseData.iard_number}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          caseData.status === 'completed' ? 'default' :
                          caseData.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {caseData.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-semibold ${getRiskColor(caseData.risk_score)}`}>
                          {caseData.risk_score.toFixed(1)} - {getRiskLabel(caseData.risk_score)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(caseData.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRunBackgroundCheck(caseData)}
                            disabled={loading}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/admin/diligence/${caseData.id}`}>
                              <FileSearch className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Criterion</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Pass Threshold</TableHead>
                    <TableHead>Scoring Guide</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rubric.map((criteria) => (
                    <TableRow key={criteria.id}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {criteria.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {criteria.criterion}
                      </TableCell>
                      <TableCell>{criteria.weight}/10</TableCell>
                      <TableCell>{criteria.pass_threshold}</TableCell>
                      <TableCell className="max-w-md text-sm text-muted-foreground">
                        {criteria.scoring_guide}
                      </TableCell>
                      <TableCell>
                        {criteria.active ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cases.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.risk_score < 6).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {cases.filter(c => c.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Low Risk (8.0+)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(cases.filter(c => c.risk_score >= 8).length / cases.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{cases.filter(c => c.risk_score >= 8).length}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Medium Risk (6.0-7.9)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(cases.filter(c => c.risk_score >= 6 && c.risk_score < 8).length / cases.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{cases.filter(c => c.risk_score >= 6 && c.risk_score < 8).length}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">High Risk (<6.0)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(cases.filter(c => c.risk_score < 6).length / (cases.length || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{cases.filter(c => c.risk_score < 6).length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        All cases create DueDiligence-RDS receipts • Background check data stored in vault only • Rubric changes create Rules-Export-RDS
      </div>
    </div>
  );
}