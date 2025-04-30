
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Building, 
  CreditCard, 
  FileText, 
  PlusCircle, 
  Shield, 
  UserPlus 
} from "lucide-react";
import { Link } from "react-router-dom";

export const DefaultDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Boutique Family Office</h1>
          <p className="text-muted-foreground">
            Your personalized wealth management platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Family Members
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Link Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Financial Summary
            </CardTitle>
            <CardDescription>View all your accounts in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Link your accounts to see your financial summary
            </p>
            <div className="mt-4">
              <Button variant="secondary" asChild className="w-full">
                <Link to="/accounts">View Accounts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Investment Performance
            </CardTitle>
            <CardDescription>Track your investment growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Link your investment accounts to track performance
            </p>
            <div className="mt-4">
              <Button variant="secondary" asChild className="w-full">
                <Link to="/investments">View Investments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Properties
            </CardTitle>
            <CardDescription>Manage your real estate portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Properties</div>
            <p className="text-xs text-muted-foreground">
              Add your properties to track their value
            </p>
            <div className="mt-4">
              <Button variant="secondary" asChild className="w-full">
                <Link to="/properties">Manage Properties</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription>Important files and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Securely store and access important documents
            </div>
            <Button variant="secondary" asChild className="w-full">
              <Link to="/documents">View Documents</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Estate Planning
            </CardTitle>
            <CardDescription>Protect your legacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Ensure your estate is managed according to your wishes
            </div>
            <Button variant="secondary" asChild className="w-full">
              <Link to="/estate-planning">Create Estate Plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
