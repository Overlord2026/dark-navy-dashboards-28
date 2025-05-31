
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { useSupabaseLiabilities } from "@/hooks/useSupabaseLiabilities";
import { AddLiabilityDialog } from "./AddLiabilityDialog";
import { EditLiabilityDialog } from "./EditLiabilityDialog";
import { PlusCircle, Edit, Trash2, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { SupabaseLiability } from "@/hooks/useSupabaseLiabilities";

export const LiabilitiesList = () => {
  const { liabilities, loading, getTotalLiabilities, refreshLiabilities } = useSupabaseLiabilities();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState<SupabaseLiability | null>(null);

  const handleEdit = (liability: SupabaseLiability) => {
    setSelectedLiability(liability);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (liability: SupabaseLiability) => {
    if (!confirm(`Are you sure you want to delete "${liability.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_liabilities')
        .delete()
        .eq('id', liability.id);

      if (error) {
        console.error('Error deleting liability:', error);
        toast.error("Failed to delete liability");
        return;
      }

      toast.success("Liability deleted successfully");
      refreshLiabilities();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete liability");
    }
  };

  const getLiabilityTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      mortgage: "Mortgage",
      auto_loan: "Auto Loan",
      personal_loan: "Personal Loan",
      student_loan: "Student Loan",
      credit_card: "Credit Card",
      line_of_credit: "Line of Credit",
      business_loan: "Business Loan",
      other: "Other",
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading liabilities...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-red-600" />
            Liabilities ({liabilities.length})
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Liabilities</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(getTotalLiabilities())}</p>
          </div>
        </CardHeader>
        <CardContent>
          {liabilities.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No liabilities added yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Liability
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {liabilities.map((liability) => (
                <div
                  key={liability.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{liability.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getLiabilityTypeLabel(liability.type)}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(liability.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(liability)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(liability)}
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

      <AddLiabilityDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onLiabilityAdded={refreshLiabilities}
      />

      <EditLiabilityDialog
        liability={selectedLiability}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onLiabilityUpdated={refreshLiabilities}
      />
    </div>
  );
};
