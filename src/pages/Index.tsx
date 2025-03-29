import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="text-xl font-semibold">IP Protection</h3>
              <p className="text-muted-foreground text-center">Manage IP ownership, security settings and role permissions</p>
              <Link to="/ip-protection" className="text-blue-500 hover:underline">Configure Settings →</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
