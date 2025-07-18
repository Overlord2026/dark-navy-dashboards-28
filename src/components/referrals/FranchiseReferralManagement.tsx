import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFranchiseReferrals, FranchiseReferral, FranchiseReferralPayout } from '@/hooks/useFranchiseReferrals';
import { Building2, Copy, DollarSign, Calendar, Users, Phone, Mail, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const FranchiseReferralManagement: React.FC = () => {
  const { referrals, payouts, loading, generateReferralCode, updateReferralStatus, createPayout, updatePayoutStatus, copyReferralLink } = useFranchiseReferrals();
  const [newReferralOpen, setNewReferralOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<FranchiseReferral | null>(null);

  const [newReferral, setNewReferral] = useState({
    referred_firm_name: '',
    referred_contact_name: '',
    referred_contact_email: '',
    referred_contact_phone: '',
    firm_size: '',
    expected_aum: '',
    referral_reward_type: 'percentage' as 'percentage' | 'fixed' | 'royalty',
    referral_reward_amount: 0,
    royalty_period_months: 12,
    notes: ''
  });

  const [newPayout, setNewPayout] = useState({
    payout_type: 'referral_bonus' as FranchiseReferralPayout['payout_type'],
    amount: 0,
    period_start: '',
    period_end: ''
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      demo_scheduled: 'bg-purple-100 text-purple-800',
      negotiating: 'bg-orange-100 text-orange-800',
      signed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPayoutStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const handleCreateReferral = async () => {
    await generateReferralCode({
      ...newReferral,
      firm_size: newReferral.firm_size ? parseInt(newReferral.firm_size) : undefined,
      expected_aum: newReferral.expected_aum ? parseFloat(newReferral.expected_aum) : undefined
    });
    setNewReferralOpen(false);
    setNewReferral({
      referred_firm_name: '',
      referred_contact_name: '',
      referred_contact_email: '',
      referred_contact_phone: '',
      firm_size: '',
      expected_aum: '',
      referral_reward_type: 'percentage' as 'percentage' | 'fixed' | 'royalty',
      referral_reward_amount: 0,
      royalty_period_months: 12,
      notes: ''
    });
  };

  const handleCreatePayout = async () => {
    if (!selectedReferral) return;
    
    await createPayout(
      selectedReferral.id,
      newPayout.payout_type,
      newPayout.amount,
      newPayout.period_start || undefined,
      newPayout.period_end || undefined
    );
    setPayoutDialogOpen(false);
    setSelectedReferral(null);
    setNewPayout({
      payout_type: 'referral_bonus',
      amount: 0,
      period_start: '',
      period_end: ''
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading franchise referrals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Franchise Referrals</h2>
          <p className="text-muted-foreground">Refer firms and advisor teams to the platform</p>
        </div>
        <Dialog open={newReferralOpen} onOpenChange={setNewReferralOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Refer a Firm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Refer a Firm/Advisor Team</DialogTitle>
              <DialogDescription>
                Create a referral for a firm or advisor team to join the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firm_name">Firm Name</Label>
                  <Input
                    id="firm_name"
                    value={newReferral.referred_firm_name}
                    onChange={(e) => setNewReferral({ ...newReferral, referred_firm_name: e.target.value })}
                    placeholder="Enter firm name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    value={newReferral.referred_contact_name}
                    onChange={(e) => setNewReferral({ ...newReferral, referred_contact_name: e.target.value })}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newReferral.referred_contact_email}
                    onChange={(e) => setNewReferral({ ...newReferral, referred_contact_email: e.target.value })}
                    placeholder="Enter contact email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={newReferral.referred_contact_phone}
                    onChange={(e) => setNewReferral({ ...newReferral, referred_contact_phone: e.target.value })}
                    placeholder="Enter contact phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firm_size">Firm Size (Advisors)</Label>
                  <Input
                    id="firm_size"
                    type="number"
                    value={newReferral.firm_size}
                    onChange={(e) => setNewReferral({ ...newReferral, firm_size: e.target.value })}
                    placeholder="Number of advisors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_aum">Expected AUM ($)</Label>
                  <Input
                    id="expected_aum"
                    type="number"
                    value={newReferral.expected_aum}
                    onChange={(e) => setNewReferral({ ...newReferral, expected_aum: e.target.value })}
                    placeholder="Expected assets under management"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Referral Reward</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="reward_type">Reward Type</Label>
                    <Select
                      value={newReferral.referral_reward_type}
                      onValueChange={(value: 'percentage' | 'fixed' | 'royalty') => 
                        setNewReferral({ ...newReferral, referral_reward_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="royalty">Ongoing Royalty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward_amount">
                      Reward Amount {newReferral.referral_reward_type === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="reward_amount"
                      type="number"
                      step="0.01"
                      value={newReferral.referral_reward_amount}
                      onChange={(e) => setNewReferral({ ...newReferral, referral_reward_amount: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter amount"
                    />
                  </div>
                  {(newReferral.referral_reward_type === 'royalty' || newReferral.referral_reward_type === 'fixed') && (
                    <div className="space-y-2">
                      <Label htmlFor="royalty_period">Royalty Period (Months)</Label>
                      <Input
                        id="royalty_period"
                        type="number"
                        value={newReferral.royalty_period_months}
                        onChange={(e) => setNewReferral({ ...newReferral, royalty_period_months: parseInt(e.target.value) || 12 })}
                        placeholder="Duration in months"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newReferral.notes}
                  onChange={(e) => setNewReferral({ ...newReferral, notes: e.target.value })}
                  placeholder="Additional notes about this referral"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewReferralOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReferral}>
                  Create Referral
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Franchise Referrals
          </CardTitle>
          <CardDescription>
            Track your firm and advisor team referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No franchise referrals yet.</p>
              <p className="text-sm">Create your first firm referral to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.referred_firm_name}</div>
                        {referral.firm_size && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {referral.firm_size} advisors
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.referred_contact_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {referral.referred_contact_email}
                        </div>
                        {referral.referred_contact_phone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {referral.referred_contact_phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">{referral.referral_code}</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyReferralLink(referral.referral_code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {referral.referral_reward_type === 'percentage' 
                          ? `${referral.referral_reward_amount}%`
                          : `$${referral.referral_reward_amount}`
                        }
                        {referral.referral_reward_type === 'royalty' && (
                          <span className="text-xs text-muted-foreground">
                            /{referral.royalty_period_months}mo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(referral.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={referral.status}
                          onValueChange={(value) => updateReferralStatus(referral.id, value as FranchiseReferral['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="demo_scheduled">Demo Scheduled</SelectItem>
                            <SelectItem value="negotiating">Negotiating</SelectItem>
                            <SelectItem value="signed">Signed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {referral.status === 'signed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedReferral(referral);
                              setPayoutDialogOpen(true);
                            }}
                          >
                            Create Payout
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Franchise Payouts
          </CardTitle>
          <CardDescription>
            Manage referral and royalty payouts for franchise referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No franchise payouts yet.</p>
              <p className="text-sm">Payouts will appear here when referrals are signed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {payout.payout_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {payout.amount.toLocaleString()} {payout.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payout.period_start && payout.period_end ? (
                        <div className="text-sm">
                          {format(new Date(payout.period_start), 'MMM dd')} - {format(new Date(payout.period_end), 'MMM dd, yyyy')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">One-time</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPayoutStatusColor(payout.status)}>
                        {payout.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(payout.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={payout.status}
                        onValueChange={(value) => updatePayoutStatus(payout.id, value as FranchiseReferralPayout['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Payout Dialog */}
      <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Franchise Payout</DialogTitle>
            <DialogDescription>
              Create a payout for the signed franchise referral
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payout_type">Payout Type</Label>
              <Select
                value={newPayout.payout_type}
                onValueChange={(value: FranchiseReferralPayout['payout_type']) => 
                  setNewPayout({ ...newPayout, payout_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                  <SelectItem value="monthly_royalty">Monthly Royalty</SelectItem>
                  <SelectItem value="annual_royalty">Annual Royalty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payout_amount">Amount ($)</Label>
              <Input
                id="payout_amount"
                type="number"
                step="0.01"
                value={newPayout.amount}
                onChange={(e) => setNewPayout({ ...newPayout, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Enter payout amount"
              />
            </div>

            {newPayout.payout_type !== 'referral_bonus' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="period_start">Period Start</Label>
                  <Input
                    id="period_start"
                    type="date"
                    value={newPayout.period_start}
                    onChange={(e) => setNewPayout({ ...newPayout, period_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period_end">Period End</Label>
                  <Input
                    id="period_end"
                    type="date"
                    value={newPayout.period_end}
                    onChange={(e) => setNewPayout({ ...newPayout, period_end: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePayout}>
                Create Payout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};