import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, DollarSign, Clock, TrendingUp, Users } from "lucide-react";
import { usePayouts } from "@/hooks/usePayouts";
import { useState } from "react";

export const PayoutManagement = () => {
  const { payouts, loading, updatePayoutStatus } = usePayouts();
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'pay' | 'reject'>('approve');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  const stats = {
    totalPayouts: payouts.length,
    pendingPayouts: payouts.filter(p => p.status === 'pending').length,
    approvedPayouts: payouts.filter(p => p.status === 'approved').length,
    totalPendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-primary text-primary-foreground';
      case 'paid': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPayoutTypeLabel = (type: string) => {
    switch (type) {
      case 'referral_reward': return 'Referral Reward';
      case 'advisor_override': return 'Advisor Override';
      default: return type;
    }
  };

  const handleAction = async () => {
    if (!selectedPayout) return;

    let status: 'approved' | 'paid' | 'rejected';
    if (actionType === 'approve') status = 'approved';
    else if (actionType === 'pay') status = 'paid';
    else status = 'rejected';

    await updatePayoutStatus(
      selectedPayout.id,
      status,
      notes || undefined,
      paymentMethod || undefined,
      paymentReference || undefined
    );

    // Reset form
    setSelectedPayout(null);
    setNotes('');
    setPaymentMethod('');
    setPaymentReference('');
  };

  const openActionDialog = (payout: any, action: 'approve' | 'pay' | 'reject') => {
    setSelectedPayout(payout);
    setActionType(action);
  };

  if (loading) {
    return <div>Loading payouts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
              <p className="text-2xl font-bold">{stats.totalPayouts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-warning" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-success" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{stats.approvedPayouts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-warning" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">${stats.totalPendingAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getPayoutTypeLabel(payout.payout_type)}</div>
                      {payout.referral && (
                        <div className="text-sm text-muted-foreground">
                          Code: {payout.referral.referral_code}
                        </div>
                      )}
                      {payout.advisor_override && (
                        <div className="text-sm text-muted-foreground">
                          Override: {(payout.advisor_override.override_percent * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${payout.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(payout.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payout.approved_at ? new Date(payout.approved_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {payout.paid_at ? new Date(payout.paid_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payout.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(payout, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openActionDialog(payout, 'reject')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {payout.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(payout, 'pay')}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Payout'}
              {actionType === 'pay' && 'Mark Payout as Paid'}
              {actionType === 'reject' && 'Reject Payout'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPayout && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="font-medium">{getPayoutTypeLabel(selectedPayout.payout_type)}</div>
                <div className="text-sm text-muted-foreground">
                  Amount: ${selectedPayout.amount.toLocaleString()}
                </div>
                {selectedPayout.referral && (
                  <div className="text-sm text-muted-foreground">
                    Referral Code: {selectedPayout.referral.referral_code}
                  </div>
                )}
              </div>
            )}

            {actionType === 'pay' && (
              <>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentReference">Payment Reference</Label>
                  <Input
                    id="paymentReference"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Transaction ID, check number, etc."
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedPayout(null)}>
                Cancel
              </Button>
              <Button onClick={handleAction}>
                {actionType === 'approve' && 'Approve'}
                {actionType === 'pay' && 'Mark as Paid'}
                {actionType === 'reject' && 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};