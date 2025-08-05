import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Download, Plus, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface BillingConfigPanelProps {
  organizationId: string;
}

export const BillingConfigPanel: React.FC<BillingConfigPanelProps> = ({
  organizationId
}) => {
  const [billingModel, setBillingModel] = useState('monthly');
  const [basePrice, setBasePrice] = useState('199');
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  // Mock billing data
  const billingData = {
    currentPlan: 'Enterprise',
    billingModel: 'Monthly',
    pricePerSeat: 199,
    totalSeats: 50,
    monthlyTotal: 9950,
    nextBillingDate: '2024-09-01',
    paymentMethod: 'Credit Card (**** 4242)'
  };

  const invoiceHistory = [
    { id: '1', date: '2024-08-01', amount: 9950, status: 'Paid', downloadUrl: '#' },
    { id: '2', date: '2024-07-01', amount: 9950, status: 'Paid', downloadUrl: '#' },
    { id: '3', date: '2024-06-01', amount: 8955, status: 'Paid', downloadUrl: '#' },
    { id: '4', date: '2024-05-01', amount: 7960, status: 'Paid', downloadUrl: '#' }
  ];

  const volumeDiscounts = [
    { minSeats: 1, maxSeats: 10, discount: 0, price: 199 },
    { minSeats: 11, maxSeats: 25, discount: 5, price: 189 },
    { minSeats: 26, maxSeats: 50, discount: 10, price: 179 },
    { minSeats: 51, maxSeats: 999, discount: 15, price: 169 }
  ];

  const handleSaveBillingConfig = () => {
    toast.success('Billing configuration updated');
    setIsConfigDialogOpen(false);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success('Invoice download started');
  };

  const handleUpgradePlan = () => {
    toast.success('Plan upgrade initiated');
  };

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${billingData.monthlyTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {billingData.totalSeats} seats × ${billingData.pricePerSeat}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.nextBillingDate}</div>
            <p className="text-xs text-muted-foreground">
              Auto-renewal enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.currentPlan}</div>
            <p className="text-xs text-muted-foreground">
              {billingData.billingModel} billing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{billingData.paymentMethod}</div>
            <Button variant="link" className="p-0 h-auto text-xs">
              Update payment method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing Configuration */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Billing Configuration</CardTitle>
              <CardDescription>Manage your organization's billing settings</CardDescription>
            </div>
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Billing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Billing Configuration</DialogTitle>
                  <DialogDescription>
                    Set up enterprise billing options and volume discounts
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-model">Billing Model</Label>
                      <Select value={billingModel} onValueChange={setBillingModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="usage_based">Usage-Based</SelectItem>
                          <SelectItem value="enterprise_custom">Enterprise Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="base-price">Base Price per Seat</Label>
                      <Input 
                        id="base-price" 
                        value={basePrice} 
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="199"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-contact">Billing Contact Name</Label>
                    <Input id="billing-contact" placeholder="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-email">Billing Email</Label>
                    <Input id="billing-email" placeholder="billing@company.com" type="email" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="white-label" />
                    <Label htmlFor="white-label">White-label invoices</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-renew" defaultChecked />
                    <Label htmlFor="auto-renew">Auto-renewal</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-notes">Custom Billing Notes</Label>
                    <Textarea id="custom-notes" placeholder="Special terms or notes..." />
                  </div>

                  <Button onClick={handleSaveBillingConfig} className="w-full">
                    Save Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Current Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Billing Model:</span>
                  <Badge>{billingData.billingModel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Price per Seat:</span>
                  <span>${billingData.pricePerSeat}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-label:</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-renewal:</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Volume Discounts</h4>
              <div className="space-y-2">
                {volumeDiscounts.map((tier, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{tier.minSeats}-{tier.maxSeats === 999 ? '∞' : tier.maxSeats} seats:</span>
                    <span>{tier.discount}% off (${tier.price})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Download past invoices and billing records</CardDescription>
            </div>
            <Button variant="outline" onClick={handleUpgradePlan}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};