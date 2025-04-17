
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserSquare } from "lucide-react";

export const TaxProfessionals: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserSquare className="mr-2 h-5 w-5 text-primary" />
          Tax Planning Professionals
        </CardTitle>
        <CardDescription>
          Connect with certified tax professionals in our network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">CPAs</CardTitle>
              <CardDescription>Certified Public Accountants</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Experts in tax preparation, planning, and compliance who can handle complex tax situations.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full">Find a CPA</Button>
            </CardFooter>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Tax Attorneys</CardTitle>
              <CardDescription>Legal Tax Experts</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Specialized attorneys who can handle complex tax matters, disputes, and legal tax planning.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full">Find a Tax Attorney</Button>
            </CardFooter>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Enrolled Agents</CardTitle>
              <CardDescription>IRS-Certified Specialists</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Federally-licensed tax practitioners who can represent taxpayers before the IRS.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full">Find an Enrolled Agent</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-6 flex justify-center">
          <Button>View All Tax Professionals</Button>
        </div>
      </CardContent>
    </Card>
  );
};
