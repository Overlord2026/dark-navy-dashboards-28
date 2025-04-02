
import React from "react";
import { SidebarDiagnostics } from "@/components/diagnostics/SidebarDiagnostics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DebugPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Diagnostic Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SidebarDiagnostics />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banking Navigation</CardTitle>
              <CardDescription>Test Banking feature navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/cash-management">Cash Management</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/banking-transfers">Banking Transfers</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/funding-accounts">Funding Accounts</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Navigation Tests</CardTitle>
              <CardDescription>Test other navigation paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">Settings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/professionals">Professionals</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
