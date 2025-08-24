import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Shield,
  Phone,
  Calendar,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicareHomePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Users,
      title: "Add Medicare Lead",
      description: "Capture new prospects with PTC consent",
      action: () => navigate('/medicare/leads')
    },
    {
      icon: MessageSquare,
      title: "Start SOA Meeting",
      description: "Begin Scope of Appointment process",
      action: () => navigate('/medicare/soa')
    },
    {
      icon: Phone,
      title: "Record Sales Call",
      description: "Start compliant call recording",
      action: () => navigate('/medicare/calls')
    },
    {
      icon: FileText,
      title: "PECL & Enrollment",
      description: "Process enrollment documentation",
      action: () => navigate('/medicare/enrollment')
    },
    {
      icon: Calendar,
      title: "AEP Campaigns",
      description: "Manage Annual Enrollment Period outreach",
      action: () => navigate('/medicare/campaigns')
    },
    {
      icon: Eye,
      title: "Compliance Proof",
      description: "10-year retention audit trail",
      action: () => navigate('/medicare/proof')
    }
  ];

  const metrics = [
    { label: "Active Medicare Leads", value: "18", change: "+5" },
    { label: "SOAs Completed", value: "12", change: "+3" },
    { label: "Enrollments YTD", value: "34", change: "+8" },
    { label: "Compliance Score", value: "98%", change: "+2%" }
  ];

  const complianceAlerts = [
    {
      type: "warning",
      message: "3 leads need DNC verification",
      action: "Review DNC Status"
    },
    {
      type: "info", 
      message: "AEP deadline in 15 days",
      action: "View AEP Pipeline"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicare Dashboard</h1>
          <p className="text-muted-foreground">
            Compliant Medicare & supplement sales workflow
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>10-Year Retention Ready</span>
        </div>
      </div>

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white">
                  <span className="text-sm">{alert.message}</span>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={action.action}>
                  <div className="flex items-start gap-3">
                    <action.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Medicare Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="h-4 w-4 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">SOA Completed & Signed</p>
                <p className="text-xs text-muted-foreground">Robert Johnson - Medicare Advantage review</p>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sales Call Recorded</p>
                <p className="text-xs text-muted-foreground">Maria Garcia - Medigap Plan F discussion</p>
              </div>
              <span className="text-xs text-muted-foreground">3 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">DNC Verification Needed</p>
                <p className="text-xs text-muted-foreground">William Chen - Lead requires DNC check</p>
              </div>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}