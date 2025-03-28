
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { InfoCircleIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";

const FinancialPlans = () => {
  const { userProfile } = useUser();
  const [goals, setGoals] = useState([]);
  const name = userProfile?.firstName || "User";

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
            <Button className="bg-white text-black hover:bg-gray-100 border border-gray-300">
              Create Plan
            </Button>
          </div>
          
          <div className="relative inline-block">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              {name}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{name}</h2>
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
                  <InfoCircleIcon className="h-4 w-4 ml-1" />
                </div>
              </div>
              <PlanSuccessGauge successRate={0} />
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
                <InfoCircleIcon className="h-4 w-4 ml-1" />
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
    </ThreeColumnLayout>
  );
};

export default FinancialPlans;
