import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Shield,
  AlertTriangle,
  Calculator,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InsuranceLifeHomePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Users,
      title: "Add Life Insurance Lead",
      description: "Capture new prospects for life insurance needs",
      action: () => navigate('/insurance/life/leads')
    },
    {
      icon: MessageSquare,
      title: "Start Meeting",
      description: "Record or import client meeting",
      action: () => navigate('/insurance/life/meetings')
    },
    {
      icon: Calculator,
      title: "1035 Exchange Analysis",
      description: "Analyze 1035 exchange suitability",
      action: () => navigate('/insurance/life/tools?tool=1035')
    },
    {
      icon: Shield,
      title: "Life Needs Analysis",
      description: "Calculate insurance coverage needs",
      action: () => navigate('/insurance/life/tools?tool=life-needs')
    },
    {
      icon: FileText,
      title: "Beneficiary Review",
      description: "Review and update beneficiary information",
      action: () => navigate('/insurance/life/tools?tool=beneficiary')
    },
    {
      icon: Eye,
      title: "View Proof & Compliance",
      description: "Access receipts and audit trail",
      action: () => navigate('/insurance/life/proof')
    }
  ];

  const metrics = [
    { label: "Active Prospects", value: "12", change: "+3" },
    { label: "1035 Exchanges YTD", value: "8", change: "+2" },
    { label: "Life Policies Issued", value: "24", change: "+6" },
    { label: "Avg Coverage Amount", value: "$485K", change: "+12%" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Life Insurance Dashboard</h1>
          <p className="text-muted-foreground">
            Fiduciary-first life insurance and annuity analysis
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Compliance Ready</span>
        </div>
      </div>

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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="h-4 w-4 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">1035 Exchange Approved</p>
                <p className="text-xs text-muted-foreground">Patricia Wilson - Suitability confirmed</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <FileText className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Beneficiary Update Complete</p>
                <p className="text-xs text-muted-foreground">Michael Chen - Primary beneficiary changed</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Life Needs Review Required</p>
                <p className="text-xs text-muted-foreground">Jennifer Davis - Coverage gap identified</p>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}