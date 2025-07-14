import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthCard } from "@/components/healthcare/HealthCard";
import { useHealthData } from "@/hooks/useHealthData";
import { useToast } from "@/hooks/use-toast";
import { 
  ActivityIcon, 
  HeartIcon, 
  CalendarIcon, 
  FileTextIcon,
  AlertTriangleIcon,
  PillIcon,
  PlusIcon,
  RefreshCwIcon
} from "lucide-react";

const HealthcareDashboard: React.FC = () => {
  const { metrics, loading, error, addHealthMetric, refetch } = useHealthData();
  const { toast } = useToast();

  // Process metrics for display
  const processedMetrics = React.useMemo(() => {
    const latest = metrics.reduce((acc, metric) => {
      if (!acc[metric.type] || new Date(metric.date) > new Date(acc[metric.type].date)) {
        acc[metric.type] = metric;
      }
      return acc;
    }, {} as Record<string, typeof metrics[0]>);

    return [
      {
        title: "Blood Pressure",
        value: latest.blood_pressure?.value || "120/80",
        status: "success" as const,
        icon: <HeartIcon className="h-6 w-6" />
      },
      {
        title: "Heart Rate",
        value: latest.heart_rate ? `${latest.heart_rate.value} BPM` : "72 BPM",
        status: "success" as const,
        icon: <ActivityIcon className="h-6 w-6" />
      },
      {
        title: "Weight",
        value: latest.weight ? `${latest.weight.value} ${latest.weight.unit || 'lbs'}` : "-- lbs",
        status: "info" as const,
        icon: <ActivityIcon className="h-6 w-6" />
      },
      {
        title: "Total Metrics",
        value: metrics.length.toString(),
        status: "info" as const,
        icon: <FileTextIcon className="h-6 w-6" />
      }
    ];
  }, [metrics]);

  const handleAddSampleMetric = async () => {
    try {
      await addHealthMetric({
        type: 'blood_pressure',
        value: '120/80',
        unit: 'mmHg',
        date: new Date().toISOString().split('T')[0],
        notes: 'Morning reading'
      });
      toast({
        title: "Success",
        description: "Sample health metric added successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add health metric",
        variant: "destructive"
      });
    }
  };

  // Mock data for demonstration
  const staticMetrics = [
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
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </Card>
            ))
          ) : error ? (
            <Card className="col-span-full p-6 border-destructive">
              <p className="text-destructive">Error loading health data: {error}</p>
              <Button onClick={refetch} className="mt-2" variant="outline" size="sm">
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </Card>
          ) : (
            processedMetrics.map((metric, index) => (
              <HealthCard
                key={index}
                title={metric.title}
                value={metric.value}
                status={metric.status}
                icon={metric.icon}
              />
            ))
          )}
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
              <Button 
                onClick={handleAddSampleMetric}
                className="w-full justify-start h-auto p-3"
                variant="outline"
              >
                <PlusIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Log Health Metric</div>
                  <div className="text-sm text-muted-foreground">Record blood pressure, weight, etc.</div>
                </div>
              </Button>
              <Button 
                className="w-full justify-start h-auto p-3"
                variant="outline"
                disabled
              >
                <CalendarIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Schedule Appointment</div>
                  <div className="text-sm text-muted-foreground">Book with your healthcare provider</div>
                </div>
              </Button>
              <Button 
                className="w-full justify-start h-auto p-3"
                variant="outline"
                disabled
              >
                <FileTextIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Upload Document</div>
                  <div className="text-sm text-muted-foreground">Add medical records or reports</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;