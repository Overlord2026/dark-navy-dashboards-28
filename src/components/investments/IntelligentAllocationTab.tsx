
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, PieChart, Target, ArrowUpRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

export const IntelligentAllocationTab = () => {
  const navigate = useNavigate();

  const portfolioModels = [
    {
      id: "income-focus",
      name: "Income Focus",
      provider: "Dimensional Fund Advisors",
      description: "Prioritizes stable income with lower volatility",
      returnRate: "+5.8%",
      riskLevel: "Low",
      badge: {
        text: "Conservative",
        color: "blue"
      }
    },
    {
      id: "growth-income",
      name: "Growth & Income",
      provider: "BlackRock",
      description: "Balance between growth and stable income",
      returnRate: "+8.2%",
      riskLevel: "Medium",
      badge: {
        text: "Balanced",
        color: "indigo"
      }
    },
    {
      id: "maximum-growth",
      name: "Maximum Growth",
      provider: "Vanguard",
      description: "Focus on long-term capital appreciation",
      returnRate: "+12.5%",
      riskLevel: "High",
      badge: {
        text: "Aggressive",
        color: "purple"
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$2,847,632</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.4% from last month
            </p>
          </CardContent>
        </Card>

        {/* Income Card - Commented Out
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Monthly Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$18,450</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        */}

        {/* Expenses Card - Commented Out
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Monthly Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$12,890</div>
            <p className="text-xs text-red-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +3.1% from last month
            </p>
          </CardContent>
        </Card>
        */}

        {/* Cash Flow Card - Commented Out
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Net Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$5,560</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        */}

        {/* Savings Rate Card - Commented Out
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">30.1%</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.4% from last month
            </p>
          </CardContent>
        </Card>
        */}

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Asset Allocation</CardTitle>
            <PieChart className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Balanced</div>
            <p className="text-xs text-slate-400">65% Stocks, 35% Bonds</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Next Rebalance</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Mar 15</div>
            <p className="text-xs text-slate-400">Quarterly review</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Models Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recommended Portfolio Models</h2>
            <p className="text-muted-foreground">
              Professionally managed portfolios tailored to your risk profile and goals
            </p>
          </div>
          <Button 
            onClick={() => navigate("/client-investments/models/all")}
            variant="outline" 
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            View All Models
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioModels.map((model) => (
            <Card 
              key={model.id} 
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => navigate(`/client-investments/models/${model.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                    <p className="text-sm text-slate-400">{model.provider}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${model.badge.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                      ${model.badge.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : ''}
                      ${model.badge.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                    `}
                  >
                    {model.badge.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-4">{model.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Expected Return</p>
                    <p className="text-lg font-semibold text-green-400">{model.returnRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Risk Level</p>
                    <p className="text-sm text-slate-200">{model.riskLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/client-investments/models/${model.id}`);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    View Details
                  </Button>
                  <ScheduleMeetingDialog 
                    assetName={model.name}
                    consultationType="investment"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Portfolio Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">Create a custom portfolio tailored to your specific goals and risk tolerance.</p>
              <Button 
                onClick={() => navigate("/client-investments/builder")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                Start Building
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                Performance Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">Analyze your portfolio performance and get insights on optimization opportunities.</p>
              <Button 
                onClick={() => navigate("/client-investments/performance")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                View Performance
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-yellow-400" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">Evaluate your current risk exposure and get recommendations for optimization.</p>
              <Button 
                onClick={() => navigate("/client-investments/risk")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                Assess Risk
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
