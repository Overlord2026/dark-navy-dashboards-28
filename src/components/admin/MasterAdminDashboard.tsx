import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Settings,
  UserPlus,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useMultiTenantManagement } from '@/hooks/useMultiTenantManagement';
import { format } from 'date-fns';

export const MasterAdminDashboard: React.FC = () => {
  const {
    firms,
    firmUsers,
    handoffs,
    analytics,
    loading,
    createFirm,
    updateFirm,
    addUserToFirm,
    initiateHandoff,
    approveHandoff,
    calculateRollupAnalytics
  } = useMultiTenantManagement();

  const [showCreateFirm, setShowCreateFirm] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null);
  const [newFirmData, setNewFirmData] = useState({
    name: '',
    contact_email: '',
    parent_tenant_id: ''
  });
  const [newUserData, setNewUserData] = useState({
    email: '',
    role: 'cpa'
  });

  // Calculate summary stats
  const totalFirms = firms.length;
  const totalSeats = firms.reduce((sum, firm) => sum + firm.seats_purchased, 0);
  const usedSeats = firms.reduce((sum, firm) => sum + firm.seats_in_use, 0);
  const totalUsers = firmUsers.length;

  const handleCreateFirm = async () => {
    try {
      await createFirm(newFirmData);
      setShowCreateFirm(false);
      setNewFirmData({ name: '', contact_email: '', parent_tenant_id: '' });
    } catch (error) {
      console.error('Failed to create firm:', error);
    }
  };

  const handleAddUser = async () => {
    if (!selectedFirm) return;
    
    try {
      await addUserToFirm(selectedFirm, newUserData.email, newUserData.role);
      setShowAddUser(false);
      setNewUserData({ email: '', role: 'cpa' });
      setSelectedFirm(null);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleApproveHandoff = async (handoffId: string, approved: boolean) => {
    try {
      await approveHandoff(handoffId, approved);
    } catch (error) {
      console.error('Failed to process handoff:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Master Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your firm network and analytics</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateFirm} onOpenChange={setShowCreateFirm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Firm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Firm</DialogTitle>
                <DialogDescription>
                  Add a new CPA firm to your network
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firm-name">Firm Name</Label>
                  <Input
                    id="firm-name"
                    value={newFirmData.name}
                    onChange={(e) => setNewFirmData({ ...newFirmData, name: e.target.value })}
                    placeholder="Enter firm name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newFirmData.contact_email}
                    onChange={(e) => setNewFirmData({ ...newFirmData, contact_email: e.target.value })}
                    placeholder="admin@firm.com"
                  />
                </div>
                <Button onClick={handleCreateFirm} className="w-full">
                  Create Firm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFirms}</div>
            <p className="text-xs text-muted-foreground">
              Active firms in network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all firms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedSeats}/{totalSeats}</div>
            <p className="text-xs text-muted-foreground">
              {totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{handoffs.length}</div>
            <p className="text-xs text-muted-foreground">
              Handoffs awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="firms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="firms">Firms</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="handoffs">Handoffs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="firms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Firm Network</CardTitle>
              <CardDescription>Manage firms in your network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {firms.map((firm) => (
                  <div key={firm.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{firm.name}</h3>
                        <Badge variant={firm.status === 'active' ? 'default' : 'secondary'}>
                          {firm.status}
                        </Badge>
                        <Badge variant={firm.billing_status === 'active' ? 'default' : 'destructive'}>
                          {firm.billing_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{firm.contact_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Seats: {firm.seats_in_use}/{firm.seats_purchased} • 
                        Created: {format(new Date(firm.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showAddUser && selectedFirm === firm.id} onOpenChange={(open) => {
                        setShowAddUser(open);
                        if (!open) setSelectedFirm(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedFirm(firm.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add User to {firm.name}</DialogTitle>
                            <DialogDescription>
                              Assign a new user to this firm
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="user-email">User Email</Label>
                              <Input
                                id="user-email"
                                type="email"
                                value={newUserData.email}
                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                placeholder="user@example.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="user-role">Role</Label>
                              <select
                                id="user-role"
                                className="w-full p-2 border rounded-md"
                                value={newUserData.role}
                                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                              >
                                <option value="cpa">CPA</option>
                                <option value="admin">Admin</option>
                                <option value="bookkeeper">Bookkeeper</option>
                                <option value="staff">Staff</option>
                              </select>
                            </div>
                            <Button onClick={handleAddUser} className="w-full">
                              Add User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>All users across your firm network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {firmUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{user.user?.email}</h3>
                      <p className="text-sm text-muted-foreground">
                        Role: {user.role} • 
                        Firm: {firms.find(f => f.id === user.firm_id)?.name}
                      </p>
                    </div>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handoffs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Firm Handoffs</CardTitle>
              <CardDescription>Pending ownership transfers requiring approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {handoffs.map((handoff) => (
                  <div key={handoff.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{handoff.firm?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Transfer to: {handoff.new_owner_email}
                      </p>
                      {handoff.reason && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reason: {handoff.reason}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Requested: {format(new Date(handoff.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        {handoff.status}
                      </Badge>
                      {handoff.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveHandoff(handoff.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveHandoff(handoff.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {handoffs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending handoff requests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Analytics</CardTitle>
              <CardDescription>Roll-up analytics across your firm network</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.total_firms}</div>
                    <div className="text-sm text-muted-foreground">Firms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.total_users}</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.total_clients}</div>
                    <div className="text-sm text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${analytics.total_revenue?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No analytics data available</p>
                  <Button onClick={() => calculateRollupAnalytics('tenant-id', '2024-01-01', '2024-12-31')}>
                    Generate Analytics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};