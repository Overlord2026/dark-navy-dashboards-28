import React, { useMemo, useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthCard } from "@/components/healthcare/HealthCard";
import { useHealthData } from "@/hooks/healthcare/useHealthData";
import { useToast } from "@/hooks/use-toast";
import { HealthcareErrorBoundary } from "@/components/healthcare/HealthcareErrorBoundary";
import { HealthcareDashboardSkeleton, HealthCardSkeleton, AlertsSkeleton, QuickActionsSkeleton } from "@/components/ui/skeletons/HealthcareSkeletons";
import { HealthcarePerformanceMonitor } from "@/components/debug/HealthcarePerformanceMonitor";
import { 
  ActivityIcon, 
  HeartIcon, 
  CalendarIcon, 
  FileTextIcon,
  AlertTriangleIcon,
  PillIcon,
  PlusIcon,
  RefreshCwIcon,
  UploadIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthcareDashboard: React.FC = () => {
  const { 
    metrics, 
    isLoading, 
    error, 
    createMetric, 
    refetch, 
    processedMetrics: hookProcessedMetrics,
    healthStats 
  } = useHealthData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [renderCount, setRenderCount] = useState(0);

  // Performance tracking
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Memoized display metrics with fallback data
  const displayMetrics = useMemo(() => {
    const latest = hookProcessedMetrics.latest;
    
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
        value: hookProcessedMetrics.totalCount.toString(),
        status: "info" as const,
        icon: <FileTextIcon className="h-6 w-6" />
      }
    ];
  }, [hookProcessedMetrics]);

  const handleAddSampleMetric = useCallback(async () => {
    try {
      await createMetric({
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
  }, [createMetric, toast]);

  // Memoized static data to prevent re-creation
  const alerts = useMemo(() => [
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
  ], []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  }, []);

  // Show loading skeleton immediately
  if (isLoading) {
    return <HealthcareDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Performance Monitor - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4">
            <HealthcarePerformanceMonitor
              componentName="HealthcareDashboard"
              renderCount={renderCount}
              cacheHits={hookProcessedMetrics.totalCount}
              memoizedCalculations={4}
            />
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your health metrics, appointments, and documents
          </p>
        </div>

        {/* Health Metrics Grid */}
        <HealthcareErrorBoundary componentName="Health Metrics Grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {error ? (
              <Card className="col-span-full p-6 border-destructive">
                <p className="text-destructive">Error loading health data: {error}</p>
                <Button onClick={refetch} className="mt-2" variant="outline" size="sm">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </Card>
            ) : (
              displayMetrics.map((metric, index) => (
                <HealthcareErrorBoundary key={index} componentName={`Health Card ${metric.title}`}>
                  <HealthCard
                    title={metric.title}
                    value={metric.value}
                    status={metric.status}
                    icon={metric.icon}
                  />
                </HealthcareErrorBoundary>
              ))
            )}
          </div>
        </HealthcareErrorBoundary>

        {/* Alerts and Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthcareErrorBoundary componentName="Active Alerts">
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
          </HealthcareErrorBoundary>

          <HealthcareErrorBoundary componentName="Quick Actions">
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
                  onClick={() => navigate('/health/documents')}
                >
                  <UploadIcon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Documents</div>
                    <div className="text-sm text-muted-foreground">Upload and organize medical records</div>
                  </div>
                </Button>
              </div>
            </Card>
          </HealthcareErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;