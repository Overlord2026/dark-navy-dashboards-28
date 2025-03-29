
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { auditLog } from "@/services/auditLog/auditLogService";

const Index = () => {
  useEffect(() => {
    // Log a simulated publish event for demonstration
    auditLog.log(
      "system-user", // userId 
      "settings_change", // action type
      "success", // status
      {
        userName: "Admin User",
        userRole: "Admin",
        ipAddress: "192.168.1.100",
        resourceType: "Website Content",
        resourceId: "main-site-20230615",
        details: {
          action: "publish",
          environment: "production",
          twoFactorVerified: true,
          authMethod: "SMS",
          changedFiles: ["src/components/HomePage.tsx", "src/styles/main.css"],
          diff: `--- src/components/HomePage.tsx\n+++ src/components/HomePage.tsx\n@@ -12,7 +12,7 @@\n const HomePage = () => {\n   return (\n     <div>\n-      <h1>Welcome to Our Platform</h1>\n+      <h1>Welcome to Our Updated Platform</h1>\n       <p>Lorem ipsum dolor sit amet</p>\n     </div>\n   );\n`
        }
      }
    );
    
    // Log a simulated collaboration guidelines confirmation
    auditLog.log(
      "developer-user", 
      "settings_change", 
      "success", 
      {
        userName: "Developer User",
        userRole: "Developer",
        ipAddress: "192.168.1.105",
        resourceType: "Collaboration Guidelines",
        details: {
          action: "confirm_guidelines",
          timeStamp: new Date().toISOString(),
          guidelinesVersion: "1.2"
        }
      }
    );
  }, []);

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
