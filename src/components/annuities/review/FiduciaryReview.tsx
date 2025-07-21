import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  AlertTriangle,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface ReviewRequest {
  productType: string;
  investmentAmount: string;
  currentProvider: string;
  concerns: string[];
  additionalInfo: string;
}

const fiduciaryStandards = [
  {
    title: "Duty of Loyalty",
    description: "Acting solely in client's best interest",
    icon: Shield,
    weight: 25
  },
  {
    title: "Duty of Care", 
    description: "Providing prudent investment advice",
    icon: CheckCircle,
    weight: 25
  },
  {
    title: "Fee Transparency",
    description: "Clear disclosure of all fees and costs",
    icon: DollarSign,
    weight: 20
  },
  {
    title: "Conflict Management",
    description: "Identifying and managing conflicts of interest",
    icon: AlertTriangle,
    weight: 15
  },
  {
    title: "Ongoing Monitoring",
    description: "Regular review and adjustment of recommendations",
    icon: TrendingUp,
    weight: 15
  }
];

const reviewProcess = [
  {
    step: 1,
    title: "Document Review",
    description: "Analysis of current annuity contracts and terms",
    duration: "2-3 days",
    icon: FileText
  },
  {
    step: 2,
    title: "Fiduciary Assessment",
    description: "Evaluation against fiduciary standards",
    duration: "1-2 days", 
    icon: Shield
  },
  {
    step: 3,
    title: "Consultation Call",
    description: "Discussion of findings and recommendations",
    duration: "60 minutes",
    icon: Phone
  },
  {
    step: 4,
    title: "Written Report",
    description: "Comprehensive fiduciary review report",
    duration: "1 day",
    icon: BookOpen
  }
];

export const FiduciaryReview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest>({
    productType: "",
    investmentAmount: "",
    currentProvider: "",
    concerns: [],
    additionalInfo: ""
  });

  const handleScheduleReview = () => {
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    toast.success("Opening scheduling page", {
      description: "Schedule your comprehensive fiduciary review with our team.",
      duration: 3000,
    });
  };

  const handleQuickConsultation = () => {
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");  
    toast.success("Opening consultation scheduling", {
      description: "Schedule a quick 15-minute consultation call.",
      duration: 3000,
    });
  };

  const handleConcernToggle = (concern: string) => {
    setReviewRequest(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const commonConcerns = [
    "High fees and charges",
    "Complex terms and conditions", 
    "Poor performance",
    "Limited liquidity options",
    "Unsuitable for my situation",
    "Lack of transparency",
    "Surrender charges",
    "Marketing pressure tactics"
  ];

  const reviewBenefits = [
    "Independent analysis of your current annuity",
    "Identification of potential cost savings",
    "Assessment of suitability for your goals",
    "Comparison with better alternatives",
    "Actionable recommendations",
    "Written fiduciary review report"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Fiduciary Review Service</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get an independent, unbiased review of your annuity products from fiduciary advisors 
          who are legally bound to act in your best interest.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <Star className="h-3 w-3 mr-1" />
            Fiduciary Standard
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Independent Analysis
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <FileText className="h-3 w-3 mr-1" />
            Written Report
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="request">Request Review</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Why Choose a Fiduciary Review?
                </CardTitle>
                <CardDescription>
                  Independent analysis that puts your interests first
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  <Button onClick={handleScheduleReview} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Full Review
                  </Button>
                  <Button variant="outline" onClick={handleQuickConsultation} className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Quick Consultation (15 min)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Common Red Flags
                </CardTitle>
                <CardDescription>
                  Warning signs that warrant a fiduciary review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Excessive fees (above 2% annually)",
                  "Complex surrender charge schedules",
                  "High-pressure sales tactics used",
                  "Limited investment options",
                  "No clear performance benchmarking",
                  "Advisor compensation not disclosed"
                ].map((flag, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{flag}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What Our Reviews Have Found</CardTitle>
              <CardDescription>Real outcomes from fiduciary reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">73%</div>
                  <div className="text-sm text-muted-foreground">
                    Of reviews identified cost savings opportunities
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">$8,400</div>
                  <div className="text-sm text-muted-foreground">
                    Average annual savings identified
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <div className="text-sm text-muted-foreground">
                    Client satisfaction with review process
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our 4-Step Review Process</CardTitle>
              <CardDescription>
                Comprehensive analysis following fiduciary standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviewProcess.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <step.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{step.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {index < reviewProcess.length - 1 && (
                        <div className="w-px h-6 bg-border ml-5"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline & Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Review Time</span>
                  <span className="text-muted-foreground">5-7 business days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Initial Response</span>
                  <span className="text-muted-foreground">Within 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Written Report</span>
                  <span className="text-muted-foreground">10-15 pages</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Follow-up Support</span>
                  <span className="text-muted-foreground">90 days included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Your Fiduciary Review</CardTitle>
              <CardDescription>
                Provide some basic information to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productType">Annuity Type</Label>
                  <Input
                    id="productType"
                    placeholder="Variable, Fixed, Indexed, etc."
                    value={reviewRequest.productType}
                    onChange={(e) => setReviewRequest(prev => ({
                      ...prev,
                      productType: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount</Label>
                  <Input
                    id="amount"
                    placeholder="$100,000"
                    value={reviewRequest.investmentAmount}
                    onChange={(e) => setReviewRequest(prev => ({
                      ...prev,
                      investmentAmount: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Current Provider/Carrier</Label>
                <Input
                  id="provider"
                  placeholder="Insurance company name"
                  value={reviewRequest.currentProvider}
                  onChange={(e) => setReviewRequest(prev => ({
                    ...prev,
                    currentProvider: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Primary Concerns (select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-2">
                  {commonConcerns.map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern}
                        checked={reviewRequest.concerns.includes(concern)}
                        onCheckedChange={() => handleConcernToggle(concern)}
                      />
                      <Label 
                        htmlFor={concern}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {concern}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Information</Label>
                <Textarea
                  id="additional"
                  placeholder="Any additional context or specific questions..."
                  value={reviewRequest.additionalInfo}
                  onChange={(e) => setReviewRequest(prev => ({
                    ...prev,
                    additionalInfo: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleScheduleReview} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
                <Button variant="outline" onClick={handleQuickConsultation}>
                  <Clock className="h-4 w-4 mr-2" />
                  Quick Call First
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fiduciary Standards We Apply</CardTitle>
              <CardDescription>
                How we evaluate annuity recommendations against fiduciary requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {fiduciaryStandards.map((standard, index) => {
                  const Icon = standard.icon;
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-semibold">{standard.title}</h3>
                            <p className="text-sm text-muted-foreground">{standard.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{standard.weight}%</Badge>
                      </div>
                      <Progress value={standard.weight * 4} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Scoring System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="font-medium">Excellent (85-100)</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Meets Fiduciary Standard
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <span className="font-medium">Good (70-84)</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    Minor Concerns
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <span className="font-medium">Fair (55-69)</span>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                    Significant Issues
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <span className="font-medium">Poor (Below 55)</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    Does Not Meet Standard
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};