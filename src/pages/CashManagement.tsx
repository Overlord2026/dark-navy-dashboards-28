
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const CashManagement = () => {
  return (
    <ThreeColumnLayout title="Cash Management">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Cash Management</CardTitle>
            <CardDescription className="text-base">
              Advanced cash flow optimization and management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="warning" className="text-sm px-4 py-2">
              Coming Soon
            </Badge>
            <p className="text-muted-foreground mt-4 text-sm">
              We're working on bringing you comprehensive cash management features. 
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
