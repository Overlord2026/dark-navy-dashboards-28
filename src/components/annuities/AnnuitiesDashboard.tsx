import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Calculator, Search, Upload, Users, Award, Video, MessageCircle, TrendingUp, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AnnuitiesDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Learn Before You Buy",
      description: "Start with education—understand annuities before making decisions",
      icon: Book,
      href: "/annuities/learn",
      color: "bg-blue-500"
    },
    {
      title: "Compare Live Products",
      description: "Real-time rates and fiduciary scoring from top providers",
      icon: Search,
      href: "/annuities/compare",
      color: "bg-green-500"
    },
    {
      title: "Analyze Your Annuity",
      description: "Upload your contract for AI-powered analysis and recommendations",
      icon: Upload,
      href: "/annuities/analyze",
      color: "bg-purple-500"
    }
  ];

  const features = [
    {
      title: "Education Center",
      description: "Book chapters, videos, and AI-powered Q&A",
      icon: Book,
      href: "/annuities/learn"
    },
    {
      title: "Product Marketplace",
      description: "Live rates with fiduciary scorecard badges",
      icon: Award,
      href: "/annuities/marketplace"
    },
    {
      title: "Contract Analyzer",
      description: "AI analysis of existing contracts",
      icon: Upload,
      href: "/annuities/analyze"
    },
    {
      title: "Calculators",
      description: "Income, withdrawal, death benefit tools",
      icon: Calculator,
      href: "/annuities/calculators"
    },
    {
      title: "Fiduciary Review",
      description: "Transparent advisor referral process",
      icon: Users,
      href: "/annuities/review"
    },
    {
      title: "AI Assistant",
      description: "Chat about annuity questions",
      icon: MessageCircle,
      href: "/annuities/chat"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-8">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Welcome to Annuity Clarity</h2>
          <p className="text-muted-foreground mb-6">
            Empower yourself with education, transparent comparisons, and fiduciary guidance. 
            Make informed annuity decisions with consumer-first tools and unbiased analysis.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(action.href)}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(feature.href)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-primary" />
                  <CardTitle>Book Chapters</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/learn/basics")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Chapter 1: Annuity Basics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/learn/types")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Chapter 2: Types of Annuities
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/learn/fees")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Chapter 3: Understanding Fees
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/learn/riders")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Chapter 4: Riders and Benefits
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-primary" />
                  <CardTitle>Video Library</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/videos/intro")}>
                    <Video className="h-4 w-4 mr-2" />
                    Introduction to Annuities (12 min)
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/videos/comparison")}>
                    <Video className="h-4 w-4 mr-2" />
                    Fixed vs Variable (8 min)
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/videos/fees")}>
                    <Video className="h-4 w-4 mr-2" />
                    Hidden Fees Explained (15 min)
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/videos/reviews")}>
                    <Video className="h-4 w-4 mr-2" />
                    Real Contract Reviews (20 min)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                <CardTitle>AI-Powered Q&A</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get instant answers to your annuity questions from our AI assistant trained on consumer-first principles.
              </p>
              <Button onClick={() => navigate("/annuities/chat")}>
                Start AI Chat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  <CardTitle>Contract Analyzer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Upload your annuity contract for AI-powered analysis and recommendations.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Secure document processing
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Fee analysis and comparison
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" />
                    Fiduciary assessment
                  </div>
                </div>
                <Button onClick={() => navigate("/annuities/analyze")}>
                  Upload Contract
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <CardTitle>Calculators</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/calculators/income")}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Income Calculator
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/calculators/withdrawal")}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Withdrawal Calculator
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/calculators/death-benefit")}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Death Benefit Calculator
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/annuities/calculators/comparison")}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Product Comparison Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <CardTitle>Fiduciary Marketplace</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Best-in-class products only, with transparent fiduciary scorecard badges.
                </p>
                <Button onClick={() => navigate("/annuities/marketplace")}>
                  View Products
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>Get Fiduciary Review</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Request a transparent review from fee-only, fiduciary advisors.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Fee-only advisors only
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" />
                    Fiduciary standard
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Transparent pricing
                  </div>
                </div>
                <Button onClick={() => navigate("/annuities/review")}>
                  Request Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};