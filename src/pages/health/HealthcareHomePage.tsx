import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  Eye,
  AlertTriangle,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthcareHomePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Users,
      title: "Add Patient Lead",
      description: "Capture new patients with HIPAA consent",
      action: () => navigate('/health/leads')
    },
    {
      icon: MessageSquare,
      title: "Start Consultation",
      description: "Begin consent-driven patient meeting",
      action: () => navigate('/health/meetings')
    },
    {
      icon: Activity,
      title: "Screening Planner",
      description: "Plan and order patient screenings",
      action: () => navigate('/health/tools?tool=screenings')
    },
    {
      icon: FileText,
      title: "Consent Passport",
      description: "Manage HIPAA consent and sharing",
      action: () => navigate('/health/tools?tool=consent')
    },
    {
      icon: Calendar,
      title: "Cohort Programs",
      description: "Educational cohort management",
      action: () => navigate('/health/campaigns')
    },
    {
      icon: Eye,
      title: "Compliance Proof",
      description: "Patient-scoped audit trail",
      action: () => navigate('/health/proof')
    }
  ];

  const metrics = [
    { label: "Active Patients", value: "24", change: "+6" },
    { label: "Consent Passports", value: "18", change: "+4" },
    { label: "Screenings Ordered", value: "15", change: "+8" },
    { label: "HIPAA Compliance", value: "100%", change: "0%" }
  ];

  const consentAlerts = [
    {
      type: "warning",
      message: "2 consent passports expire in 7 days",
      action: "Review Consents"
    },
    {
      type: "info", 
      message: "New screening protocols available",
      action: "View Protocols"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare Dashboard</h1>
          <p className="text-muted-foreground">
            HIPAA-compliant patient collaboration with consent-driven sharing
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>HIPAA Compliant</span>
        </div>
      </div>

      {/* Consent Alerts */}
      {consentAlerts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <AlertTriangle className="h-5 w-5" />
              Consent & Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consentAlerts.map((alert, index) => (
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
          <CardTitle>Recent Healthcare Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="h-4 w-4 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Consent Passport Updated</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson - Added screening consent</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Activity className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Screening Ordered</p>
                <p className="text-xs text-muted-foreground">Michael Davis - Lipid panel and A1C</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Heart className="h-4 w-4 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cohort Program Started</p>
                <p className="text-xs text-muted-foreground">Diabetes Education - 8 participants enrolled</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}