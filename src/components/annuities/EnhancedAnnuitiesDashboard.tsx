import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCelebration } from "@/hooks/useCelebration";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { 
  Book, Calculator, Search, Upload, Users, Award, Video, MessageCircle, 
  TrendingUp, Shield, FileText, Star, Share2, Heart, CheckCircle2, 
  AlertTriangle, DollarSign, Camera, FileUp, Calendar, Crown, Lock,
  BarChart3, PieChart, Download, Save, Eye, Bell, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnnuitiesHero } from "./AnnuitiesHero";
import { GuideOfTheMonth } from "./GuideOfTheMonth";
import { PremiumAnalytics } from "./PremiumAnalytics";
import { ProposalGenerator } from "./ProposalGenerator";
import { EducationCenter } from "./EducationCenter";
import { ProductComparison } from "./ProductComparison";
import { ContractAnalyzer } from "./ContractAnalyzer";
import { AnnuityCalculators } from "./calculators/AnnuityCalculators";
import { AnnuityMarketplace } from "./marketplace/AnnuityMarketplace";
import { FiduciaryReview } from "./review/FiduciaryReview";

export const EnhancedAnnuitiesDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { triggerCelebration, CelebrationComponent } = useCelebration();
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const [activeTab, setActiveTab] = useState("overview");

  const dashboardTabs = [
    { id: "overview", label: "Overview", icon: Award, premium: false },
    { id: "learn", label: "Education", icon: Book, premium: false },
    { id: "compare", label: "Compare", icon: Search, premium: false },
    { id: "analyze", label: "Analyze", icon: Upload, premium: true },
    { id: "calculators", label: "Calculators", icon: Calculator, premium: false },
    { id: "marketplace", label: "Marketplace", icon: Award, premium: true },
    { id: "review", label: "Review", icon: Shield, premium: true }
  ];

  const handlePremiumFeature = (featureName: string, callback: () => void) => {
    if (checkFeatureAccessByKey('premium')) {
      callback();
    } else {
      toast({
        title: "Premium Feature",
        description: `${featureName} is available with Premium subscription.`,
        variant: "default"
      });
    }
  };

  const handleAnalysisComplete = () => {
    triggerCelebration('success', 'Analysis Complete!');
    toast({
      title: "Analysis Complete!",
      description: "Your annuity contract has been analyzed successfully.",
    });
  };

  const handleScheduleExpert = () => {
    navigate("/appointments");
    toast({
      title: "Scheduling Expert Review",
      description: "Redirecting to book your fiduciary consultation.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {CelebrationComponent}
      
      <div className="space-y-8">
        {/* Premium Hero Section */}
        <AnnuitiesHero onScheduleExpert={handleScheduleExpert} />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-2">
            <TabsList className="grid w-full grid-cols-7 bg-transparent gap-1">
              {dashboardTabs.map((tab) => {
                const IconComponent = tab.icon;
                const hasAccess = !tab.premium || checkFeatureAccessByKey('premium');
                
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    disabled={!hasAccess}
                    className="flex items-center gap-2 relative font-serif data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg disabled:opacity-50"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">{tab.label}</span>
                    {tab.premium && !hasAccess && (
                      <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Guide of the Month */}
              <div className="lg:col-span-1">
                <GuideOfTheMonth />
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-slate-200/50 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-slate-800 dark:text-slate-200">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white" 
                      onClick={() => handlePremiumFeature("Contract Analysis", () => setActiveTab("analyze"))}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze Contract
                      {!checkFeatureAccessByKey('premium') && <Crown className="h-3 w-3 ml-auto text-amber-400" />}
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-300" onClick={() => setActiveTab("compare")}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Compare Rates
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-300" onClick={() => setActiveTab("calculators")}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Run Calculations
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50" 
                      onClick={handleScheduleExpert}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Ask an Expert
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Analytics Preview */}
                {checkFeatureAccessByKey('premium') && (
                  <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
                    <CardHeader>
                      <CardTitle className="font-serif text-slate-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-amber-600" />
                        Portfolio Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PremiumAnalytics />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Featured Products */}
              <div className="lg:col-span-2">
                <Card className="border-slate-200/50 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        Featured Products
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("marketplace")}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Secure Income Plus",
                          carrier: "American General",
                          rate: "5.25%",
                          term: "10 Year",
                          badges: ["Fee Only", "Fiduciary Approved", "Top Value"],
                          rating: 4.8,
                          type: "Fixed Immediate",
                          featured: true
                        },
                        {
                          name: "Lifetime Guarantee",
                          carrier: "New York Life",
                          rate: "4.90%",
                          term: "Lifetime",
                          badges: ["No Surrender", "A+ Rated"],
                          rating: 4.6,
                          type: "SPIA",
                          featured: false
                        }
                      ].map((product, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 space-y-3 transition-all duration-300 hover:shadow-lg ${
                            product.featured 
                              ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-amber-100' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold font-serif text-slate-800">{product.name}</div>
                              <div className="text-sm text-slate-600">{product.carrier}</div>
                              <div className="text-xs text-slate-500">{product.type}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">{product.rate}</div>
                              <div className="text-sm text-slate-600">{product.term}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-slate-600">{product.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.badges.map((badge, badgeIndex) => (
                              <Badge 
                                key={badgeIndex} 
                                variant="secondary" 
                                className={`text-xs ${
                                  badge.includes('Fiduciary') ? 'bg-emerald-100 text-emerald-700' : ''
                                }`}
                              >
                                {badge}
                              </Badge>
                            ))}
                            {product.featured && (
                              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                                ⭐ Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                              onClick={() => handlePremiumFeature("Request Quote", () => {
                                toast({ title: "Quote Requested", description: "We'll contact you within 24 hours." });
                              })}
                            >
                              Request Quote
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Expert Call-to-Action */}
            <Card className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white border-slate-600">
              <CardHeader>
                <CardTitle className="font-serif text-center text-2xl">Need Expert Guidance?</CardTitle>
                <CardDescription className="text-center text-slate-300 text-lg">
                  Schedule a complimentary fiduciary review with our certified experts
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-semibold px-8"
                  onClick={handleScheduleExpert}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Expert Review
                </Button>
                <p className="text-sm text-slate-400">
                  ✓ No sales pressure  ✓ Fiduciary standard  ✓ 30-minute consultation
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="learn" className="space-y-6">
            <EducationCenter />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <ProductComparison />
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <ContractAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>

          <TabsContent value="calculators" className="space-y-6">
            <AnnuityCalculators />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <AnnuityMarketplace />
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <FiduciaryReview />
            {checkFeatureAccessByKey('premium') && (
              <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="font-serif text-emerald-800">Generate Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProposalGenerator />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
