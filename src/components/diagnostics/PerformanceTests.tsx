
import { Activity, Clock, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const PerformanceTests = ({ tests, isLoading = false }: PerformanceTestsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance & Load Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance & Load Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className={`p-4 rounded-md border ${getStatusColor(test.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-2">
                  <StatusIcon status={test.status} />
                  <div>
                    <span className="font-medium">{test.name}</span>
                    <p className="text-sm text-muted-foreground">Endpoint: {test.endpoint}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.status}
                </span>
              </div>
              
              <p className="text-sm mb-3">{test.message}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> Response Time
                    </span>
                    <span className={test.responseTime > 1000 ? "text-destructive" : 
                                     test.responseTime > 500 ? "text-amber-500" : 
                                     "text-emerald-500"}>
                      {test.responseTime}ms
                    </span>
                  </div>
                  <Progress value={Math.min(100, (test.responseTime / 15))} 
                            className={test.responseTime > 1000 ? "text-destructive" : 
                                       test.responseTime > 500 ? "text-amber-500" : 
                                       "text-emerald-500"} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Cpu className="h-3 w-3" /> CPU Usage
                    </span>
                    <span className={test.cpuUsage > 70 ? "text-destructive" : 
                                     test.cpuUsage > 40 ? "text-amber-500" : 
                                     "text-emerald-500"}>
                      {test.cpuUsage}%
                    </span>
                  </div>
                  <Progress value={test.cpuUsage} 
                            className={test.cpuUsage > 70 ? "text-destructive" : 
                                       test.cpuUsage > 40 ? "text-amber-500" : 
                                       "text-emerald-500"} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      Concurrent Users
                    </span>
                    <span>{test.concurrentUsers}</span>
                  </div>
                  <Progress value={Math.min(100, (test.concurrentUsers / 1.5))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
