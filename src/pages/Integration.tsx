
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Integration() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/integration" && currentPath === "/integration") {
      return true;
    }
    return currentPath.startsWith(path);
  };

  return (
    <ThreeColumnLayout activeMainItem="integration" title="Project Integration">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <Tabs value={getTabValue(currentPath)} onValueChange={(value) => navigate(value)}>
            <TabsList className="w-full justify-start p-0 bg-muted/20 border-b rounded-none px-4">
              <TabsTrigger value="/integration" className="data-[state=active]:bg-background rounded-none rounded-t-md">
                Connected Projects
              </TabsTrigger>
              <TabsTrigger value="/integration/architecture" className="data-[state=active]:bg-background rounded-none rounded-t-md">
                Architecture
              </TabsTrigger>
              <TabsTrigger value="/integration/api" className="data-[state=active]:bg-background rounded-none rounded-t-md">
                API Integrations
              </TabsTrigger>
              <TabsTrigger value="/integration/plugins" className="data-[state=active]:bg-background rounded-none rounded-t-md">
                Plugins
              </TabsTrigger>
              <TabsTrigger value="/integration/feedback" className="data-[state=active]:bg-background rounded-none rounded-t-md">
                Feedback
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
        <Outlet />
      </div>
    </ThreeColumnLayout>
  );
}

function getTabValue(path: string): string {
  if (path === "/integration") return "/integration";
  if (path.startsWith("/integration/architecture")) return "/integration/architecture";
  if (path.startsWith("/integration/api")) return "/integration/api";
  if (path.startsWith("/integration/plugins")) return "/integration/plugins";
  if (path.startsWith("/integration/feedback")) return "/integration/feedback";
  return "/integration";
}
