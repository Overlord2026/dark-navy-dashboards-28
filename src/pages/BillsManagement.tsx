
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
import { useIsMobile } from "@/hooks/use-mobile";

const BillsManagement = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isAddBillDialogOpen, setIsAddBillDialogOpen] = useState(false);
  const { bills, insights } = useBills();

  return (
    <ThreeColumnLayout activeMainItem="bills-management" title="Bills Management">
      <div className="animate-fade-in max-w-6xl mx-auto p-4 sm:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Bills Management</h1>
          <Button 
            onClick={() => setIsAddBillDialogOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <PlusIcon size={16} />
            Add Bill
          </Button>
        </div>

        <div className="mb-6">
          <BillsOverview />
        </div>

        <Tabs defaultValue="upcoming" className="mt-6">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
              Upcoming Bills
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Bills
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex-1 sm:flex-none">
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
