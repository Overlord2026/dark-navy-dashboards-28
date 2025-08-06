import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, DollarSign, Calculator, FileDown, MessageSquare, TrendingUp } from 'lucide-react';

interface LenderReview {
  id: string;
  rating: number;
  review_title: string;
  review_text: string;
  loan_type: string;
  approval_speed_rating: number;
  communication_rating: number;
  terms_satisfaction_rating: number;
  would_recommend: boolean;
  created_at: string;
}

interface LoanScenario {
  id: string;
  scenario_name: string;
  base_loan_amount: number;
  base_interest_rate: number;
  base_term_months: number;
  scenario_type: string;
  calculated_results: any;
}

export function LendingEnhancedFeatures() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_title: '',
    review_text: '',
    loan_type: '',
    approval_speed_rating: 5,
    communication_rating: 5,
    terms_satisfaction_rating: 5,
    would_recommend: true
  });

  // Scenario form state
  const [scenarioForm, setScenarioForm] = useState({
    scenario_name: '',
    base_loan_amount: 0,
    base_interest_rate: 0,
    base_term_months: 360,
    scenario_type: 'early_payoff',
    extra_monthly_payment: 0
  });

  const handleSubmitReview = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('lender_reviews')
        .insert([{
          ...reviewForm,
          lender_partner_id: 'example-lender-id', // Would be dynamic
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      setReviewForm({
        rating: 5,
        review_title: '',
        review_text: '',
        loan_type: '',
        approval_speed_rating: 5,
        communication_rating: 5,
        terms_satisfaction_rating: 5,
        would_recommend: true
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScenario = async () => {
    setIsLoading(true);
    try {
      const params = {
        extra_monthly_payment: scenarioForm.extra_monthly_payment
      };

      const { data, error } = await supabase.rpc('calculate_loan_scenario', {
        p_loan_amount: scenarioForm.base_loan_amount,
        p_interest_rate: scenarioForm.base_interest_rate / 100,
        p_term_months: scenarioForm.base_term_months,
        p_scenario_type: scenarioForm.scenario_type,
        p_scenario_params: params
      });

      if (error) throw error;

      // Save scenario
      const { error: saveError } = await supabase
        .from('loan_scenarios')
        .insert([{
          ...scenarioForm,
          calculated_results: data,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (saveError) throw saveError;

      toast({
        title: "Scenario Calculated",
        description: "Your loan scenario has been saved!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate scenario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('lending_pdf_exports')
        .insert([{
          export_type: 'offers_summary',
          pdf_content: {
            title: 'Lending Offers Summary',
            generated_at: new Date().toISOString()
          },
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "PDF Export Started",
        description: "Your PDF will be ready for download shortly!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start PDF export",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Enhanced Lending Features</h2>
          <p className="text-muted-foreground">Advanced tools for your lending experience</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} disabled={isLoading} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">
            <Star className="h-4 w-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <Calculator className="h-4 w-4 mr-2" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <DollarSign className="h-4 w-4 mr-2" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave a Lender Review</CardTitle>
              <CardDescription>
                Help other families by sharing your lending experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    value={reviewForm.review_title}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, review_title: e.target.value }))}
                    placeholder="Great experience with quick approval"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-type">Loan Type</Label>
                  <Select value={reviewForm.loan_type} onValueChange={(value) => setReviewForm(prev => ({ ...prev, loan_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="heloc">HELOC</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="bridge">Bridge Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Overall Rating</Label>
                  <StarRating 
                    value={reviewForm.rating} 
                    onChange={(value) => setReviewForm(prev => ({ ...prev, rating: value }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Approval Speed</Label>
                  <StarRating 
                    value={reviewForm.approval_speed_rating} 
                    onChange={(value) => setReviewForm(prev => ({ ...prev, approval_speed_rating: value }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Communication</Label>
                  <StarRating 
                    value={reviewForm.communication_rating} 
                    onChange={(value) => setReviewForm(prev => ({ ...prev, communication_rating: value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-text">Review Details</Label>
                <Textarea
                  id="review-text"
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Share your experience with this lender..."
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmitReview} disabled={isLoading} className="w-full">
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Payment Scenarios</CardTitle>
              <CardDescription>
                Calculate different payment scenarios to optimize your loan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                    id="scenario-name"
                    value={scenarioForm.scenario_name}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, scenario_name: e.target.value }))}
                    placeholder="Early payoff scenario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={scenarioForm.base_loan_amount}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, base_loan_amount: Number(e.target.value) }))}
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.01"
                    value={scenarioForm.base_interest_rate}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, base_interest_rate: Number(e.target.value) }))}
                    placeholder="6.25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-months">Term (Months)</Label>
                  <Input
                    id="term-months"
                    type="number"
                    value={scenarioForm.base_term_months}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, base_term_months: Number(e.target.value) }))}
                    placeholder="360"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extra-payment">Extra Monthly Payment ($)</Label>
                  <Input
                    id="extra-payment"
                    type="number"
                    value={scenarioForm.extra_monthly_payment}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, extra_monthly_payment: Number(e.target.value) }))}
                    placeholder="500"
                  />
                </div>
              </div>

              <Button onClick={calculateScenario} disabled={isLoading} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Scenario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracker</CardTitle>
              <CardDescription>
                Track your lending referral commissions and revenue share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground">$12,450</div>
                  <div className="text-sm text-muted-foreground">Total Commissions</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground">$3,200</div>
                  <div className="text-sm text-muted-foreground">Pending Payment</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Badge className="text-lg px-3 py-1">8</Badge>
                  <div className="text-sm text-muted-foreground mt-2">Active Referrals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Alert Settings</CardTitle>
              <CardDescription>
                Get instant notifications about your lending applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Application Status Updates</div>
                  <div className="text-sm text-muted-foreground">Get notified when your application status changes</div>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Offer Ready Alerts</div>
                  <div className="text-sm text-muted-foreground">Instant notification when lender offers are available</div>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Document Requests</div>
                  <div className="text-sm text-muted-foreground">Alerts when additional documents are needed</div>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}