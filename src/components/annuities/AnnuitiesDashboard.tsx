import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Calculator, Search, Upload, Users, Award, Video, MessageCircle, TrendingUp, Shield, FileText, Star, Share2, Heart, CheckCircle2, AlertTriangle, DollarSign, Camera, FileUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EducationCenter } from "./EducationCenter";
import { ProductComparison } from "./ProductComparison";
import { ContractAnalyzer } from "./ContractAnalyzer";
import { AnnuityCalculators } from "./calculators/AnnuityCalculators";
import { AnnuityMarketplace } from "./marketplace/AnnuityMarketplace";
import { FiduciaryReview } from "./review/FiduciaryReview";

export const AnnuitiesDashboard = () => {
  const navigate = useNavigate();

  const dashboardTabs = [
    { id: "overview", label: "Overview", icon: Award },
    { id: "learn", label: "Education", icon: Book },
    { id: "compare", label: "Compare", icon: Search },
    { id: "analyze", label: "Analyze", icon: Upload },
    { id: "calculators", label: "Calculators", icon: Calculator },
    { id: "marketplace", label: "Marketplace", icon: Award },
    { id: "review", label: "Review", icon: Shield }
  ];

  const products = [
    {
      name: "Secure Income Plus",
      carrier: "American General",
      rate: "5.25%",
      term: "10 Year",
      badges: ["Fee Only", "RIA Approved", "Top Value"],
      rating: 4.8,
      type: "Fixed Immediate"
    },
    {
      name: "Lifetime Guarantee",
      carrier: "New York Life",
      rate: "4.90%",
      term: "Lifetime",
      badges: ["Guaranteed No Surrender", "A+ Rated"],
      rating: 4.6,
      type: "SPIA"
    },
    {
      name: "Growth Protector",
      carrier: "Allianz",
      rate: "6.10%",
      term: "7 Year",
      badges: ["Growth Potential", "Principal Protected"],
      rating: 4.4,
      type: "Fixed Indexed"
    }
  ];

  const educationContent = [
    { title: "Annuity Basics", type: "Chapter", duration: "15 min read", icon: FileText },
    { title: "Types of Annuities", type: "Chapter", duration: "20 min read", icon: FileText },
    { title: "Understanding Fees", type: "Chapter", duration: "18 min read", icon: FileText },
    { title: "Introduction to Annuities", type: "Video", duration: "12 min", icon: Video },
    { title: "Fixed vs Variable", type: "Video", duration: "8 min", icon: Video },
    { title: "Hidden Fees Explained", type: "Video", duration: "15 min", icon: Video }
  ];

  const calculatorTypes = [
    { name: "Guaranteed Income", description: "Calculate monthly income potential", icon: DollarSign },
    { name: "Withdrawal Rider", description: "Optimize withdrawal strategies", icon: TrendingUp },
    { name: "Payout Projection", description: "Compare payout scenarios", icon: Calculator },
    { name: "Death Benefit", description: "Estimate beneficiary payouts", icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {dashboardTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-8 lg:p-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Learn. Compare. Decide.</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Explore annuities with the clarity and transparency you deserve.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Button size="lg" className="h-auto p-6 flex-col gap-3" onClick={() => navigate("/annuities/learn")}>
                  <Book className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Learn Before You Buy</div>
                    <div className="text-sm opacity-90">Education-first approach</div>
                  </div>
                </Button>
                <Button size="lg" className="h-auto p-6 flex-col gap-3" variant="outline" onClick={() => navigate("/annuities/compare")}>
                  <Search className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Compare Live Rates</div>
                    <div className="text-sm opacity-90">Real-time marketplace</div>
                  </div>
                </Button>
                <Button size="lg" className="h-auto p-6 flex-col gap-3" variant="outline" onClick={() => navigate("/annuities/analyze")}>
                  <Upload className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Analyze My Contract</div>
                    <div className="text-sm opacity-90">AI-powered review</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Education Center */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Education Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {educationContent.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.type}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{item.duration}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/annuities/learn")}>
                    View All Content
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => navigate("/annuities/analyze")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze My Contract
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/annuities/compare")}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Compare Live Rates
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/annuities/marketplace")}>
                    <Award className="h-4 w-4 mr-2" />
                    Fiduciary Product Scorecard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Center Column: Product Comparison & Marketplace */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Live Product Marketplace
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {products.map((product, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.carrier}</div>
                            <div className="text-xs text-muted-foreground">{product.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{product.rate}</div>
                            <div className="text-sm text-muted-foreground">{product.term}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.badges.map((badge, badgeIndex) => (
                            <Badge key={badgeIndex} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          See Full Product Sheet
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => navigate("/annuities/marketplace")}>
                    View All Products
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Contract Analyzer & Tools */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Contract Analyzer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center space-y-4">
                    <div className="flex justify-center gap-4">
                      <Button size="sm" variant="outline">
                        <FileUp className="h-4 w-4 mr-2" />
                        Upload PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Upload or photograph your contract</div>
                      <div className="text-xs text-muted-foreground">Get AI analysis in seconds</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Features, Fees, Surrender Analysis
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Income Stream Projections
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-blue-500" />
                      "Is this fiduciary-friendly?" Badge
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => navigate("/annuities/analyze")}>
                    Start Analyzer
                  </Button>
                </CardContent>
              </Card>

              {/* Calculators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Calculators
                    </span>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {calculatorTypes.map((calc, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-3 flex-col gap-2"
                        onClick={() => navigate(`/annuities/calculators`)}
                      >
                        <calc.icon className="h-5 w-5" />
                        <div className="text-center">
                          <div className="font-medium text-xs">{calc.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Viral/Social Callouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Share Your Results</span>
                <Share2 className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this lesson
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Invite family/friend
                </Button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Help others make informed annuity decisions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Community Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Was this easy to understand?</div>
                    <div className="text-sm text-muted-foreground">Help us improve the experience</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">👍 Yes</Button>
                    <Button size="sm" variant="outline">👎 No</Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">JS</div>
                      <div>
                        <div className="font-medium text-sm">John S.</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Finally found a platform that explains annuities clearly without the sales pitch."
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">ML</div>
                      <div>
                        <div className="font-medium text-sm">Maria L.</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "The contract analyzer saved me from a bad annuity purchase. Highly recommend!"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          <EducationCenter />
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          <ProductComparison />
        </TabsContent>

        <TabsContent value="analyze" className="space-y-6">
          <ContractAnalyzer />
        </TabsContent>

        <TabsContent value="calculators" className="space-y-6">
          <AnnuityCalculators />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <AnnuityMarketplace />
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <FiduciaryReview />
        </TabsContent>
      </Tabs>
    </div>
  );
};