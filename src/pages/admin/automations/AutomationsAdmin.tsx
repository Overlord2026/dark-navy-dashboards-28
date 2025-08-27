import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  listAutomations, 
  enrollHousehold, 
  runAutomation, 
  getHouseholdAutomations,
  checkAutomationEntitlement,
  type AutomationKey,
  type AutomationConfig,
  type HouseholdEnrollment 
} from '@/services/automations';
import { Bot, Settings, Play, Shield, TrendingUp } from 'lucide-react';

export default function AutomationsAdmin() {
  const [automations, setAutomations] = useState<AutomationConfig[]>([]);
  const [enrollments, setEnrollments] = useState<HouseholdEnrollment[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAutomations = async () => {
    const configs = listAutomations();
    setAutomations(configs);
  };

  const fetchEnrollments = async () => {
    if (!selectedHousehold) return;

    try {
      const householdEnrollments = await getHouseholdAutomations(selectedHousehold);
      setEnrollments(householdEnrollments);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const handleEnrollment = async (automationKey: AutomationKey, enroll: boolean) => {
    if (!selectedHousehold) return;

    setLoading(true);
    try {
      if (enroll) {
        await enrollHousehold(selectedHousehold, automationKey);
      } else {
        // Would implement unenrollment
        console.log('Unenrollment not implemented');
      }
      await fetchEnrollments();
    } catch (error) {
      console.error('Failed to update enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAutomation = async (automationKey: AutomationKey) => {
    if (!selectedHousehold) return;

    setLoading(true);
    try {
      const result = await runAutomation(automationKey, selectedHousehold);
      console.log('Automation result:', result);
      // Would show result in UI
    } catch (error) {
      console.error('Failed to run automation:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (automationKey: AutomationKey) => {
    return enrollments.some(e => e.automation_key === automationKey && e.active);
  };

  const getPriceTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'enterprise': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  useEffect(() => {
    if (selectedHousehold) {
      fetchEnrollments();
    }
  }, [selectedHousehold]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Asset Management Automations
          </h1>
          <p className="text-muted-foreground">
            Automated portfolio management with attestation and explainability
          </p>
        </div>
        <Select value={selectedHousehold} onValueChange={setSelectedHousehold}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Household" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="household_001">Smith Family (HH001)</SelectItem>
            <SelectItem value="household_002">Johnson Trust (HH002)</SelectItem>
            <SelectItem value="household_003">Williams LLC (HH003)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="registry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registry">Automation Registry</TabsTrigger>
          <TabsTrigger value="enrollments">Household Enrollments</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="space-y-4">
          <div className="grid gap-4">
            {automations.map((automation) => (
              <Card key={automation.key}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{automation.name}</h3>
                        <Badge className={getPriceTierColor(automation.price_tier)}>
                          {automation.price_tier}
                        </Badge>
                        <Badge variant={automation.enabled ? 'default' : 'secondary'}>
                          {automation.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{automation.description}</p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="font-medium">Min Account:</span> ${automation.min_account_value.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {automation.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {selectedHousehold && (
                        <>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isEnrolled(automation.key)}
                              onCheckedChange={(checked) => handleEnrollment(automation.key, checked)}
                              disabled={loading}
                            />
                            <span className="text-sm">Enrolled</span>
                          </div>
                          {isEnrolled(automation.key) && (
                            <Button
                              size="sm"
                              onClick={() => handleRunAutomation(automation.key)}
                              disabled={loading}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Run Now
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Active Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedHousehold ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Automation</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Parameters</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.automation_key}>
                        <TableCell className="font-medium">
                          {automations.find(a => a.key === enrollment.automation_key)?.name}
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">
                            {JSON.stringify(enrollment.parameters)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={enrollment.active ? 'default' : 'secondary'}>
                            {enrollment.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRunAutomation(enrollment.automation_key)}
                            disabled={loading || !enrollment.active}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a household to view enrollments
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Automation Run History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automation</TableHead>
                    <TableHead>Ran At</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Receipts</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Portfolio Rebalancing</TableCell>
                    <TableCell>2024-01-15 10:30 AM</TableCell>
                    <TableCell>1.2s</TableCell>
                    <TableCell>4 executed</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">AutomationRun-RDS</Badge>
                        <Badge variant="outline" className="text-xs">Trade-RDS</Badge>
                        <Badge variant="outline" className="text-xs">Explainability-RDS</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax Loss Harvesting</TableCell>
                    <TableCell>2024-01-14 2:15 PM</TableCell>
                    <TableCell>0.8s</TableCell>
                    <TableCell>3 executed</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">AutomationRun-RDS</Badge>
                        <Badge variant="outline" className="text-xs">Trade-RDS</Badge>
                        <Badge variant="outline" className="text-xs">Explainability-RDS</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Success</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        All automation runs create Attestation-RDS, Explainability-RDS, and Trade-RDS receipts • Entitlements checked per tier • Content-free trade data only
      </div>
    </div>
  );
}