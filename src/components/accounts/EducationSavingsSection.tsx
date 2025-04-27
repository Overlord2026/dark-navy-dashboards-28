
import React from 'react';
import {
  GraduationCap,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountSection } from "@/components/accounts/AccountSection";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";

interface EducationSavingsSectionProps {
  onAddAccount: (type: string) => void;
}

export const EducationSavingsSection: React.FC<EducationSavingsSectionProps> = ({
  onAddAccount,
}) => {
  return (
    <AccountSection
      icon={<GraduationCap className="h-5 w-5 text-purple-500 bg-black p-1 rounded-full" />}
      title="Education Savings"
      amount="$0.00"
      initiallyOpen={false}
    >
      <div className="space-y-4">
        <EmptyAccountSection
          message="No education savings accounts linked. Add your 529 Plans and other college savings accounts."
          buttonText="Add Education Account"
          onAddAccount={() => onAddAccount("education")}
        />
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Supported Account Types:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 529 College Savings Plans</li>
            <li>• Coverdell Education Savings Accounts (ESA)</li>
            <li>• UGMA/UTMA Accounts</li>
            <li>• Prepaid Tuition Plans</li>
          </ul>
        </div>
      </div>
    </AccountSection>
  );
};
