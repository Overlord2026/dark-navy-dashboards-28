
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useLocation, useSearchParams } from "react-router-dom";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdminActions } from "@/components/dashboard/AdminActions";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { apiSecurity } from "@/services/api/security/apiSecurityService";
import { logger } from "@/services/logging/loggingService";

export default function Dashboard() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  const { userProfile } = useUser();
  
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  
  useEffect(() => {
    // Log dashboard access with segment information using our enhanced logger
    logger.info(`Dashboard accessed with segment: ${segment || 'default'}`, { 
      segment,
      path: location.pathname 
    }, 'Dashboard');
  }, [segment, location.pathname]);
  
  const renderDashboardContent = () => {
    switch (segment) {
      case 'aspiring':
        return <AspiringDashboard segment={segment} />;
      case 'preretirees':
        return <PreRetireesDashboard segment={segment} />;
      case 'ultrahnw':
        return <UltraHNWDashboard segment={segment} />;
      default:
        return <DefaultDashboard />;
    }
  };
  
  return (
    <ThreeColumnLayout activeMainItem="dashboard">
      <div className="space-y-6">
        {/* API Security Banner for admins */}
        {isAdmin && (
          <Card className="border-blue-100 bg-blue-50">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-700">Enhanced API Security Active</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                Your API calls are now protected with circuit breakers, PII protection, and enhanced error handling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/integration" className="text-blue-600 border-blue-200 hover:bg-blue-100">
                    View API Security <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Main dashboard content */}
        {renderDashboardContent()}
        
        {/* Admin actions - only visible to admin users */}
        {isAdmin && <AdminActions />}
      </div>
    </ThreeColumnLayout>
  );
}
