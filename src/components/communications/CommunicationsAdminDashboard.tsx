import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  MessageSquare, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UsageStats {
  smsCount: number;
  callMinutes: number;
  voicemailCount: number;
  totalCost: number;
  monthlyLimit: number;
  currentCredits: number;
}

interface UserUsage {
  userId: string;
  userName: string;
  userRole: string;
  smsCount: number;
  callMinutes: number;
  totalCost: number;
  lastActivity: Date;
}

export function CommunicationsAdminDashboard() {
  const [usageStats, setUsageStats] = useState<UsageStats>({
    smsCount: 0,
    callMinutes: 0,
    voicemailCount: 0,
    totalCost: 0,
    monthlyLimit: 1000,
    currentCredits: 750
  });
  const [userUsage, setUserUsage] = useState<UserUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRecharge, setAutoRecharge] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);

      // Mock data for now since we need to create proper database tables
      const mockSmsLogs = [
        { advisor_id: 'user1', created_at: new Date().toISOString() },
        { advisor_id: 'user2', created_at: new Date().toISOString() }
      ];
      
      const mockCallLogs = [
        { advisor_id: 'user1', duration_seconds: 300, created_at: new Date().toISOString() },
        { advisor_id: 'user2', duration_seconds: 450, created_at: new Date().toISOString() }
      ];

      // Calculate usage stats
      const smsCount = mockSmsLogs?.length || 0;
      const callMinutes = mockCallLogs?.reduce((total, call) => {
        return total + (call.duration_seconds || 0) / 60;
      }, 0) || 0;

      // Estimate costs (example pricing)
      const smsCost = smsCount * 0.01; // $0.01 per SMS
      const callCost = callMinutes * 0.02; // $0.02 per minute
      const totalCost = smsCost + callCost;

      setUsageStats(prev => ({
        ...prev,
        smsCount,
        callMinutes: Math.round(callMinutes),
        totalCost: Math.round(totalCost * 100) / 100,
        voicemailCount: mockCallLogs?.filter(call => call.duration_seconds > 0).length || 0
      }));

      // Aggregate user usage with mock data
      const userStats: Record<string, UserUsage> = {};
      
      mockSmsLogs?.forEach(sms => {
        if (!userStats[sms.advisor_id]) {
          userStats[sms.advisor_id] = {
            userId: sms.advisor_id,
            userName: `User ${sms.advisor_id.slice(-4)}`,
            userRole: 'advisor',
            smsCount: 0,
            callMinutes: 0,
            totalCost: 0,
            lastActivity: new Date(sms.created_at)
          };
        }
        userStats[sms.advisor_id].smsCount++;
        userStats[sms.advisor_id].totalCost += 0.01;
      });

      mockCallLogs?.forEach(call => {
        if (!userStats[call.advisor_id]) {
          userStats[call.advisor_id] = {
            userId: call.advisor_id,
            userName: `User ${call.advisor_id.slice(-4)}`,
            userRole: 'advisor',
            smsCount: 0,
            callMinutes: 0,
            totalCost: 0,
            lastActivity: new Date(call.created_at)
          };
        }
        userStats[call.advisor_id].callMinutes += (call.duration_seconds || 0) / 60;
        userStats[call.advisor_id].totalCost += ((call.duration_seconds || 0) / 60) * 0.02;
      });

      setUserUsage(Object.values(userStats));

    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch usage data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCredits = async (amount: number) => {
    try {
      const { error } = await supabase.functions.invoke('add-communication-credits', {
        body: { amount }
      });

      if (error) throw error;

      setUsageStats(prev => ({
        ...prev,
        currentCredits: prev.currentCredits + amount
      }));

      toast({
        title: "Credits added",
        description: `Successfully added $${amount} in credits`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive"
      });
    }
  };

  const exportUsageReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-usage-report', {
        body: { 
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        }
      });

      if (error) throw error;

      // Download the CSV
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `communications-usage-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast({
        title: "Report exported",
        description: "Usage report has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive"
      });
    }
  };

  const usagePercentage = (usageStats.totalCost / usageStats.monthlyLimit) * 100;
  const creditsPercentage = (usageStats.currentCredits / usageStats.monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Communications Administration</h1>
          <p className="text-muted-foreground">Monitor usage, manage credits, and ensure compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUsageData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportUsageReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SMS Messages</p>
                <p className="text-2xl font-bold">{usageStats.smsCount.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Call Minutes</p>
                <p className="text-2xl font-bold">{usageStats.callMinutes.toLocaleString()}</p>
              </div>
              <Phone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold">${usageStats.totalCost}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{userUsage.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Usage
            </CardTitle>
            <CardDescription>Current month spending vs budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Usage</span>
                <span className="text-sm text-muted-foreground">
                  ${usageStats.totalCost} / ${usageStats.monthlyLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              {usagePercentage > 80 && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Approaching monthly limit</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Credit Balance
            </CardTitle>
            <CardDescription>Available communication credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Credits</span>
                <span className="text-sm text-muted-foreground">
                  ${usageStats.currentCredits} available
                </span>
              </div>
              <Progress value={creditsPercentage} className="h-2" />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={() => addCredits(100)}>
                Add $100
              </Button>
              <Button size="sm" variant="outline" onClick={() => addCredits(500)}>
                Add $500
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>Auto-recharge</span>
              <Badge variant={autoRecharge ? "secondary" : "outline"}>
                {autoRecharge ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Communication usage by user</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="advisors">Advisors</TabsTrigger>
              <TabsTrigger value="heavy">Heavy Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">SMS</th>
                      <th className="text-left p-2">Minutes</th>
                      <th className="text-left p-2">Cost</th>
                      <th className="text-left p-2">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userUsage.map((user) => (
                      <tr key={user.userId} className="border-b">
                        <td className="p-2">{user.userName}</td>
                        <td className="p-2">
                          <Badge variant="outline">{user.userRole}</Badge>
                        </td>
                        <td className="p-2">{user.smsCount}</td>
                        <td className="p-2">{Math.round(user.callMinutes)}</td>
                        <td className="p-2">${user.totalCost.toFixed(2)}</td>
                        <td className="p-2">{user.lastActivity.toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}