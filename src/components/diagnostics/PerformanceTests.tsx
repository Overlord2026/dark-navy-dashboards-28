
import { Activity, Clock, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
            <Collapsible key={index}>
              <div className={`p-4 rounded-md border ${getStatusColor(test.status)}`}>
                <CollapsibleTrigger className="w-full text-left">
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
                </CollapsibleTrigger>
                
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
                
                <CollapsibleContent>
                  <div className="border-t mt-4 pt-4">
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Detailed Performance Analysis:</h4>
                      <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                        <p>[{new Date().toISOString()}] Performance test results for {test.name}</p>
                        <p>Endpoint: {test.endpoint}</p>
                        <p>Response Time: {test.responseTime}ms</p>
                        <p>CPU Usage: {test.cpuUsage}%</p>
                        <p>Memory Usage: {test.memoryUsage}MB</p>
                        <p>Concurrent Users: {test.concurrentUsers}</p>
                        <p>Status: {test.status}</p>
                      </div>
                    </div>
                    
                    {test.status !== "success" && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommendations:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {test.responseTime > 1000 && (
                            <li>Optimize endpoint response time - current value exceeds recommended threshold</li>
                          )}
                          {test.cpuUsage > 70 && (
                            <li>High CPU usage detected - review resource-intensive operations</li>
                          )}
                          {test.memoryUsage > 500 && (
                            <li>High memory consumption - check for potential memory leaks</li>
                          )}
                          {test.concurrentUsers < 10 && (
                            <li>Low concurrency support - improve scalability for production use</li>
                          )}
                          <li>Consider implementing caching mechanisms to improve performance</li>
                          <li>Review database queries for optimization opportunities</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
