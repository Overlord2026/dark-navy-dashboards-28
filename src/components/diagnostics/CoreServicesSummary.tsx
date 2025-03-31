
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusIcon } from "./StatusIcon";
import { Skeleton } from "@/components/ui/skeleton";

export interface CoreServicesSummaryProps {
  report: any;
  isLoading: boolean;
}

export const CoreServicesSummary = ({ report, isLoading }: CoreServicesSummaryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no report is available yet, show empty state
  if (!report) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Run diagnostics to see system health summary
          </p>
        </CardContent>
      </Card>
    );
  }

  const services = [
    { key: "navigation", title: "Navigation Routing" },
    { key: "forms", title: "Form Validation" },
    { key: "database", title: "Database Connection" },
    { key: "api", title: "API Integration" },
    { key: "authentication", title: "Authentication" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.key}
              className="p-4 rounded-lg border flex items-start gap-2"
            >
              <StatusIcon status={report[service.key]?.status || "warning"} />
              <div>
                <h3 className="font-medium">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {report[service.key]?.message || "No data available"}
                </p>
              </div>
            </div>
          ))}
          <div className="p-4 rounded-lg border flex items-start gap-2">
            <StatusIcon status={report.overall || "warning"} />
            <div>
              <h3 className="font-medium">Overall System Health</h3>
              <p className="text-sm text-muted-foreground">
                {report.overall === "success"
                  ? "All systems operational"
                  : report.overall === "warning"
                  ? "Some services require attention"
                  : "Critical issues detected"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
