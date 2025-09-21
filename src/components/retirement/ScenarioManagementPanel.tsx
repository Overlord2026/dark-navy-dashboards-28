import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Copy, 
  Archive, 
  Trash2, 
  Edit, 
  Calendar, 
  GitBranch, 
  FileText,
  TrendingUp,
  Settings,
  History
} from 'lucide-react';
import { useRetirementScenarios, type AdvisorClient, type RetirementScenario } from '@/hooks/useRetirementScenarios';
import type { RetirementAnalysisInput } from '@/types/retirement';

interface ScenarioManagementPanelProps {
  client: AdvisorClient;
}

export function ScenarioManagementPanel({ client }: ScenarioManagementPanelProps) {
  const {
    getScenariosForClient,
    createScenario,
    copyScenario,
    createNewVersion,
    updateScenario,
    archiveScenario,
    deleteScenario,
    getScenarioVersions,
    setCurrentScenario,
    saving
  } = useRetirementScenarios();

  const [showNewScenarioDialog, setShowNewScenarioDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<RetirementScenario | null>(null);
  const [newScenarioData, setNewScenarioData] = useState({
    scenario_name: '',
    scenario_description: '',
    assumptions_notes: '',
    tags: '',
    created_for_meeting_date: ''
  });

  const clientScenarios = getScenariosForClient(client.id);
  const activeScenarios = clientScenarios.filter(s => s.scenario_status === 'active');
  const draftScenarios = clientScenarios.filter(s => s.scenario_status === 'draft');
  const archivedScenarios = clientScenarios.filter(s => s.scenario_status === 'archived');

  const handleCreateScenario = async () => {
    if (!newScenarioData.scenario_name.trim()) return;

    // Create base retirement analysis input
    const baseInputs: RetirementAnalysisInput = {
      goals: {
        retirementAge: 65,
        retirementDate: new Date('2040-01-01'),
        currentAge: 45,
        desiredLifestyle: 'moderate',
        annualRetirementIncome: 100000,
        inflationRate: 2.5,
        lifeExpectancy: 90
      },
      socialSecurity: {
        enabled: true,
        currentEarnings: 80000,
        earningsHistory: [75000, 77000, 79000, 80000],
        filingAge: 67,
        spousalBenefit: false,
        colaAdjustment: true
      },
      pension: {
        enabled: false,
        monthlyBenefit: 0,
        startAge: 65,
        survivorBenefit: 0,
        colaProtection: false
      },
      accounts: [],
      expenses: [],
      taxOptimization: {
        withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
        rothConversionStrategy: false,
        taxBracketManagement: true,
        harverstLosses: false
      },
      healthcare: {
        currentAge: 45,
        estimatedAnnualCost: 15000,
        longTermCareInsurance: false,
        longTermCareCost: 60000,
        medicareSupplementation: true
      },
      legacy: {
        targetInheritance: 500000,
        charitableGiving: 10000,
        estateTaxPlanning: false
      }
    };

    const scenario = await createScenario({
      client_id: client.id,
      scenario_name: newScenarioData.scenario_name,
      scenario_description: newScenarioData.scenario_description || undefined,
      analysis_inputs: baseInputs,
      created_for_meeting_date: newScenarioData.created_for_meeting_date || undefined,
      tags: newScenarioData.tags ? newScenarioData.tags.split(',').map(t => t.trim()) : undefined,
      assumptions_notes: newScenarioData.assumptions_notes || undefined
    });

    if (scenario) {
      setShowNewScenarioDialog(false);
      setNewScenarioData({
        scenario_name: '',
        scenario_description: '',
        assumptions_notes: '',
        tags: '',
        created_for_meeting_date: ''
      });
    }
  };

  const handleCopyScenario = async () => {
    if (!selectedScenario || !newScenarioData.scenario_name.trim()) return;

    const copiedScenario = await copyScenario(selectedScenario.id, newScenarioData.scenario_name);
    if (copiedScenario) {
      setShowCopyDialog(false);
      setSelectedScenario(null);
      setNewScenarioData({ ...newScenarioData, scenario_name: '' });
    }
  };

  const handleCreateVersion = async () => {
    if (!selectedScenario) return;

    const newVersion = await createNewVersion(
      selectedScenario.id, 
      newScenarioData.scenario_name || undefined
    );
    
    if (newVersion) {
      setShowVersionDialog(false);
      setSelectedScenario(null);
      setNewScenarioData({ ...newScenarioData, scenario_name: '' });
    }
  };

  const getStatusBadgeVariant = (status: RetirementScenario['scenario_status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      case 'presented': return 'destructive';
      default: return 'secondary';
    }
  };

  const ScenarioCard = ({ scenario }: { scenario: RetirementScenario }) => {
    const versions = getScenarioVersions(scenario.id);
    
    return (
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {scenario.scenario_name}
                {versions.length > 1 && (
                  <Badge variant="outline" className="text-xs">
                    v{scenario.version_number}
                  </Badge>
                )}
              </CardTitle>
              {scenario.scenario_description && (
                <CardDescription className="mt-1">
                  {scenario.scenario_description}
                </CardDescription>
              )}
            </div>
            <Badge variant={getStatusBadgeVariant(scenario.scenario_status)}>
              {scenario.scenario_status}
            </Badge>
          </div>
          
          {scenario.tags && scenario.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {scenario.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-2">
          <div className="space-y-3">
            {scenario.assumptions_notes && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{scenario.assumptions_notes}</p>
              </div>
            )}
            
            {scenario.created_for_meeting_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Meeting: {new Date(scenario.created_for_meeting_date).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Updated {new Date(scenario.updated_at).toLocaleDateString()}</span>
              {versions.length > 1 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    {versions.length} versions
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => setCurrentScenario(scenario)}
              className="gap-1"
            >
              <Settings className="h-3 w-3" />
              Edit
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedScenario(scenario);
                setShowCopyDialog(true);
              }}
              className="gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedScenario(scenario);
                setShowVersionDialog(true);
              }}
              className="gap-1"
            >
              <GitBranch className="h-3 w-3" />
              New Version
            </Button>
            
            {scenario.scenario_status !== 'archived' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => archiveScenario(scenario.id)}
                className="gap-1"
              >
                <Archive className="h-3 w-3" />
                Archive
              </Button>
            )}
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteScenario(scenario.id)}
              className="gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Client Info Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{client.client_name}</CardTitle>
              <CardDescription>{client.client_email}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Next Meeting: {client.next_meeting_date 
                  ? new Date(client.next_meeting_date).toLocaleDateString()
                  : 'Not scheduled'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                Frequency: {client.meeting_frequency}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scenarios Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{activeScenarios.length}</p>
            <p className="text-sm text-muted-foreground">Active Scenarios</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Edit className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{draftScenarios.length}</p>
            <p className="text-sm text-muted-foreground">Draft Scenarios</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Archive className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{archivedScenarios.length}</p>
            <p className="text-sm text-muted-foreground">Archived Scenarios</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Scenario Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Retirement Scenarios</h3>
        <Dialog open={showNewScenarioDialog} onOpenChange={setShowNewScenarioDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
              <DialogDescription>
                Create a new retirement scenario for {client.client_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Scenario name..."
                value={newScenarioData.scenario_name}
                onChange={(e) => setNewScenarioData({
                  ...newScenarioData,
                  scenario_name: e.target.value
                })}
              />
              <Textarea
                placeholder="Description (optional)..."
                value={newScenarioData.scenario_description}
                onChange={(e) => setNewScenarioData({
                  ...newScenarioData,
                  scenario_description: e.target.value
                })}
              />
              <Input
                type="date"
                placeholder="Meeting date (optional)..."
                value={newScenarioData.created_for_meeting_date}
                onChange={(e) => setNewScenarioData({
                  ...newScenarioData,
                  created_for_meeting_date: e.target.value
                })}
              />
              <Input
                placeholder="Tags (comma-separated)..."
                value={newScenarioData.tags}
                onChange={(e) => setNewScenarioData({
                  ...newScenarioData,
                  tags: e.target.value
                })}
              />
              <Textarea
                placeholder="Assumptions notes..."
                value={newScenarioData.assumptions_notes}
                onChange={(e) => setNewScenarioData({
                  ...newScenarioData,
                  assumptions_notes: e.target.value
                })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewScenarioDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateScenario} disabled={saving || !newScenarioData.scenario_name.trim()}>
                  Create Scenario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scenarios List */}
      <div className="space-y-4">
        {clientScenarios.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scenarios Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first retirement scenario for {client.client_name}
              </p>
              <Button onClick={() => setShowNewScenarioDialog(true)}>
                Create First Scenario
              </Button>
            </CardContent>
          </Card>
        ) : (
          clientScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))
        )}
      </div>

      {/* Copy Scenario Dialog */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Scenario</DialogTitle>
            <DialogDescription>
              Create a copy of "{selectedScenario?.scenario_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New scenario name..."
              value={newScenarioData.scenario_name}
              onChange={(e) => setNewScenarioData({
                ...newScenarioData,
                scenario_name: e.target.value
              })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCopyScenario} 
                disabled={saving || !newScenarioData.scenario_name.trim()}
              >
                Copy Scenario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version of "{selectedScenario?.scenario_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Version name (optional)..."
              value={newScenarioData.scenario_name}
              onChange={(e) => setNewScenarioData({
                ...newScenarioData,
                scenario_name: e.target.value
              })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVersion} disabled={saving}>
                Create Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}