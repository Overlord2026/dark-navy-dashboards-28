
import React, { useEffect, useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { runSystemHealthCheck, SystemHealthSummary as HealthSummaryType } from "@/services/diagnostics/systemHealthService";
import { SystemHealthSummary } from "@/components/diagnostics/SystemHealthSummary";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SystemDiagnosticsPage() {
  const [summary, setSummary] = useState<HealthSummaryType | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await runSystemHealthCheck();
      setSummary(results);
      toast.success("System diagnostics completed");
    } catch (error) {
      console.error("Failed to run diagnostics:", error);
      toast.error("Failed to run system diagnostics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have permission to access diagnostics");
      navigate('/dashboard');
      return;
    }
    
    runDiagnostics();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics"
      title="System Diagnostics"
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            {summary && (
              <SystemHealthSummary 
                summary={summary}
                onRefresh={runDiagnostics}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
