
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Banking</CardTitle>
            <CardDescription>Access banking features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/cash-management">Cash Management</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/banking-transfers">Transfers</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/funding-accounts">Funding Accounts</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Settings & Debug</CardTitle>
            <CardDescription>System settings and diagnostic tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/debug">Debug</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
