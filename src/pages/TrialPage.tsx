
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function TrialPage() {
  // Mock data for demonstration
  const trialStarted = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
  const trialEnds = new Date(trialStarted.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days after start
  const daysRemaining = Math.ceil((trialEnds.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  return (
    <ThreeColumnLayout activeMainItem="trial">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your 90-Day Trial</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Trial Status</CardTitle>
            <CardDescription>Your free trial expires in {daysRemaining} days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
            
            <div className="pt-4">
              <Button className="w-full">Upgrade to Premium</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trial Features</CardTitle>
            <CardDescription>All features available during your trial</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Full financial dashboard</li>
              <li>Account aggregation</li>
              <li>Investment tracking</li>
              <li>Secure document vault</li>
              <li>Basic financial planning tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
