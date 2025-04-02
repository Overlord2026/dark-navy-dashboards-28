
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sidebar Settings</CardTitle>
          <CardDescription>Diagnostic tools for sidebar navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/debug">
              Go to Sidebar Diagnostics
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>App Navigation</CardTitle>
          <CardDescription>Quick access to main features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/cash-management">Cash Management</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/banking-transfers">Transfers</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/funding-accounts">Funding Accounts</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
