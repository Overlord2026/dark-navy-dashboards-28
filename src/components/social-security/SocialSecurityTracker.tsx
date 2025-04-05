
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarClock, DollarSign, Plus, Calculator } from "lucide-react";
import { mockSocialSecurityBenefits } from "@/data/mock/socialSecurity";

export const SocialSecurityTracker: React.FC = () => {
  const socialSecurityBenefits = mockSocialSecurityBenefits;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Social Security Benefits</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track estimated benefits and eligibility
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Benefits
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Beneficiary
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {socialSecurityBenefits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Benefit Type</TableHead>
                <TableHead>Monthly Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Annual Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialSecurityBenefits.map((benefit) => (
                <TableRow key={benefit.id}>
                  <TableCell className="font-medium">
                    {benefit.beneficiaryName}
                    <div className="text-xs text-muted-foreground">{benefit.relationship}</div>
                  </TableCell>
                  <TableCell>{benefit.benefitType}</TableCell>
                  <TableCell>{formatCurrency(benefit.monthlyAmount)}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                    {benefit.startDate}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      benefit.status === 'active' ? 'bg-green-100 text-green-800' :
                      benefit.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {benefit.status.charAt(0).toUpperCase() + benefit.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <DollarSign className="h-3.5 w-3.5" />
                      {formatCurrency(benefit.estimatedAnnualTotal)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarClock className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No Benefits Tracked Yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Add beneficiaries to start tracking social security benefits for your family.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Beneficiary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
