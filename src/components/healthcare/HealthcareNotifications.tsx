import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Hospital, User, MapPin, AlertCircle, Pill, Badge } from "@/components/ui/badge-extended";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { CalendarClock } from "lucide-react";

// Define interfaces for the component props
export interface UpcomingAppointment {
  id: string;
  title: string;
  doctor: string;
  location: string;
  date: Date | string;
  time: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextRefill: Date | string;
  doctor?: string;
  pharmacy?: string;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  endDate: string;
  provider?: string;
  coverage?: string;
  policyNumber?: string;
}

interface HealthcareNotificationsProps {
  upcomingAppointments: UpcomingAppointment[];
  medications: Medication[];
  policies?: InsurancePolicy[];
}

export const HealthcareNotifications: React.FC<HealthcareNotificationsProps> = ({
  upcomingAppointments,
  medications,
  policies = []
}) => {
  const [activeTab, setActiveTab] = useState<string>("appointments");
  
  const handleReminderSetup = (type: string, id: string) => {
    // For demo purposes, we'll just log this and show a toast
    // In a real app, this would integrate with a notification system
    const userId = "current-user"; // In a real app, this would come from auth context
    
    auditLog.log(
      userId,
      type === "appointment" ? "appointment_reminder" : 
      type === "medication" ? "medication_reminder" : "insurance_reminder",
      "success",
      {
        resourceId: id,
        resourceType: `healthcare_${type}`,
        details: {
          action: "set_reminder",
          type
        }
      }
    );
    
    toast.success(`Reminder set up successfully for ${type}`);
  };
  
  const getDaysRemaining = (date: Date | string): number => {
    if (!date) return 0;
    
    try {
      const targetDate = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      
      // Reset time part for accurate day calculation
      today.setHours(0, 0, 0, 0);
      const targetWithoutTime = new Date(targetDate);
      targetWithoutTime.setHours(0, 0, 0, 0);
      
      const diffTime = targetWithoutTime.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };
  
  const getUrgencyColor = (days: number): string => {
    if (days < 0) return "text-red-500";
    if (days < 3) return "text-amber-500";
    if (days < 7) return "text-yellow-500";
    return "text-green-500";
  };
  
  const getUrgencyBadge = (days: number) => {
    if (days < 0) {
      return <BadgeComponent variant="destructive">Overdue</BadgeComponent>;
    }
    if (days < 3) {
      return <BadgeComponent variant="destructive">Urgent</BadgeComponent>;
    }
    if (days < 7) {
      return <BadgeComponent variant="warning">Soon</BadgeComponent>;
    }
    return <BadgeComponent variant="outline">Upcoming</BadgeComponent>;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Healthcare Reminders</h2>
        <p className="text-muted-foreground">
          Manage your upcoming healthcare appointments, medication refills, and insurance renewals
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-1">
            <Pill className="h-4 w-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-1">
            <Badge className="h-4 w-4" />
            Insurance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appointment => {
                const daysUntil = getDaysRemaining(appointment.date);
                const appointmentDate = typeof appointment.date === 'string' 
                  ? new Date(appointment.date) 
                  : appointment.date;
                
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{appointment.title}</span>
                        {getUrgencyBadge(daysUntil)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className={getUrgencyColor(daysUntil)}>
                            {appointmentDate.toLocaleDateString()} 
                            ({daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : daysUntil === 0 ? "Today" : `in ${daysUntil} days`})
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2" />
                          <span>{appointment.doctor}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{appointment.location}</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start text-sm">
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleReminderSetup("appointment", appointment.id)}
                      >
                        Set Reminder
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No upcoming appointments scheduled</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="medications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.length > 0 ? (
              medications.map(medication => {
                const daysUntil = getDaysRemaining(medication.nextRefill);
                const refillDate = typeof medication.nextRefill === 'string' 
                  ? new Date(medication.nextRefill) 
                  : medication.nextRefill;
                
                return (
                  <Card key={medication.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{medication.name}</span>
                        {getUrgencyBadge(daysUntil)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Pill className="h-4 w-4 mr-2" />
                          <span>{medication.dosage}, {medication.frequency}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className={getUrgencyColor(daysUntil)}>
                            Next refill: {refillDate.toLocaleDateString()} 
                            ({daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : daysUntil === 0 ? "Today" : `in ${daysUntil} days`})
                          </span>
                        </div>
                        {medication.doctor && (
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2" />
                            <span>Prescribed by: {medication.doctor}</span>
                          </div>
                        )}
                        {medication.pharmacy && (
                          <div className="flex items-center text-sm">
                            <Hospital className="h-4 w-4 mr-2" />
                            <span>Pharmacy: {medication.pharmacy}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleReminderSetup("medication", medication.id)}
                      >
                        Set Refill Reminder
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No medications to track</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insurance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies && policies.length > 0 ? (
              policies.map(policy => {
                const daysUntil = getDaysRemaining(policy.endDate);
                
                return (
                  <Card key={policy.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{policy.name}</span>
                        {getUrgencyBadge(daysUntil)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className={getUrgencyColor(daysUntil)}>
                            Renewal: {new Date(policy.endDate).toLocaleDateString()} 
                            ({daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : daysUntil === 0 ? "Today" : `in ${daysUntil} days`})
                          </span>
                        </div>
                        {policy.provider && (
                          <div className="flex items-center text-sm">
                            <Badge className="h-4 w-4 mr-2" />
                            <span>Provider: {policy.provider}</span>
                          </div>
                        )}
                        {policy.policyNumber && (
                          <div className="flex items-center text-sm">
                            <Badge className="h-4 w-4 mr-2" />
                            <span>Policy #: {policy.policyNumber}</span>
                          </div>
                        )}
                        {policy.coverage && (
                          <div className="flex items-center text-sm">
                            <Badge className="h-4 w-4 mr-2" />
                            <span>Coverage: {policy.coverage}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleReminderSetup("insurance", policy.id)}
                      >
                        Set Renewal Reminder
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No insurance policies to track</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
