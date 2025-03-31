
import React, { useState } from "react";
import { usePayment, Payment, Milestone } from "@/context/PaymentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, DollarSign, AlertCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock milestones data for demonstration
const mockMilestones: Milestone[] = [
  {
    id: "milestone_1",
    projectId: "proj_1",
    title: "Initial Requirements Gathering",
    description: "Complete initial consultation and requirements documentation",
    amount: 5000,
    status: "in-progress",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "milestone_2",
    projectId: "proj_1",
    title: "Strategy Development",
    description: "Develop comprehensive strategy based on requirements",
    amount: 7500,
    status: "pending",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "milestone_3",
    projectId: "proj_2",
    title: "Implementation Phase 1",
    description: "Initial implementation of agreed strategies",
    amount: 10000,
    status: "completed",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface PaymentDashboardProps {
  isProvider?: boolean;
  projectId?: string;
}

export function PaymentDashboard({ isProvider = false, projectId }: PaymentDashboardProps) {
  const { payments, initiatePayment, releaseEscrow, requestReleaseApproval, isLoading } = usePayment();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  
  // Filter payments by project if projectId is provided
  const filteredPayments = projectId 
    ? payments.filter(payment => payment.projectId === projectId)
    : payments;
  
  // Filter milestones by project if projectId is provided
  const filteredMilestones = projectId
    ? mockMilestones.filter(milestone => milestone.projectId === projectId)
    : mockMilestones;
  
  const handlePayMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    initiatePayment(milestone.projectId, milestone.amount, milestone.id)
      .then(() => {
        setSelectedMilestone(null);
      });
  };
  
  const handleRequestRelease = (milestone: Milestone) => {
    requestReleaseApproval(milestone.id);
  };
  
  const handleReleasePayment = (milestone: Milestone) => {
    releaseEscrow(milestone.id);
  };
  
  const getPaymentStatusForMilestone = (milestoneId: string): Payment["status"] | null => {
    const payment = payments.find(p => p.milestoneId === milestoneId);
    return payment ? payment.status : null;
  };
  
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
  
  const renderStatusBadge = (status: Payment["status"] | null) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'in-escrow':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">In Escrow</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Disputed</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Payment Management</CardTitle>
        <CardDescription>
          Track and manage milestone-based payments for your projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="milestones">
          <TabsList className="mb-4">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            {!isProvider && <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="milestones">
            <div className="space-y-4">
              {filteredMilestones.map((milestone) => {
                const paymentStatus = getPaymentStatusForMilestone(milestone.id);
                
                return (
                  <Card key={milestone.id} className="overflow-hidden">
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                          <h3 className="text-lg font-medium">{milestone.title}</h3>
                          <div className="flex items-center space-x-2">
                            {renderStatusBadge(paymentStatus)}
                            <Badge 
                              variant="outline" 
                              className={`
                                ${milestone.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : ''} 
                                ${milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                                ${milestone.status === 'pending' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                                ${milestone.status === 'approved' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                              `}
                            >
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">{milestone.description}</p>
                        
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{formatCurrency(milestone.amount)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {!isProvider && !paymentStatus && (
                          <Button 
                            className="w-full sm:w-auto" 
                            onClick={() => handlePayMilestone(milestone)}
                            disabled={isLoading || selectedMilestone?.id === milestone.id}
                          >
                            {isLoading && selectedMilestone?.id === milestone.id ? 
                              "Processing..." : "Fund Milestone"}
                          </Button>
                        )}
                        
                        {!isProvider && paymentStatus === 'in-escrow' && milestone.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => handleReleasePayment(milestone)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Processing..." : "Approve & Release Payment"}
                          </Button>
                        )}
                        
                        {isProvider && milestone.status === 'in-progress' && (
                          <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => {
                              toast.success("Milestone marked as completed");
                            }}
                          >
                            Mark as Completed
                          </Button>
                        )}
                        
                        {isProvider && milestone.status === 'completed' && paymentStatus === 'in-escrow' && (
                          <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => handleRequestRelease(milestone)}
                            disabled={isLoading}
                          >
                            Request Payment Release
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {filteredMilestones.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No milestones found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="payments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const relatedMilestone = mockMilestones.find(m => m.id === payment.milestoneId);
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>{relatedMilestone?.title || "Payment"}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{renderStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">No payment history</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          {!isProvider && (
            <TabsContent value="approvals">
              <div className="space-y-4">
                {filteredPayments
                  .filter(payment => payment.status === 'in-escrow')
                  .map((payment) => {
                    const relatedMilestone = mockMilestones.find(m => m.id === payment.milestoneId);
                    
                    if (!relatedMilestone || relatedMilestone.status !== 'completed') return null;
                    
                    return (
                      <Card key={payment.id} className="overflow-hidden border-l-4 border-l-blue-500">
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                {relatedMilestone.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Milestone completed - payment release requested
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                              Awaiting Approval
                            </Badge>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Amount: </span>
                              <span className="font-medium">{formatCurrency(payment.amount)}</span>
                            </div>
                            
                            <Button 
                              onClick={() => handleReleasePayment(relatedMilestone)}
                              disabled={isLoading}
                            >
                              {isLoading ? "Processing..." : "Approve & Release"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                  .filter(Boolean)
                }
                
                {filteredPayments.filter(p => p.status === 'in-escrow').length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending approvals</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
