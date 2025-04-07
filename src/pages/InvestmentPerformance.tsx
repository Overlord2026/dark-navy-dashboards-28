
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMarketData } from "@/hooks/useMarketData";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { ArrowUpRight, ArrowDownRight, RefreshCcw, Brain } from "lucide-react";
import { toast } from "sonner";

// Sample performance data
const modelPerformanceData = [
  { month: 'Jan', portfolio: 4.1, benchmark: 3.8 },
  { month: 'Feb', portfolio: 5.0, benchmark: 4.2 },
  { month: 'Mar', portfolio: 4.8, benchmark: 5.1 },
  { month: 'Apr', portfolio: 6.2, benchmark: 5.8 },
  { month: 'May', portfolio: 7.0, benchmark: 6.2 },
  { month: 'Jun', portfolio: 6.5, benchmark: 6.0 },
  { month: 'Jul', portfolio: 7.2, benchmark: 6.8 },
  { month: 'Aug', portfolio: 8.1, benchmark: 7.5 },
  { month: 'Sep', portfolio: 7.9, benchmark: 7.2 },
  { month: 'Oct', portfolio: 9.2, benchmark: 8.3 },
  { month: 'Nov', portfolio: 10.1, benchmark: 9.2 },
  { month: 'Dec', portfolio: 12.5, benchmark: 11.0 },
];

const sectorPerformanceData = [
  { name: 'Technology', value: 28.4, change: 5.2 },
  { name: 'Healthcare', value: 18.7, change: 3.1 },
  { name: 'Financials', value: 15.2, change: -1.3 },
  { name: 'Consumer Cyclical', value: 12.6, change: 4.7 },
  { name: 'Industrials', value: 9.8, change: 2.1 },
  { name: 'Communication', value: 8.9, change: 3.2 },
  { name: 'Energy', value: 6.4, change: -2.5 },
];

const InvestmentPerformance = () => {
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { refreshData } = useMarketData();

  const handleRefreshData = () => {
    refreshData();
    toast.success("Performance data refreshed");
  };

  const generateAIAnalysis = () => {
    setIsAnalyzing(true);
    toast.info("Analyzing portfolio performance data...");
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      setAnalysisResults(
        "Based on the performance data, your portfolio has consistently outperformed the benchmark with a 1.5% higher annual return. " +
        "The technology sector has been your strongest contributor, adding 3.2% to overall performance. " +
        "Consider rebalancing your energy sector allocation which has underperformed by 2.5% relative to benchmark. " +
        "Your portfolio's volatility score is 12.4, which is within acceptable range for your risk profile. " +
        "Recommendation: Maintain current technology exposure, but consider selective additions to healthcare based on positive momentum."
      );
      setIsAnalyzing(false);
      toast.success("AI performance analysis complete");
    }, 2500);
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Performance Analysis">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Performance Analysis</h1>
            <p className="text-muted-foreground">Analyze and compare your portfolio performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
            <Button onClick={generateAIAnalysis} disabled={isAnalyzing}>
              <Brain className="mr-2 h-4 w-4" /> 
              {isAnalyzing ? "Analyzing..." : "AI Analysis"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Portfolio Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">YTD Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-emerald-500">+15.2%</span>
                    <ArrowUpRight className="ml-2 text-emerald-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">+2.3% vs benchmark</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">3 Year Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-emerald-500">+42.8%</span>
                    <ArrowUpRight className="ml-2 text-emerald-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">+5.7% vs benchmark</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Volatility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold">12.4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Medium-low risk score</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Performance vs Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={modelPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="portfolio" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        name="Your Portfolio"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#82ca9d" 
                        name="Benchmark (S&P 500)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" /> AI Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysisResults}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="sectors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={sectorPerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 60,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" unit="%" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                        <Bar dataKey="value" fill="#8884d8" name="Allocation %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorPerformanceData.map((sector) => (
                      <div key={sector.name} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{sector.name}</div>
                          <div className="text-sm text-muted-foreground">{sector.value}% of portfolio</div>
                        </div>
                        <div className={`flex items-center ${sector.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {sector.change >= 0 ? (
                            <>
                              <ArrowUpRight className="mr-1 h-4 w-4" />
                              <span>+{sector.change}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="mr-1 h-4 w-4" />
                              <span>{sector.change}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Model Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Q1 2023', aggressive: 5.2, balanced: 4.1, conservative: 3.1 },
                        { month: 'Q2 2023', aggressive: 7.1, balanced: 5.8, conservative: 3.8 },
                        { month: 'Q3 2023', aggressive: 4.2, balanced: 3.9, conservative: 3.2 },
                        { month: 'Q4 2023', aggressive: 9.5, balanced: 7.2, conservative: 5.1 },
                        { month: 'Q1 2024', aggressive: 8.4, balanced: 6.7, conservative: 4.8 },
                        { month: 'Q2 2024', aggressive: 12.2, balanced: 9.1, conservative: 6.2 },
                      ]}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="aggressive" stackId="1" stroke="#8884d8" fill="#8884d8" name="Aggressive Portfolio" />
                      <Area type="monotone" dataKey="balanced" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Balanced Portfolio" />
                      <Area type="monotone" dataKey="conservative" stackId="3" stroke="#ffc658" fill="#ffc658" name="Conservative Portfolio" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default InvestmentPerformance;
