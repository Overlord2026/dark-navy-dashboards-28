
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ChevronRight, Gauge, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

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
          {/* Integration Status removed */}
          
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
