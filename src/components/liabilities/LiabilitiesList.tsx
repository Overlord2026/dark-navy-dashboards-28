import React, { useState } from "react";
import { useLiabilities, Liability } from "@/context/LiabilitiesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DeleteLiabilityDialog } from "./DeleteLiabilityDialog";

export function LiabilitiesList() {
  const { liabilities, loading, deleteLiability } = useLiabilities();
  const isMobile = useIsMobile();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [liabilityToDelete, setLiabilityToDelete] = useState<Liability | null>(null);

  const handleDeleteClick = (liability: Liability) => {
    setLiabilityToDelete(liability);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!liabilityToDelete) return;
    
    setDeletingId(liabilityToDelete.id);
    const success = await deleteLiability(liabilityToDelete.id);
    if (success) {
      setDeleteDialogOpen(false);
    }
    setDeletingId(null);
    setLiabilityToDelete(null);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading liabilities...</p>
      </div>
    );
  }

  if (liabilities.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No liabilities added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first liability to start tracking.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "—";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (rate: number | null | undefined) => {
    if (!rate) return "—";
    return `${rate}%`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {liabilities.map((liability) => (
            <Card key={liability.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{liability.name}</h4>
                  <Badge variant="outline" className="mt-1">
                    {liability.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-red-600">
                    {formatCurrency(liability.current_balance)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {liability.original_loan_amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Amount:</span>
                    <span>{formatCurrency(liability.original_loan_amount)}</span>
                  </div>
                )}
                {liability.monthly_payment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span>{formatCurrency(liability.monthly_payment)}</span>
                  </div>
                )}
                {liability.interest_rate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span>{formatPercentage(liability.interest_rate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{formatDate(liability.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{formatDate(liability.end_date)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteClick(liability)}
                  disabled={deletingId === liability.id}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {deletingId === liability.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <DeleteLiabilityDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          liability={liabilityToDelete}
          onConfirm={handleDeleteConfirm}
        />
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Current Balance</TableHead>
              <TableHead className="text-right">Monthly Payment</TableHead>
              <TableHead className="text-right">Interest Rate</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell className="font-medium">
                  {liability.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {liability.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {formatCurrency(liability.current_balance)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(liability.monthly_payment)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(liability.interest_rate)}
                </TableCell>
                <TableCell>
                  {formatDate(liability.end_date)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(liability)}
                    disabled={deletingId === liability.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteLiabilityDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        liability={liabilityToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
