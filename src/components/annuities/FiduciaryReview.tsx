import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, FileText, Calendar, User } from "lucide-react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { FeatureAccessIndicator } from "@/components/navigation/FeatureAccessIndicator";

export const FiduciaryReview = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasAdvancedReview = checkFeatureAccessByKey('premium_analytics_access');

  const [reviewForm, setReviewForm] = useState({
    contractName: "",
    provider: "",
    premium: "",
    objectives: "",
    riskTolerance: ""
  });

  const mockReviewResults = {
    fiduciaryScore: 92,
    recommendations: [
      {
        type: "positive",
        title: "Low Fee Structure",
        description: "Annual fees of 0.75% are below industry average"
      },
      {
        type: "warning", 
        title: "Surrender Period",
        description: "7-year surrender period may limit liquidity options"
      },
      {
        type: "positive",
        title: "Death Benefit Protection",
        description: "Strong beneficiary protection features included"
      }
    ],
    compliance: {
      suitability: "Pass",
      disclosure: "Complete",
      fiduciaryStandard: "Meets Requirements"
    }
  };

  const handleSubmitReview = () => {
    console.log("Submitting fiduciary review:", reviewForm);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 80) return { label: "Good", color: "bg-blue-500" };
    if (score >= 70) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Poor", color: "bg-red-500" };
  };

  const scoreBadge = getScoreBadge(mockReviewResults.fiduciaryScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fiduciary Review</h1>
          <p className="text-muted-foreground">
            Independent analysis ensuring your annuity recommendation meets fiduciary standards
          </p>
        </div>
        <FeatureAccessIndicator feature="premium_analytics_access" />
      </div>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Information
          </CardTitle>
          <CardDescription>
            Provide details about the annuity contract for review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractName">Contract Name</Label>
              <Input
                id="contractName"
                placeholder="Enter contract name"
                value={reviewForm.contractName}
                onChange={(e) => setReviewForm({...reviewForm, contractName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Insurance Provider</Label>
              <Input
                id="provider"
                placeholder="Enter provider name"
                value={reviewForm.provider}
                onChange={(e) => setReviewForm({...reviewForm, provider: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="premium">Premium Amount</Label>
            <Input
              id="premium"
              placeholder="Enter premium amount"
              value={reviewForm.premium}
              onChange={(e) => setReviewForm({...reviewForm, premium: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Investment Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="Describe investment goals and objectives"
              value={reviewForm.objectives}
              onChange={(e) => setReviewForm({...reviewForm, objectives: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
            <Textarea
              id="riskTolerance"
              placeholder="Describe risk tolerance and constraints"
              value={reviewForm.riskTolerance}
              onChange={(e) => setReviewForm({...reviewForm, riskTolerance: e.target.value})}
            />
          </div>

          <Button 
            onClick={handleSubmitReview}
            className="w-full"
            disabled={!hasAdvancedReview}
          >
            <Shield className="h-4 w-4 mr-2" />
            Submit for Fiduciary Review
          </Button>
        </CardContent>
      </Card>

      {/* Review Results (Demo) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fiduciary Analysis Results
              </CardTitle>
              <CardDescription>
                Independent review by certified fiduciary analysts
              </CardDescription>
            </div>
            <Badge className={`${scoreBadge.color} text-white`}>
              Score: {mockReviewResults.fiduciaryScore}/100 - {scoreBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="font-semibold">Key Findings</h3>
            {mockReviewResults.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3 p-3 border rounded-lg">
                {rec.type === "positive" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Check */}
          <div>
            <h3 className="font-semibold mb-3">Compliance Verification</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(mockReviewResults.compliance).map(([key, value]) => (
                <div key={key} className="text-center p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="font-medium text-green-600">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <ul className="text-sm space-y-1">
              <li>• Review surrender period implications with client</li>
              <li>• Document suitability rationale in client file</li>
              <li>• Schedule annual review appointment</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Consultation */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Need Expert Consultation?
          </CardTitle>
          <CardDescription>
            Schedule a consultation with our fiduciary experts for complex cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Schedule Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};