
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity, FileText, AlertTriangle, Gauge } from "lucide-react";

const SystemDiagnosticsPage = () => {
  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics"
      title="System Diagnostics"
    >
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">System Diagnostics</h1>
          <p className="text-muted-foreground">
            Comprehensive diagnostics and monitoring tools for system health, performance, and accessibility.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Error Simulation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test system behavior with controlled error scenarios.
                  </p>
                  <Link to="/diagnostics/error-simulation">
                    <Button>
                      Error Simulation
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Visual Testing</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Capture and compare visual snapshots across the application.
                  </p>
                  <Link to="/diagnostics/visual-testing">
                    <Button>
                      Visual Testing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Accessibility Audit</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan for accessibility issues and get recommendations.
                  </p>
                  <Link to="/diagnostics/accessibility-audit">
                    <Button>
                      Accessibility Audit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Performance Diagnostics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Measure and analyze page load times and resource utilization.
                  </p>
                  <Link to="/diagnostics/performance">
                    <Button>
                      Performance Metrics
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default SystemDiagnosticsPage;
