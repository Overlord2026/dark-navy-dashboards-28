import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { usePayouts } from "@/hooks/usePayouts";

export const PayoutHistory = () => {
  const { userPayouts, loading } = usePayouts();

  const stats = {
    totalEarnings: userPayouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingPayouts: userPayouts.filter(p => p.status === 'pending' || p.status === 'approved').length,
    totalPending: userPayouts.filter(p => p.status === 'pending' || p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
    lastPayout: userPayouts.find(p => p.status === 'paid' && p.paid_at),
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

  if (loading) {
    return <div>Loading payout history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-success" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-warning" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
              <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">${stats.totalPending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-success" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Last Payout</p>
              <p className="text-2xl font-bold">
                {stats.lastPayout 
                  ? new Date(stats.lastPayout.paid_at!).toLocaleDateString()
                  : 'None'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {userPayouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payouts found. Start referring to earn rewards!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPayouts.map((payout) => (
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
                      {payout.payment_method ? (
                        <div>
                          <div className="font-medium capitalize">{payout.payment_method.replace('_', ' ')}</div>
                          {payout.payment_reference && (
                            <div className="text-sm text-muted-foreground">{payout.payment_reference}</div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};