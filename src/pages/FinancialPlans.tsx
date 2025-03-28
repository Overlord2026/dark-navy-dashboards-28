
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { 
  InfoIcon, 
  PlusIcon, 
  MoreHorizontal,
  CheckCircle
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Plan {
  id: string;
  name: string;
  isFavorite: boolean;
  isActive?: boolean;
  successRate?: number;
}

const FinancialPlans = () => {
  const { userProfile } = useUser();
  const [goals, setGoals] = useState([]);
  const name = userProfile?.firstName || "Pedro";
  const fullName = userProfile?.firstName && userProfile?.lastName 
    ? `${userProfile.firstName} ${userProfile.lastName}` 
    : "Pedro Gomez";
  
  const [plans, setPlans] = useState<Plan[]>([
    { id: "1", name: "Pedro Gomez", isFavorite: true, isActive: true, successRate: 78 },
    { id: "2", name: "Draft Plan 1", isFavorite: false, successRate: 45 },
    { id: "3", name: "Draft Plan 2", isFavorite: false, successRate: 62 },
  ]);
  
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0].id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreatePlan = (planName: string) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: planName,
      isFavorite: false,
      isActive: true,
      successRate: Math.floor(Math.random() * 60) + 40, // Random success rate between 40-100 for demo
    };
    
    setPlans(prevPlans => {
      // Set all plans to not active
      const updatedPlans = prevPlans.map(plan => ({ ...plan, isActive: false }));
      // Add the new active plan
      return [...updatedPlans, newPlan];
    });
    setSelectedPlan(newPlan.id);
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === "new-plan") {
      setIsCreateDialogOpen(true);
      return;
    }
    
    if (planId === "manage-plans") {
      // Future functionality: Open plan management
      console.log("Open plan management");
      return;
    }
    
    setSelectedPlan(planId);
    // Update the active status of plans
    setPlans(prevPlans => 
      prevPlans.map(plan => ({
        ...plan,
        isActive: plan.id === planId
      }))
    );
  };

  const activePlan = plans.find(plan => plan.id === selectedPlan) || plans[0];

  return (
    <ThreeColumnLayout activeMainItem="financial-plans" title="Financial Plans">
      <div className="animate-fade-in space-y-6">
        <section className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold">Financial Plans</h1>
          <p className="text-muted-foreground text-sm">
            Identify your goals and create a plan to achieve them.
          </p>
        </section>

        <div className="flex justify-between items-center">
          <div className="relative inline-block">
            <Button 
              className="bg-white text-black hover:bg-gray-100 border border-gray-300"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create Plan
            </Button>
          </div>
          
          <div className="relative inline-block">
            <Select
              value={selectedPlan}
              onValueChange={handleSelectPlan}
            >
              <SelectTrigger className="w-[180px] bg-transparent">
                <SelectValue placeholder={fullName}>{activePlan.name}</SelectValue>
              </SelectTrigger>
              <SelectContent 
                className="bg-[#0F1C2E] border-white/10 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
              >
                <div className="py-2 px-4 text-sm font-medium border-b border-white/10">Plans</div>
                {plans.map(plan => (
                  <SelectItem 
                    key={plan.id} 
                    value={plan.id} 
                    className="flex items-center gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {plan.isActive && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span>{plan.name}</span>
                    </div>
                  </SelectItem>
                ))}
                <DropdownMenuSeparator className="my-1 bg-white/10" />
                <SelectItem 
                  value="new-plan" 
                  className="flex items-center gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    <span>New plan</span>
                  </div>
                </SelectItem>
                <SelectItem 
                  value="manage-plans"
                  className="flex items-center gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Manage plans</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{activePlan.name}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0F1C2E] border-white/10 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
                <DropdownMenuItem>Edit plan</DropdownMenuItem>
                <DropdownMenuItem>Duplicate plan</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-500">Delete plan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-muted-foreground">
            Updated: about 1 month ago
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Plan Success Gauge */}
          <Card className="border border-border/30 bg-[#0D1426]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-medium">Projected Plan Success</h3>
                <div className="flex items-center text-muted-foreground text-xs">
                  <span>What is chance of success?</span>
                  <InfoIcon className="h-4 w-4 ml-1" />
                </div>
              </div>
              <PlanSuccessGauge successRate={activePlan.successRate || 0} />
            </CardContent>
          </Card>

          {/* Right Column - Goals Section */}
          <Card className="border border-border/30 bg-[#0D1426]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-medium">Goals</h3>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm mr-2">0 Goals</span>
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
              <GoalsList goals={goals} />
            </CardContent>
          </Card>
        </div>

        {/* Net Worth Chart Section */}
        <Card className="border border-border/30 bg-[#0D1426]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-md font-medium">Projected Net Worth</h3>
                <p className="text-xs text-muted-foreground">Your projected net worth over time based on this plan</p>
              </div>
              <div className="flex items-center text-muted-foreground text-xs">
                <span>How is this chart calculated?</span>
                <InfoIcon className="h-4 w-4 ml-1" />
              </div>
            </div>
            <NetWorthChart />
          </CardContent>
        </Card>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#0D1426] border border-border/30">
            <CardContent className="p-6">
              <h3 className="text-md font-medium mb-2">Set Goals</h3>
              <p className="text-sm text-muted-foreground">
                Track your financial goals — anything from buying a home to saving for a wedding.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0D1426] border border-border/30">
            <CardContent className="p-6">
              <h3 className="text-md font-medium mb-2">Track income and expenses into retirement</h3>
              <p className="text-sm text-muted-foreground">
                Track your income, expenses, and savings to see if you're on track.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePlanDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreatePlan={handleCreatePlan}
      />
    </ThreeColumnLayout>
  );
};

export default FinancialPlans;
