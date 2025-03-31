
import React, { useState } from "react";
import { usePayment, Payment } from "@/context/PaymentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";

export function AdminPaymentDashboard() {
  const { payments } = usePayment();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [resolutionType, setResolutionType] = useState<"release" | "refund" | "partial">("release");
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add some mock disputes for demonstration
  const disputes = [
    {
      id: "dispute_1",
      paymentId: "pay_1",
      title: "Service Quality Dispute",
      description: "Client claims the deliverables did not meet the agreed quality standards",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "dispute_2",
      paymentId: "pay_2",
      title: "Timeline Dispute",
      description: "Provider claims additional time was required due to scope changes",
      status: "resolved",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const handleResolveDispute = () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    // Simulate API call to resolve dispute
    setTimeout(() => {
      toast.success("Dispute resolved successfully");
      setIsDialogOpen(false);
      setIsProcessing(false);
      setSelectedPayment(null);
    }, 1500);
  };
  
  const handleAdjustPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setPartialAmount(payment.amount / 2); // Default to 50% for partial refunds
    setIsDialogOpen(true);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" /> 
          Admin Payment Management
        </CardTitle>
        <CardDescription>
          Manage payment disputes and adjustments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="disputes">
          <TabsList className="mb-4">
            <TabsTrigger value="disputes">Active Disputes</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Cases</TabsTrigger>
            <TabsTrigger value="all-payments">All Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="disputes">
            <div className="space-y-4">
              {disputes
                .filter(dispute => dispute.status === "pending")
                .map((dispute) => {
                  const relatedPayment = payments.find(p => p.id === dispute.paymentId);
                  
                  if (!relatedPayment) return null;
                  
                  return (
                    <Card key={dispute.id} className="overflow-hidden border-l-4 border-l-amber-500">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-amber-500" />
                              {dispute.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dispute.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Opened on {formatDate(dispute.createdAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                            Pending Resolution
                          </Badge>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Disputed Amount: </span>
                            <span className="font-medium">{formatCurrency(relatedPayment.amount)}</span>
                          </div>
                          
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              variant="outline" 
                              className="flex-1 sm:flex-none"
                              onClick={() => {
                                setResolutionType("release");
                                handleAdjustPayment(relatedPayment);
                              }}
                            >
                              Review Dispute
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
                .filter(Boolean)
              }
              
              {disputes.filter(d => d.status === "pending").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active disputes</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resolved">
            <div className="space-y-4">
              {disputes
                .filter(dispute => dispute.status === "resolved")
                .map((dispute) => {
                  const relatedPayment = payments.find(p => p.id === dispute.paymentId);
                  
                  if (!relatedPayment) return null;
                  
                  return (
                    <Card key={dispute.id} className="overflow-hidden border-l-4 border-l-green-500">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {dispute.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dispute.description}
                            </p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                              <span>Opened: {formatDate(dispute.createdAt)}</span>
                              <span>Resolved: {formatDate(dispute.resolvedAt as string)}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Resolved
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })
                .filter(Boolean)
              }
              
              {disputes.filter(d => d.status === "resolved").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No resolved cases</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all-payments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                    <TableCell>{payment.projectId}</TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${payment.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : ''} 
                          ${payment.status === 'in-escrow' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          ${payment.status === 'pending' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                          ${payment.status === 'disputed' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        `}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAdjustPayment(payment)}
                      >
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No payments found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Resolve Payment Dispute</DialogTitle>
              <DialogDescription>
                Adjust the payment or resolve the dispute.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Resolution Type</Label>
                <RadioGroup 
                  value={resolutionType} 
                  onValueChange={(value) => setResolutionType(value as "release" | "refund" | "partial")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="release" id="release" />
                    <Label htmlFor="release">Release full payment to provider</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refund" id="refund" />
                    <Label htmlFor="refund">Refund full payment to client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="partial" />
                    <Label htmlFor="partial">Partial payment to provider</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {resolutionType === "partial" && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Partial Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(Number(e.target.value))}
                    min={0}
                    max={selectedPayment?.amount || 0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Original amount: {formatCurrency(selectedPayment?.amount || 0)}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Input id="notes" placeholder="Add notes about this resolution..." />
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleResolveDispute} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Confirm Resolution"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
