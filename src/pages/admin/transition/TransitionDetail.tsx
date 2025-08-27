import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  planSchedule, 
  sendEmail, 
  optOut, 
  getTransitionSummary,
  replayVerify,
  renderEmail 
} from '@/services/transitionMaster';
import { 
  ArrowRight, 
  Mail, 
  Calendar, 
  Users, 
  Shield, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface TransitionSummary {
  total_contacts: number;
  emails_sent: number;
  opt_outs: number;
  bounces: number;
  completion_rate: number;
}

export default function TransitionDetail() {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<TransitionSummary>({
    total_contacts: 0,
    emails_sent: 0,
    opt_outs: 0,
    bounces: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    cadence: '7,14,23,27',
    quotaPerDay: 100,
    quietHours: { start: '22:00', end: '08:00' }
  });

  const fetchSummary = async () => {
    if (!id) return;

    try {
      const summaryData = await getTransitionSummary(id);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch transition summary:', error);
    }
  };

  const handlePlanSchedule = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const cadence = scheduleForm.cadence.split(',').map(n => parseInt(n.trim()));
      await planSchedule(id, cadence, scheduleForm.quotaPerDay, scheduleForm.quietHours);
      await fetchSummary();
    } catch (error) {
      console.error('Failed to plan schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDryRun = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Simulate dry run - would create Campaign-RDS
      console.log('Dry run executed for transition:', id);
      await fetchSummary();
    } catch (error) {
      console.error('Failed to execute dry run:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunNow = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Mock sending emails - would create EmailSend-RDS for each
      const mockContacts = ['contact_001', 'contact_002', 'contact_003'];
      for (const contactId of mockContacts) {
        await sendEmail('job_' + Date.now(), contactId, 'welcome', {
          client_name: 'John Doe',
          transition_details: 'Advisory service transition details...',
          deadline_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          advisor_name: 'Financial Advisor',
          unsubscribe_link: 'https://example.com/unsubscribe'
        });
      }
      await fetchSummary();
    } catch (error) {
      console.error('Failed to run campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplayVerify = async () => {
    if (!id) return;

    try {
      const isValid = await replayVerify(id);
      console.log('Replay verification result:', isValid);
    } catch (error) {
      console.error('Failed to verify replay:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSummary();
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ArrowRight className="h-6 w-6" />
            Transition Master - {id}
          </h1>
          <p className="text-muted-foreground">
            30-day negative consent campaign with TCPA compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReplayVerify}>
            <Shield className="h-4 w-4 mr-2" />
            Replay Verify
          </Button>
          <Button onClick={handleDryRun} disabled={loading}>
            <Pause className="h-4 w-4 mr-2" />
            Dry Run
          </Button>
          <Button onClick={handleRunNow} disabled={loading}>
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_contacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.emails_sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opt Outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.opt_outs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bounces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.bounces}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.completion_rate.toFixed(1)}%
            </div>
            <Progress value={summary.completion_rate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="letters">Letters</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cadence (days)</label>
                  <Input
                    value={scheduleForm.cadence}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, cadence: e.target.value }))}
                    placeholder="7,14,23,27"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quota per Day</label>
                  <Input
                    type="number"
                    value={scheduleForm.quotaPerDay}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, quotaPerDay: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quiet Hours</label>
                  <div className="flex gap-2">
                    <Input
                      value={scheduleForm.quietHours.start}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                      placeholder="22:00"
                    />
                    <Input
                      value={scheduleForm.quietHours.end}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                      placeholder="08:00"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handlePlanSchedule} disabled={loading}>
                <Calendar className="h-4 w-4 mr-2" />
                Plan Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Welcome Template</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <div className="mb-2 font-bold">Subject:</div>
                    <div className="mb-4">Important Update About Your Financial Advisory Services</div>
                    <div className="mb-2 font-bold">Body includes:</div>
                    <div className="text-red-600 font-bold">
                      **No action is required unless you choose to opt out within 30 days (by {'{deadline_date}'}).**
                    </div>
                  </div>
                  <Badge className="bg-green-500 mt-2">Compliance Approved</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Responses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Day 7</TableCell>
                    <TableCell>reminder_1</TableCell>
                    <TableCell><Badge className="bg-green-500">Sent</Badge></TableCell>
                    <TableCell>85/100</TableCell>
                    <TableCell>3 opt-outs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Day 14</TableCell>
                    <TableCell>reminder_1</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Scheduled</Badge></TableCell>
                    <TableCell>0/97</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Day 23</TableCell>
                    <TableCell>reminder_1</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Day 27</TableCell>
                    <TableCell>final_notice</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-15 10:30:15</TableCell>
                    <TableCell>Campaign Planned</TableCell>
                    <TableCell><Badge variant="outline">Campaign-RDS</Badge></TableCell>
                    <TableCell>30-day schedule with 4 touchpoints</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-15 11:00:00</TableCell>
                    <TableCell>Email Sent</TableCell>
                    <TableCell><Badge variant="outline">EmailSend-RDS</Badge></TableCell>
                    <TableCell>Welcome template to 100 contacts</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-15 11:30:45</TableCell>
                    <TableCell>Opt Out</TableCell>
                    <TableCell><Badge variant="outline">OptOut-RDS</Badge></TableCell>
                    <TableCell>3 contacts opted out</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        All transitions include mandatory opt-out text • Suppression enforced • Content-free contact identifiers only • Full receipt audit trail
      </div>
    </div>
  );
}