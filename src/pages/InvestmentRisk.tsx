import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Scatter, ScatterChart, ZAxis
} from "recharts";
import { 
  Brain, RefreshCcw, AlertCircle, Shield, TrendingUp, TrendingDown, 
  ArrowUpRight, ArrowDownRight, Lightbulb, Banknote
} from "lucide-react";
import { toast } from "sonner";

const portfolioRiskData = [
  { name: "Volatility", value: 14.3, benchmark: 15.1, rating: "Good" },
  { name: "Drawdown", value: 18.6, benchmark: 19.2, rating: "Fair" },
  { name: "Sharpe Ratio", value: 0.8, benchmark: 0.7, rating: "Good" },
  { name: "Concentration", value: 25.4, benchmark: 21.3, rating: "Fair" },
  { name: "Liquidity", value: 92.1, benchmark: 95.7, rating: "Good" },
  { name: "Interest Rate", value: 46.3, benchmark: 42.1, rating: "Fair" },
];

const sectorRiskData = [
  { name: "Technology", risk: 65, exposure: 28 },
  { name: "Healthcare", risk: 45, exposure: 18 },
  { name: "Financials", risk: 60, exposure: 15 },
  { name: "Consumer", risk: 55, exposure: 12 },
  { name: "Industrials", risk: 50, exposure: 10 },
  { name: "Energy", risk: 70, exposure: 6 },
  { name: "Utilities", risk: 30, exposure: 5 },
  { name: "Materials", risk: 58, exposure: 4 },
  { name: "Real Estate", risk: 48, exposure: 2 },
];

const riskScenarioData = [
  { name: "Market Crash", impact: -32.5 },
  { name: "Recession", impact: -24.7 },
  { name: "Interest Rates +2%", impact: -12.3 },
  { name: "Tech Downturn", impact: -18.9 },
  { name: "Inflation Spike", impact: -14.2 },
  { name: "Dollar Weakness", impact: 5.8 },
  { name: "Growth Rally", impact: 15.3 },
  { name: "Value Rally", impact: -8.2 },
];

const riskReturnData = [
  { name: "Conservative", risk: 5, return: 6, size: 100 },
  { name: "Moderate", risk: 10, return: 8, size: 100 },
  { name: "Balanced", risk: 13, return: 10, size: 100 },
  { name: "Growth", risk: 17, return: 12, size: 100 },
  { name: "Aggressive", risk: 22, return: 14, size: 100 },
  { name: "Your Portfolio", risk: 14.3, return: 11.2, size: 200 },
];

const InvestmentRisk = () => {
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState(67);
  
  const generateAIInsights = () => {
    setIsAnalyzing(true);
    toast.info("Analyzing portfolio risks with AI...");
    
    setTimeout(() => {
      setAiInsights(
        "Your portfolio has a moderate-high risk profile (67/100) which is appropriate for your stated growth objectives. " +
        "The technology sector concentration (28%) represents your largest risk factor, as it contributes significantly to overall volatility. " +
        "Consider three risk mitigation strategies: 1) Increase fixed income allocation by 5-8% to reduce drawdown risk, " +
        "2) Add defensive sectors like utilities and healthcare to balance technology exposure, " +
        "3) Incorporate low-correlation alternative assets to improve diversification. " +
        "Your interest rate risk is elevated, suggesting vulnerability to aggressive Fed tightening scenarios."
      );
      setIsAnalyzing(false);
      toast.success("AI risk analysis complete");
    }, 2500);
  };
  
  const recalculateRisk = () => {
    toast.info("Recalculating portfolio risk...");
    
    setTimeout(() => {
      setRiskScore(Math.floor(Math.random() * 20) + 60);
      toast.success("Risk assessment updated");
    }, 1500);
  };
  
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Risk Assessment">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Risk Assessment</h1>
            <p className="text-muted-foreground">Analyze and manage portfolio risks</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={recalculateRisk}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Update Risk
            </Button>
            <Button onClick={generateAIInsights} disabled={isAnalyzing}>
              <Brain className="mr-2 h-4 w-4" /> 
              {isAnalyzing ? "Analyzing..." : "AI Insights"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" /> Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-4xl font-bold">{riskScore}/100</div>
                <div className="text-sm text-muted-foreground mt-1">Moderate-High Risk</div>
              </div>
              <Progress value={riskScore} className="h-2 mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingDown className="mr-2 h-5 w-5 text-amber-500" /> Max Drawdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-amber-500">-18.6%</div>
                <div className="text-sm text-muted-foreground mt-1">Historical worst case</div>
              </div>
              <div className="text-sm text-center mt-2">
                Recovery time: ~14 months
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Banknote className="mr-2 h-5 w-5 text-emerald-500" /> Risk-Adjusted Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-emerald-500">0.8</div>
                <div className="text-sm text-muted-foreground mt-1">Sharpe Ratio (1yr)</div>
              </div>
              <div className="text-sm text-center mt-2">
                Above average for risk profile
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Risk Overview</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="scenarios">Stress Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioRiskData.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{metric.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {metric.name === "Sharpe Ratio" 
                              ? `${metric.value} (benchmark: ${metric.benchmark})`
                              : `${metric.value}% (benchmark: ${metric.benchmark}%)`}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            metric.rating === "Good" 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" 
                              : metric.rating === "Fair"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {metric.rating}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk vs. Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis 
                          type="number" 
                          dataKey="risk" 
                          name="Risk" 
                          unit="%" 
                          domain={[0, 25]} 
                          label={{ value: 'Risk (Volatility)', position: 'bottom' }} 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="return" 
                          name="Return" 
                          unit="%" 
                          domain={[0, 15]}
                          label={{ value: 'Return', angle: -90, position: 'left' }}
                        />
                        <ZAxis type="number" dataKey="size" range={[50, 200]} />
                        <Tooltip 
                          formatter={(value, name) => [`${value}%`, name]} 
                          cursor={{ strokeDasharray: '3 3' }} 
                        />
                        <Legend />
                        <Scatter 
                          name="Portfolio Types" 
                          data={riskReturnData} 
                          fill="#8884d8" 
                          shape="circle"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {aiInsights && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Brain className="mr-2 h-4 w-4 text-blue-500" /> AI Risk Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{aiInsights}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="factors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={sectorRiskData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 80,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" unit="%" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                        <Legend />
                        <Bar dataKey="risk" name="Risk Score" fill="#ff8042" />
                        <Bar dataKey="exposure" name="Portfolio %" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factor Contribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} width={730} height={350} data={[
                        { subject: 'Market', A: 80, fullMark: 100 },
                        { subject: 'Sector', A: 75, fullMark: 100 },
                        { subject: 'Interest Rate', A: 65, fullMark: 100 },
                        { subject: 'Liquidity', A: 40, fullMark: 100 },
                        { subject: 'Credit', A: 35, fullMark: 100 },
                        { subject: 'Concentration', A: 70, fullMark: 100 },
                        { subject: 'Currency', A: 45, fullMark: 100 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Risk Exposure" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Risk Mitigation Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-500 mr-2" />
                        <h3 className="font-medium">Diversification</h3>
                      </div>
                      <p className="text-sm">
                        Reduce technology concentration by 5-8% and allocate to uncorrelated sectors like utilities and consumer staples.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full text-xs h-8"
                        onClick={() => toast.info("Diversification strategy details")}
                      >
                        View Strategy
                      </Button>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                        <h3 className="font-medium">Hedging</h3>
                      </div>
                      <p className="text-sm">
                        Implement interest rate hedges through treasury futures or rate-sensitive ETFs to protect against rising rates.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full text-xs h-8"
                        onClick={() => toast.info("Hedging strategy details")}
                      >
                        View Strategy
                      </Button>
                    </div>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-emerald-500 mr-2" />
                        <h3 className="font-medium">Alternatives</h3>
                      </div>
                      <p className="text-sm">
                        Add 5-10% allocation to market-neutral alternative strategies to reduce overall portfolio correlation.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full text-xs h-8"
                        onClick={() => toast.info("Alternative investments strategy details")}
                      >
                        View Strategy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="scenarios">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stress Test Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={riskScenarioData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[-40, 20]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
                        <Legend />
                        <Bar 
                          dataKey="impact" 
                          name="Positive Impact" 
                          fill="#82ca9d"
                          isAnimationActive={true}
                          data={riskScenarioData.filter(item => item.impact >= 0)}
                        />
                        <Bar 
                          dataKey="impact" 
                          name="Negative Impact" 
                          fill="#ff8042"
                          isAnimationActive={true}
                          data={riskScenarioData.filter(item => item.impact < 0)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Historical Event Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "2020 COVID Crash", change: -28.3, current: -32.1, diff: -3.8 },
                      { name: "2008 Financial Crisis", change: -49.1, current: -44.7, diff: 4.4 },
                      { name: "2000 Tech Bubble", change: -32.5, current: -38.9, diff: -6.4 },
                      { name: "2018 Q4 Correction", change: -17.8, current: -15.3, diff: 2.5 },
                      { name: "2013 Taper Tantrum", change: -7.3, current: -11.2, diff: -3.9 },
                    ].map((event) => (
                      <div key={event.name} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-muted-foreground">
                            S&P 500: {event.change}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${event.current < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {event.current}%
                          </div>
                          <div className={`text-sm ${event.diff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {event.diff > 0 ? (
                              <span className="flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +{event.diff}%
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <ArrowDownRight className="h-3 w-3 mr-1" /> {event.diff}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-500" /> Risk Alerts
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info("Customizing risk alerts")}
                  >
                    Customize Alerts
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium">Technology Sector Concentration</h3>
                      </div>
                      <p className="text-sm mt-1">
                        Technology allocation (28%) exceeds recommended threshold of 25% for your risk profile.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium">Interest Rate Sensitivity</h3>
                      </div>
                      <p className="text-sm mt-1">
                        Current fixed income duration of 6.8 years creates elevated risk in rising rate environment.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">AI Risk Recommendation</h3>
                      </div>
                      <p className="text-sm mt-1">
                        Consider increasing defensive assets by 5-8% to maintain return profile while reducing maximum drawdown potential.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default InvestmentRisk;
