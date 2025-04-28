
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ChevronRight, Gauge, BarChart, Network } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AdminActions() {
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Administration
        </CardTitle>
        <CardDescription>
          Administrative actions and system settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Integration Status - Moved from header */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/integration" className="flex items-center justify-between w-full p-2 rounded-md bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition-colors">
                  <div className="flex items-center">
                    <Network className="h-4 w-4 mr-2" />
                    <span>Connected</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Part of Family Office Architecture</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link to="/system-health">
              <div className="flex items-center">
                <Gauge className="mr-2 h-4 w-4" />
                System Health Dashboard
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link to="/system-diagnostics">
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Full System Diagnostics
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
