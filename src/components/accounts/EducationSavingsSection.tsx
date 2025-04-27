
import React from 'react';
import {
  GraduationCap,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountSection } from "@/components/accounts/AccountSection";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EducationSavingsSectionProps {
  onAddAccount: (type: string) => void;
}

export const EducationSavingsSection: React.FC<EducationSavingsSectionProps> = ({
  onAddAccount,
}) => {
  // This would typically come from your account data
  const hasAccounts = false;
  const totalSavings = 0;
  const projectedValue = 0;
  const nextContribution = new Date().toLocaleDateString();

  return (
    <AccountSection
      icon={<GraduationCap className="h-5 w-5 text-purple-500 bg-black p-1 rounded-full" />}
      title="Education Savings"
      amount={`$${totalSavings.toLocaleString()}`}
      initiallyOpen={true}
    >
      <div className="space-y-4">
        {!hasAccounts ? (
          <>
            <EmptyAccountSection
              message="No education savings accounts linked. Add your 529 Plans and other college savings accounts."
              buttonText="Add Education Account"
              onAddAccount={() => onAddAccount("education")}
            />
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Link your education savings accounts to get personalized insights and track your progress towards education goals.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Projected Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${projectedValue.toLocaleString()}</div>
                <CardDescription>By graduation date</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Next Contribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nextContribution}</div>
                <CardDescription>Automatic deposit scheduled</CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Supported Account Types:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              529 College Savings Plans
            </li>
            <li className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Coverdell Education Savings Accounts (ESA)
            </li>
            <li className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              UGMA/UTMA Accounts
            </li>
            <li className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Prepaid Tuition Plans
            </li>
          </ul>
        </div>
      </div>
    </AccountSection>
  );
};
