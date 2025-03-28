
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { 
  CalendarIcon, 
  ClockIcon,
  SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const toggleMetrics = () => {
    setShowBusinessMetrics(!showBusinessMetrics);
  };

  return (
    <ThreeColumnLayout activeMainItem="home" title="Dashboard">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse-slow flex flex-col items-center">
            <div className="h-10 w-48 bg-card rounded-md mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-6xl">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Family or Client Name Dashboard</h1>
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center mt-2 md:mt-0 text-muted-foreground">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>Last updated: Today at 10:45 AM</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMetrics}
                className="mt-2 md:mt-0"
              >
                <SettingsIcon className="h-4 w-4 mr-1" />
                {showBusinessMetrics ? "Show Personal" : "Show Business"}
              </Button>
            </div>
          </div>
          
          <NetWorthSummary />
          
          <FinancialOverview showBusinessMetrics={showBusinessMetrics} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecentActivity />
            
            <DashboardCard
              title="Upcoming Tax Deadlines"
              className="md:col-span-2"
            >
              <div className="space-y-4">
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">Quarterly Tax Filing</h4>
                      <p className="text-sm">Federal income tax deadline</p>
                    </div>
                    <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">
                      15 days left
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">State Sales Tax</h4>
                      <p className="text-sm">Monthly sales tax report</p>
                    </div>
                    <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-medium">
                      22 days left
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">Payroll Tax Deposit</h4>
                      <p className="text-sm">Monthly employer federal tax</p>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      30 days left
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </ThreeColumnLayout>
  );
};

export default Dashboard;
