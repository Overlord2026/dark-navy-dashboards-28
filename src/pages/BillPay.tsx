
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarCheck, FileText, Upload, Settings, BookOpen } from "lucide-react";

const BillPay = () => {
  return (
    <ThreeColumnLayout title="Bill Pay">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bill Pay</h1>
            <p className="text-muted-foreground mt-1">
              Manage, schedule, and track all your bill payments
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/finance/bill-inbox">
                <Upload className="h-4 w-4 mr-2" /> Upload Bill
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/finance/bill-pay/style-guide">
                <BookOpen className="h-4 w-4 mr-2" /> Style Guide
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" /> 
                Upcoming Bills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage your upcoming bills and payment schedules
              </p>
              <Button variant="secondary" className="w-full mt-4">View Bills</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5 text-primary" /> 
                Bill Inbox
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload and process your bills with AI-assisted parsing
              </p>
              <Button variant="secondary" className="w-full mt-4" asChild>
                <Link to="/finance/bill-inbox">Open Inbox</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5 text-primary" /> 
                Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage your scheduled payments and recurring bills
              </p>
              <Button variant="secondary" className="w-full mt-4">View Schedule</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-primary" /> 
                Bill Pay Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with external services to enhance your bill payment capabilities
              </p>
              <Button variant="secondary" className="mt-4">Manage Integrations</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default BillPay;
