import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthCard } from "@/components/healthcare/HealthCard";
import { 
  ActivityIcon, 
  HeartIcon, 
  CalendarIcon, 
  FileTextIcon,
  AlertTriangleIcon,
  PillIcon
} from "lucide-react";

const HealthcareDashboard: React.FC = () => {
  // Mock data for demonstration
  const healthMetrics = [
    {
      title: "Blood Pressure",
      value: "120/80",
      status: "success" as const,
      icon: <HeartIcon className="h-6 w-6" />
    },
    {
      title: "Heart Rate",
      value: "72 BPM",
      status: "success" as const,
      icon: <ActivityIcon className="h-6 w-6" />
    },
    {
      title: "Next Appointment",
      value: "Dec 15",
      status: "info" as const,
      icon: <CalendarIcon className="h-6 w-6" />
    },
    {
      title: "Documents",
      value: "8",
      status: "info" as const,
      icon: <FileTextIcon className="h-6 w-6" />
    }
  ];

  const alerts = [
    {
      id: "1",
      type: "medication" as const,
      title: "Medication Reminder",
      message: "Take your evening medication",
      priority: "high" as const,
      status: "active" as const
    },
    {
      id: "2",
      type: "appointment" as const,
      title: "Upcoming Appointment",
      message: "Annual checkup with Dr. Smith in 2 days",
      priority: "medium" as const,
      status: "active" as const
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your health metrics, appointments, and documents
          </p>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <HealthCard
              key={index}
              title={metric.title}
              value={metric.value}
              status={metric.status}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">Active Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                    <Badge variant={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PillIcon className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="font-medium text-foreground">Log Health Metric</div>
                <div className="text-sm text-muted-foreground">Record blood pressure, weight, etc.</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="font-medium text-foreground">Schedule Appointment</div>
                <div className="text-sm text-muted-foreground">Book with your healthcare provider</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="font-medium text-foreground">Upload Document</div>
                <div className="text-sm text-muted-foreground">Add medical records or reports</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;