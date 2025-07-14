import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, CalendarIcon } from "lucide-react";

const WealthBillPay = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bill Pay</h1>
          <p className="text-muted-foreground">Automated bill payment and management</p>
        </div>
        <Badge variant="secondary">Coming Soon</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            Bill Pay Service
          </CardTitle>
          <CardDescription>This feature is currently in development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our comprehensive bill pay service will include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Automated recurring payments</li>
            <li>Bill scheduling and reminders</li>
            <li>Payment history and tracking</li>
            <li>Vendor management</li>
            <li>Integration with your bank accounts</li>
          </ul>
          <div className="pt-4">
            <Button disabled>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Get Notified When Available
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WealthBillPay;