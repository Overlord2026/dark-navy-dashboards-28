import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { 
  PieChart, 
  TrendingUp, 
  Building, 
  Wallet, 
  Shield, 
  Landmark,
  Target,
  Eye,
  Plus
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AssetAllocationChart } from "../AssetAllocationChart";
import { IncomeStream } from "@/types/familyOffice";

interface AssetMapProps {
  incomeStreams: IncomeStream[];
}

export const AssetMap: React.FC<AssetMapProps> = ({ incomeStreams }) => {
  const { metrics, assetBreakdown } = useDashboardData();

  // Mock account data with goals
  const linkedAccounts = [
    {
      name: "Chase Checking",
      balance: 25000,
      type: "Cash Reserve",
      purpose: "Emergency Fund",
      goalProgress: 79,
      goalTarget: 120000
    },
    {
      name: "Vanguard 401(k)",
      balance: 485000,
      type: "Retirement",
      purpose: "Retirement Planning",
      goalProgress: 85,
      goalTarget: 570000
    },
    {
      name: "Travel Fund (Savings)",
      balance: 18500,
      type: "Travel Fund",
      purpose: "Greece Trip",
      goalProgress: 74,
      goalTarget: 25000
    },
    {
      name: "Fidelity HSA",
      balance: 45000,
      type: "Healthcare",
      purpose: "Health & Longevity",
      goalProgress: 90,
      goalTarget: 50000
    },
    {
      name: "529 Education Plan",
      balance: 85000,
      type: "Education",
      purpose: "Emma's College",
      goalProgress: 57,
      goalTarget: 150000
    }
  ];

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Cash Reserve': return <Wallet className="h-4 w-4 text-green-500" />;
      case 'Retirement': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'Travel Fund': return <Target className="h-4 w-4 text-purple-500" />;
      case 'Healthcare': return <Shield className="h-4 w-4 text-pink-500" />;
      case 'Education': return <Landmark className="h-4 w-4 text-indigo-500" />;
      default: return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalIncomeStreams = incomeStreams.reduce((sum, stream) => {
    const monthlyAmount = stream.frequency === 'monthly' ? stream.amount : 
                         stream.frequency === 'quarterly' ? stream.amount / 3 :
                         stream.amount / 12;
    return sum + monthlyAmount;
  }, 0);

  const getReliabilityColor = (reliability: IncomeStream['reliability']) => {
    switch (reliability) {
      case 'guaranteed': return 'bg-emerald-100 text-emerald-700';
      case 'stable': return 'bg-blue-100 text-blue-700';
      case 'variable': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Asset Map & Income Streams</h2>
        <p className="text-muted-foreground">Your complete financial picture and income sources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Asset Allocation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart 
              realEstate={assetBreakdown.realEstate}
              vehicles={assetBreakdown.vehicles}
              investments={assetBreakdown.investments}
              cash={assetBreakdown.cash}
              retirement={assetBreakdown.retirement}
              collectibles={assetBreakdown.collectibles}
              digital={assetBreakdown.digital}
              other={assetBreakdown.other}
              totalValue={metrics.totalAssets}
            />
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                What-if Second Home?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Income Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Monthly Income Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold">{formatCurrency(totalIncomeStreams)}</div>
              <div className="text-sm text-muted-foreground">Total Monthly Income</div>
            </div>

            {incomeStreams.map((stream, index) => {
              const monthlyAmount = stream.frequency === 'monthly' ? stream.amount : 
                                   stream.frequency === 'quarterly' ? stream.amount / 3 :
                                   stream.amount / 12;
              const percentage = (monthlyAmount / totalIncomeStreams) * 100;

              return (
                <div key={stream.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{stream.name}</span>
                      <Badge className={`ml-2 ${getReliabilityColor(stream.reliability)}`} variant="secondary">
                        {stream.reliability}
                      </Badge>
                    </div>
                    <span className="font-semibold">{formatCurrency(monthlyAmount)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of total income
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Linked Accounts by Purpose</span>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Link Account
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedAccounts.map((account, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAccountIcon(account.type)}
                      <span className="font-medium text-sm">{account.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-lg font-bold">{formatCurrency(account.balance)}</div>
                    <div className="text-sm text-muted-foreground">{account.purpose}</div>
                  </div>

                  {account.goalProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Goal Progress</span>
                        <span>{account.goalProgress}%</span>
                      </div>
                      <Progress value={account.goalProgress} className="h-1.5" />
                      <div className="text-xs text-muted-foreground">
                        Target: {formatCurrency(account.goalTarget)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Strategy Insight */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-1">Portfolio Optimization Opportunity</h3>
              <p className="text-sm text-indigo-700">
                Your asset allocation shows room for diversification. Consider discussing 
                alternative investments or international exposure with your advisor to optimize for your timeline.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Schedule Portfolio Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};