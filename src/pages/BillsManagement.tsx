
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useBills } from "@/hooks/useBills";
import { BillsOverview } from "@/components/bills/BillsOverview";
import { BillsList } from "@/components/bills/BillsList";
import { BillsInsights } from "@/components/bills/BillsInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AddBillDialog } from "@/components/bills/AddBillDialog";
import { useTheme } from "@/context/ThemeContext";

const BillsManagement = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const [isAddBillDialogOpen, setIsAddBillDialogOpen] = useState(false);
  const { bills, insights } = useBills();

  return (
    <ThreeColumnLayout activeMainItem="bills-management" title="Bills Management">
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Bills Management</h1>
          <Button 
            onClick={() => setIsAddBillDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Add Bill
          </Button>
        </div>

        <BillsOverview />

        <Tabs defaultValue="upcoming" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
            <TabsTrigger value="all">All Bills</TabsTrigger>
            <TabsTrigger value="insights">
              Optimization Insights
              {insights.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {insights.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <BillsList 
              bills={bills.filter(bill => bill.status === "Upcoming")} 
              showCategory={true}
            />
          </TabsContent>
          
          <TabsContent value="all">
            <BillsList bills={bills} showCategory={true} />
          </TabsContent>
          
          <TabsContent value="insights">
            <BillsInsights insights={insights} />
          </TabsContent>
        </Tabs>
      </div>

      <AddBillDialog 
        isOpen={isAddBillDialogOpen} 
        onOpenChange={setIsAddBillDialogOpen}
      />
    </ThreeColumnLayout>
  );
};

export default BillsManagement;
