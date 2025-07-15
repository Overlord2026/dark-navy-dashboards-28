import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Receipt } from "lucide-react";

export default function HSAAccounts() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Family HSA Management</h1>
          <p className="text-muted-foreground">My Family • 1 accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,500</div>
            <p className="text-xs text-muted-foreground">$2,500 cash • $0 invested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Contributions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">$4,300 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Savings</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Annual benefit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">0 pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="px-8">Overview</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Family Member Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Self</span>
                      <Badge variant="secondary">Primary</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Current Balance</span>
                        <span className="text-lg font-bold text-amber-500">$2,500.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">YTD Contributions</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>0% of limit</span>
                        <span>Limit: $4,300.00</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Tax Savings</span>
                        <span className="text-green-600 font-medium">$0.00</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Receipt className="h-4 w-4 text-amber-500" />
                        <span className="text-muted-foreground">Recent Activity</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>0 expenses</span>
                        <span className="ml-4">$0.00 reimbursed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Settings className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                Manage Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Track your HSA contributions throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No contributions recorded yet</p>
                <Button variant="outline">Add First Contribution</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>HSA Expenses</CardTitle>
              <CardDescription>Manage qualified medical expenses and reimbursements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No expenses recorded yet</p>
                <Button variant="outline">
                  <Receipt className="mr-2 h-4 w-4" />
                  Add First Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}