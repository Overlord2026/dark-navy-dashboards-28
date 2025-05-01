
import React, { useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";

export default function TrialPage() {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  const navigate = useNavigate();
  const { startFreeTrial, isInFreeTrial, daysRemainingInTrial } = useSubscription();
  
  // Mock data for demonstration if not already in trial
  const trialStarted = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
  const trialEnds = new Date(trialStarted.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days after start
  const calculatedDaysRemaining = Math.ceil((trialEnds.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  // Use actual days remaining if in trial, otherwise use calculated value
  const daysRemaining = isInFreeTrial ? daysRemainingInTrial : calculatedDaysRemaining;
  
  const handleStartTrial = () => {
    startFreeTrial();
    navigate(segment ? `/dashboard?segment=${segment}` : '/dashboard');
  };
  
  const getSegmentTitle = () => {
    switch (segment) {
      case 'aspiring':
        return "Aspiring Wealthy";
      case 'preretirees':
        return "Pre-Retirees & Retirees";
      case 'ultrahnw':
        return "Ultra-High Net Worth";
      default:
        return "Premium";
    }
  };
  
  return (
    <ThreeColumnLayout activeMainItem="trial">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your 90-Day Trial</h1>
          {segment && (
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {getSegmentTitle()}
            </div>
          )}
        </div>
        
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>Start Your Free Trial</CardTitle>
            <CardDescription>
              {segment 
                ? `Get full access to all ${getSegmentTitle()} features for 90 days`
                : "Get full access to all premium features for 90 days"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {isInFreeTrial ? (
              <>
                <div className="p-4 bg-green-50 text-green-700 rounded-md">
                  Your trial is active! You have {daysRemainingInTrial} days remaining.
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>{trialStarted.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ends:</span>
                    <span>{trialEnds.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Remaining:</span>
                    <span className="font-semibold">{daysRemaining}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(1 - daysRemaining / 90) * 100}%` }}
                  ></div>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(segment ? `/dashboard?segment=${segment}` : '/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button className="flex-1" variant="outline">
                    Extend Trial
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <p className="text-lg">
                    Experience all the premium features our platform has to offer with no commitment.
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Full financial dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Account aggregation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Investment tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Secure document vault</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Basic financial planning tools</span>
                    </li>
                  </ul>
                  
                  <div className="pt-4 flex gap-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                      onClick={handleStartTrial}
                    >
                      Start 90-Day Free Trial
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>No Credit Card Required</CardTitle>
            <CardDescription>Try all features with zero risk</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              We're confident you'll love our platform, which is why we offer a full 90-day trial without requiring a credit card. 
              You'll get reminders before your trial ends, and you can upgrade to continue enjoying premium features.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
