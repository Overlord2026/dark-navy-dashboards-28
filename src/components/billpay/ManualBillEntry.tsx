import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Building, 
  Bell, 
  Trash2, 
  Edit,
  Clock,
  Zap
} from "lucide-react";
import { useBillPayData } from "@/hooks/useBillPayData";
import { AddBillDialog } from "./AddBillDialog";
import { PayBillDialog } from "./PayBillDialog";
import { BillPayOverviewSkeleton } from "@/components/ui/skeletons/BillPaySkeletons";

export const ManualBillEntry: React.FC = () => {
  const { 
    bills, 
    isLoading, 
    error, 
    addBill, 
    updateBill, 
    deleteBill, 
    payBill,
    hasAutomatedPayments 
  } = useBillPayData();
  
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const getCategoryLabel = (category: string) => {
    const categories = {
      utilities: "Utilities",
      mortgage: "Mortgage", 
      insurance: "Insurance",
      tuition: "Tuition",
      loans: "Loans",
      subscriptions: "Subscriptions",
      transportation: "Transportation",
      healthcare: "Healthcare",
      entertainment: "Entertainment",
      other: "Other"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getFrequencyLabel = (frequency: string) => {
    const frequencies = {
      one_time: "One Time",
      weekly: "Weekly", 
      monthly: "Monthly",
      quarterly: "Quarterly",
      annual: "Annual"
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  const handlePayBill = (billId: string) => {
    setSelectedBillId(billId);
    setIsPayBillOpen(true);
  };

  const handleEditBill = (billId: string) => {
    // For now, just open add dialog - could be enhanced with edit functionality
    setIsAddBillOpen(true);
  };

  const handleDeleteBill = async (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      await deleteBill(billId);
    }
  };

  if (isLoading) {
    return <BillPayOverviewSkeleton />;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Error loading bills: {error}
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-6">
      {/* Premium upgrade alert */}
      {!hasAutomatedPayments && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Upgrade to Premium to unlock automated payments and advanced bill management features.
          </AlertDescription>
        </Alert>
      )}

      {/* Bills List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Bills ({bills.length})</CardTitle>
            <CardDescription>Manage and track your bill payments</CardDescription>
          </div>
          <Button onClick={() => setIsAddBillOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bills Added Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first bill to track payments and set up reminders.
              </p>
              <Button onClick={() => setIsAddBillOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bill
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{bill.biller_name}</h3>
                        <Badge variant="secondary">{getCategoryLabel(bill.category)}</Badge>
                        <Badge 
                          variant={bill.status === 'paid' ? 'default' : bill.status === 'overdue' ? 'destructive' : 'secondary'}
                        >
                          {bill.status}
                        </Badge>
                        {bill.is_auto_pay && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto Pay
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${Number(bill.amount).toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(bill.due_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getFrequencyLabel(bill.frequency)}
                        </span>
                      </div>
                      {bill.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{bill.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bill.status !== 'paid' && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePayBill(bill.id)}
                        className="min-w-[44px] min-h-[44px] md:min-w-[auto] md:min-h-[auto]"
                      >
                        Pay Now
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditBill(bill.id)}
                      className="min-w-[44px] min-h-[44px] md:min-w-[auto] md:min-h-[auto]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteBill(bill.id)}
                      className="min-w-[44px] min-h-[44px] md:min-w-[auto] md:min-h-[auto]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          onClick={() => setIsAddBillOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AddBillDialog 
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        onAddBill={addBill}
      />

      {selectedBillId && (
        <PayBillDialog
          isOpen={isPayBillOpen}
          onClose={() => {
            setIsPayBillOpen(false);
            setSelectedBillId(null);
          }}
          billId={selectedBillId}
          onPayBill={payBill}
        />
      )}
    </div>
  );
};