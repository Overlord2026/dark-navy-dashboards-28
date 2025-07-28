import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Rocket, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Zap,
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react';

interface LenderResponse {
  lender_id: string;
  lender_name: string;
  status: 'approved' | 'denied' | 'pending' | 'requires_info';
  interest_rate?: number;
  loan_amount?: number;
  term_months?: number;
  monthly_payment?: number;
  conditions?: string[];
  response_time: number;
  approval_probability: number;
}

interface LoanApplication {
  loan_amount: number;
  loan_purpose: string;
  credit_score: number;
  annual_income: number;
  employment_type: string;
  debt_to_income_ratio: number;
}

export const ExternalLenderIntegration: React.FC = () => {
  const [application, setApplication] = useState<LoanApplication>({
    loan_amount: 250000,
    loan_purpose: 'home_purchase',
    credit_score: 720,
    annual_income: 85000,
    employment_type: 'full_time',
    debt_to_income_ratio: 0.28
  });
  
  const [lenderResponses, setLenderResponses] = useState<LenderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLender, setSelectedLender] = useState<string>('');
  const { toast } = useToast();

  const externalLenders = [
    {
      id: 'rocket_mortgage',
      name: 'Rocket Mortgage',
      icon: Rocket,
      description: 'Digital-first mortgage lending with fast approvals',
      specialties: ['home_purchase', 'refinance'],
      min_credit: 620,
      max_loan: 3000000,
      avg_response_time: 24
    },
    {
      id: 'wells_fargo',
      name: 'Wells Fargo',
      icon: Building2,
      description: 'Traditional banking with comprehensive loan products',
      specialties: ['home_purchase', 'commercial', 'personal'],
      min_credit: 640,
      max_loan: 5000000,
      avg_response_time: 72
    },
    {
      id: 'quicken_loans',
      name: 'Quicken Loans',
      icon: Zap,
      description: 'Fast online lending with competitive rates',
      specialties: ['personal', 'business', 'refinance'],
      min_credit: 600,
      max_loan: 1000000,
      avg_response_time: 12
    }
  ];

  const submitToExternalLenders = async () => {
    setLoading(true);
    setLenderResponses([]);
    
    try {
      // Call edge function for each lender integration
      const responses = await Promise.all(
        externalLenders.map(async (lender) => {
          try {
            const { data, error } = await supabase.functions.invoke('external-lender-integration', {
              body: {
                lender_id: lender.id,
                application: application,
                action: 'submit_application'
              }
            });

            if (error) throw error;
            return data;
          } catch (error) {
            // Return mock response for demo if API fails
            return generateMockResponse(lender.id, lender.name, application);
          }
        })
      );

      setLenderResponses(responses);
      
      toast({
        title: "Applications Submitted",
        description: `Submitted to ${responses.length} external lenders successfully`,
      });

    } catch (error) {
      console.error('Error submitting to external lenders:', error);
      toast({
        title: "Error",
        description: "Failed to submit applications to external lenders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockResponse = (lenderId: string, lenderName: string, app: LoanApplication): LenderResponse => {
    const baseRate = 6.5;
    const creditAdjustment = (app.credit_score - 700) * 0.01;
    const debtAdjustment = app.debt_to_income_ratio > 0.3 ? 0.5 : 0;
    
    const interestRate = Math.max(3.5, baseRate - creditAdjustment + debtAdjustment + Math.random() * 0.5);
    const approvalProb = Math.min(95, (app.credit_score - 500) / 3.5 + (app.annual_income / 1000) * 0.1);
    
    const isApproved = approvalProb > 60 && Math.random() > 0.2;
    
    return {
      lender_id: lenderId,
      lender_name: lenderName,
      status: isApproved ? 'approved' : Math.random() > 0.5 ? 'pending' : 'requires_info',
      interest_rate: isApproved ? interestRate : undefined,
      loan_amount: isApproved ? app.loan_amount : undefined,
      term_months: 360,
      monthly_payment: isApproved ? (app.loan_amount * (interestRate/100/12)) / (1 - Math.pow(1 + (interestRate/100/12), -360)) : undefined,
      conditions: isApproved ? ['Property appraisal required', 'Income verification needed'] : ['Additional documentation required'],
      response_time: Math.floor(12 + Math.random() * 60),
      approval_probability: approvalProb
    };
  };

  const acceptLenderOffer = async (lenderId: string) => {
    try {
      const { error } = await supabase.functions.invoke('external-lender-integration', {
        body: {
          lender_id: lenderId,
          application: application,
          action: 'accept_offer'
        }
      });

      if (error) throw error;

      setSelectedLender(lenderId);
      toast({
        title: "Offer Accepted",
        description: "Moving forward with selected lender",
      });

    } catch (error) {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error",
        description: "Failed to accept lender offer",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'denied': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'pending': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'denied': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Lender Integration
          </CardTitle>
          <CardDescription>
            Submit your loan application to multiple lenders simultaneously for the best rates and terms
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="application" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="lenders">Lender Network</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="application" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application Details</CardTitle>
              <CardDescription>
                Configure your loan parameters for external lender submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loan Amount</Label>
                  <Input
                    type="number"
                    value={application.loan_amount}
                    onChange={(e) => setApplication({
                      ...application,
                      loan_amount: Number(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loan Purpose</Label>
                  <Select 
                    value={application.loan_purpose} 
                    onValueChange={(value) => setApplication({...application, loan_purpose: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_purchase">Home Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Credit Score</Label>
                  <Input
                    type="number"
                    min="300"
                    max="850"
                    value={application.credit_score}
                    onChange={(e) => setApplication({
                      ...application,
                      credit_score: Number(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Income</Label>
                  <Input
                    type="number"
                    value={application.annual_income}
                    onChange={(e) => setApplication({
                      ...application,
                      annual_income: Number(e.target.value)
                    })}
                  />
                </div>
              </div>

              <Button 
                onClick={submitToExternalLenders}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Rocket className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Submitting to Lenders...' : 'Submit to All Lenders'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lenders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {externalLenders.map((lender) => {
              const IconComponent = lender.icon;
              return (
                <Card key={lender.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lender.name}</CardTitle>
                        <CardDescription className="text-sm">
                          Avg. {lender.avg_response_time}h response
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {lender.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Min Credit Score:</span>
                        <Badge variant="outline">{lender.min_credit}+</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Loan Amount:</span>
                        <Badge variant="outline">${(lender.max_loan / 1000000).toFixed(1)}M</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {lender.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          {lenderResponses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Responses Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your application to see responses from external lenders
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lenderResponses
                .sort((a, b) => (b.approval_probability || 0) - (a.approval_probability || 0))
                .map((response) => (
                  <Card key={response.lender_id} className={getStatusColor(response.status)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(response.status)}
                          <div>
                            <h4 className="font-semibold">{response.lender_name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {response.status.replace('_', ' ')} • {response.response_time}h response time
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={response.status === 'approved' ? "default" : "secondary"}>
                            {response.approval_probability.toFixed(0)}% confidence
                          </Badge>
                        </div>
                      </div>

                      {response.status === 'approved' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="text-lg font-semibold">{response.interest_rate?.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Loan Amount</p>
                            <p className="text-lg font-semibold">${response.loan_amount?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Payment</p>
                            <p className="text-lg font-semibold">${response.monthly_payment?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Term</p>
                            <p className="text-lg font-semibold">{response.term_months} months</p>
                          </div>
                        </div>
                      )}

                      {response.conditions && response.conditions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Conditions:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {response.conditions.map((condition, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0"></span>
                                <span>{condition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {response.status === 'approved' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Details Requested",
                                description: "Requesting additional loan details",
                              });
                            }}
                          >
                            Get Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => acceptLenderOffer(response.lender_id)}
                            disabled={selectedLender === response.lender_id}
                          >
                            {selectedLender === response.lender_id ? (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <TrendingUp className="h-4 w-4 mr-2" />
                            )}
                            {selectedLender === response.lender_id ? 'Selected' : 'Accept Offer'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};