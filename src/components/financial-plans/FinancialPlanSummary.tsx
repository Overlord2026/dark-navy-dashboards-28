
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialPlans } from "@/context/FinancialPlanContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileIcon } from "lucide-react";

export const FinancialPlanSummary: React.FC = () => {
  const { plans, summary } = useFinancialPlans();
  
  const activePlans = plans.filter(p => p.status === 'Active');
  const draftPlans = plans.filter(p => p.status === 'Draft');
  
  const chartData = [
    { name: "Active Plans", value: summary.activePlans, color: "#10B981" },
    { name: "Draft Plans", value: summary.draftPlans, color: "#3B82F6" }
  ].filter(item => item.value > 0);
  
  return (
    <Card className="border border-border/30 bg-[#0D1426]">
      <CardHeader>
        <CardTitle className="text-lg">Financial Plans Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A2E] p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                  <p className="text-2xl font-semibold">{summary.activePlans}</p>
                </div>
                <div className="bg-[#1A1A2E] p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Draft Plans</p>
                  <p className="text-2xl font-semibold">{summary.draftPlans}</p>
                </div>
                <div className="bg-[#1A1A2E] p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                  <p className="text-2xl font-semibold">{summary.totalGoals}</p>
                </div>
                <div className="bg-[#1A1A2E] p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Success Rate</p>
                  <p className="text-2xl font-semibold">{summary.averageSuccessRate.toFixed(0)}%</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Plans</h3>
              <ul className="space-y-2">
                {plans.slice(0, 3).map(plan => (
                  <li key={plan.id} className="bg-[#1A1A2E] p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.status === 'Active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <FileIcon className="h-4 w-4 text-blue-400" />
                      )}
                      <span>{plan.name}</span>
                    </div>
                    <Badge variant={plan.status === 'Active' ? 'default' : 'outline'}>
                      {plan.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
