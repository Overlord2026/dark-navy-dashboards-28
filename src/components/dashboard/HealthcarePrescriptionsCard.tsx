
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Calendar, AlertTriangle } from 'lucide-react';
import { useHealthcare } from '@/hooks/useHealthcare';
import { format, isAfter, isBefore, addDays } from 'date-fns';

export const HealthcarePrescriptionsCard: React.FC = () => {
  const { prescriptions, loading } = useHealthcare();

  // Calculate prescription alerts
  const getUpcomingRefills = () => {
    const today = new Date();
    const weekFromNow = addDays(today, 7);
    
    return prescriptions.filter(prescription => {
      const refillDate = new Date(prescription.next_refill);
      return isBefore(refillDate, weekFromNow) && isAfter(refillDate, today);
    });
  };

  const getOverdueRefills = () => {
    const today = new Date();
    return prescriptions.filter(prescription => {
      const refillDate = new Date(prescription.next_refill);
      return isBefore(refillDate, today);
    });
  };

  const upcomingRefills = getUpcomingRefills();
  const overdueRefills = getOverdueRefills();
  const totalAlerts = upcomingRefills.length + overdueRefills.length;

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prescriptions & Refills</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Prescriptions & Refills</CardTitle>
        <Pill className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prescriptions.length}</div>
        <p className="text-xs text-muted-foreground mb-3">
          Total prescriptions
        </p>
        
        {totalAlerts > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${
                overdueRefills.length > 0 ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <span className="text-sm font-medium">
                {totalAlerts} Alert{totalAlerts !== 1 ? 's' : ''}
              </span>
            </div>
            
            {overdueRefills.length > 0 && (
              <div className="text-xs text-red-600">
                {overdueRefills.length} overdue refill{overdueRefills.length !== 1 ? 's' : ''}
              </div>
            )}
            
            {upcomingRefills.length > 0 && (
              <div className="text-xs text-yellow-600">
                {upcomingRefills.length} due within 7 days
              </div>
            )}
          </div>
        )}
        
        {totalAlerts === 0 && prescriptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              All up to date
            </Badge>
          </div>
        )}
        
        {prescriptions.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No prescriptions added yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};
