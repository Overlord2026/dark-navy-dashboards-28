import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Shield, Users, Pill, CalendarClock, Heart } from "lucide-react";
import { DocumentItem } from "@/types/document";
import { Button } from "@/components/ui/button";
import { HealthcareNotificationCenter } from "./HealthcareNotificationCenter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge-extended";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface HealthcareDashboardProps {
  documents: DocumentItem[];
}

interface InsurancePolicy {
  id: string;
  name: string;
  provider: string;
  type: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  coverageAmount: string;
  documentId?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextRefill: string;
  doctor: string;
  pharmacy: string;
}

interface Physician {
  id: string;
  name: string;
  specialty: string;
  facility: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
}

interface HealthcareAppointment {
  id: string;
  title: string;
  doctor: string;
  location: string;
  date: string;
  time: string;
  notes?: string;
}

export function HealthcareDashboard({ documents }: HealthcareDashboardProps) {
  const [insurancePolicies, setInsurancePolicies] = useLocalStorage<InsurancePolicy[]>("healthcare-insurance", []);
  const [medications, setMedications] = useLocalStorage<Medication[]>("healthcare-medications", []);
  const [physicians, setPhysicians] = useLocalStorage<Physician[]>("healthcare-physicians", []);
  const [appointments, setAppointments] = useLocalStorage<HealthcareAppointment[]>("healthcare-appointments", []);
  
  // Ensure we have sample data if none exists
  useEffect(() => {
    if (insurancePolicies.length === 0) {
      setInsurancePolicies([
        {
          id: "ins-1",
          name: "Medicare Advantage Plan",
          provider: "Blue Cross Blue Shield",
          type: "Health",
          policyNumber: "MA1234567",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          renewalDate: "2023-11-01",
          coverageAmount: "$0 premium, $3,500 out-of-pocket max"
        },
        {
          id: "ins-2",
          name: "Medicare Supplement Plan F",
          provider: "Aetna",
          type: "Health",
          policyNumber: "MSF7654321",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          renewalDate: "2023-11-15",
          coverageAmount: "$175/month premium"
        },
        {
          id: "ins-3",
          name: "Dental Insurance",
          provider: "Delta Dental",
          type: "Dental",
          policyNumber: "DD9876543",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          renewalDate: "2023-11-30",
          coverageAmount: "$25/month premium, $1,500 annual max"
        }
      ]);
    }
    
    if (medications.length === 0) {
      setMedications([
        { 
          id: "med-1", 
          name: "Lisinopril", 
          dosage: "20mg", 
          frequency: "Once daily", 
          nextRefill: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          doctor: "Dr. Smith",
          pharmacy: "CVS Pharmacy"
        },
        { 
          id: "med-2", 
          name: "Metformin", 
          dosage: "500mg", 
          frequency: "Twice daily", 
          nextRefill: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
          doctor: "Dr. Johnson",
          pharmacy: "Walgreens"
        },
        { 
          id: "med-3", 
          name: "Atorvastatin", 
          dosage: "10mg", 
          frequency: "Once daily", 
          nextRefill: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
          doctor: "Dr. Smith",
          pharmacy: "CVS Pharmacy"
        }
      ]);
    }
    
    if (physicians.length === 0) {
      setPhysicians([
        {
          id: "phy-1",
          name: "Dr. Sarah Smith",
          specialty: "Primary Care",
          facility: "City Medical Group",
          phone: "(555) 123-4567",
          email: "dr.smith@citymedical.com",
          lastVisit: "2023-05-15",
          nextAppointment: "2023-11-15"
        },
        {
          id: "phy-2",
          name: "Dr. James Johnson",
          specialty: "Cardiology",
          facility: "Heart Specialists",
          phone: "(555) 234-5678",
          email: "dr.johnson@heartspecialists.com",
          lastVisit: "2023-04-20"
        },
        {
          id: "phy-3",
          name: "Dr. Robert Williams",
          specialty: "Endocrinology",
          facility: "Diabetes Care Center",
          phone: "(555) 345-6789",
          email: "dr.williams@diabetescenter.com",
          lastVisit: "2023-06-10"
        }
      ]);
    }
    
    if (appointments.length === 0) {
      setAppointments([
        {
          id: "apt-1",
          title: "Annual Physical",
          doctor: "Dr. Sarah Smith",
          location: "City Medical Group",
          date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
          time: "10:00 AM",
          notes: "Fasting required"
        },
        {
          id: "apt-2",
          title: "Cardiology Follow-up",
          doctor: "Dr. James Johnson",
          location: "Heart Specialists",
          date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          time: "2:30 PM",
          notes: "Bring medication list"
        },
        {
          id: "apt-3",
          title: "Lab Work",
          doctor: "Metro Health Partners",
          location: "Metro Health Lab",
          date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
          time: "8:15 AM",
          notes: "Fasting required"
        }
      ]);
    }
  }, [
    insurancePolicies, setInsurancePolicies, 
    medications, setMedications, 
    physicians, setPhysicians,
    appointments, setAppointments
  ]);
  
  const healthDocumentsByCategory = documents.filter(
    doc => ['healthcare', 'insurance-coverage', 'prescriptions', 'physicians', 'medical-records'].includes(doc.category)
  );
  
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const upcomingRenewals = insurancePolicies
    .filter(policy => new Date(policy.renewalDate) > new Date())
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
  
  const upcomingRefills = medications
    .filter(med => new Date(med.nextRefill) > new Date())
    .sort((a, b) => new Date(a.nextRefill).getTime() - new Date(b.nextRefill).getTime());
  
  // Calculate days to show urgency
  const getDaysFromNow = (date: Date | string): number => {
    if (!date) return 0;
    
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return Math.ceil((dateObject.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Get badge variant based on days remaining
  const getUrgencyBadge = (days: number) => {
    if (days <= 3) return "destructive";
    if (days <= 7) return "warning";
    return "outline";
  };
  
  // Document completion metrics
  const documentCategories = [
    { id: "insurance-coverage", name: "Insurance Documents", expected: 3 },
    { id: "prescriptions", name: "Prescription Records", expected: 3 },
    { id: "physicians", name: "Physician Information", expected: 3 },
    { id: "medical-records", name: "Medical Records", expected: 3 }
  ];
  
  const calculateCompletion = (categoryId: string): number => {
    const docsInCategory = healthDocumentsByCategory.filter(doc => doc.category === categoryId).length;
    const expected = documentCategories.find(cat => cat.id === categoryId)?.expected || 0;
    return expected > 0 ? Math.min(Math.round((docsInCategory / expected) * 100), 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Insurance Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insurancePolicies.length > 0 ? (
                <div className="space-y-3">
                  {insurancePolicies.map(policy => (
                    <div key={policy.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{policy.name}</h3>
                          <p className="text-sm text-muted-foreground">{policy.provider}</p>
                        </div>
                        <Badge variant="outline">{policy.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Policy #:</span> {policy.policyNumber}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Coverage:</span> {policy.coverageAmount}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Expires:</span> {new Date(policy.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <span className="text-muted-foreground">Renewal:</span> {new Date(policy.renewalDate).toLocaleDateString()}
                          
                          {new Date(policy.renewalDate) > new Date() && 
                            new Date(policy.renewalDate) < new Date(new Date().setDate(new Date().getDate() + 30)) && (
                            <Badge variant={getUrgencyBadge(getDaysFromNow(policy.renewalDate))} className="text-[10px] px-1 py-0">
                              Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No insurance policies added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                Prescriptions & Refills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medications.length > 0 ? (
                <div className="space-y-3">
                  {medications.map(medication => (
                    <div key={medication.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{medication.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage}, {medication.frequency}
                          </p>
                        </div>
                        
                        {getDaysFromNow(medication.nextRefill) <= 7 && (
                          <Badge variant={getUrgencyBadge(getDaysFromNow(medication.nextRefill))}>
                            Refill soon
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next refill:</span>
                          <span>{new Date(medication.nextRefill).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground">Prescribed by:</span>
                          <span>{medication.doctor}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground">Pharmacy:</span>
                          <span>{medication.pharmacy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No medications added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments" className="text-xs">Appointments</TabsTrigger>
                <TabsTrigger value="renewals" className="text-xs">Policy Renewals</TabsTrigger>
                <TabsTrigger value="refills" className="text-xs">Medication Refills</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="pt-4">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map(appointment => (
                      <div key={appointment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="bg-accent rounded-md w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{format(new Date(appointment.date), 'MMM')}</span>
                          <span className="text-lg font-bold">{format(new Date(appointment.date), 'd')}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{appointment.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {appointment.doctor}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                        
                        <Badge variant={getUrgencyBadge(getDaysFromNow(appointment.date))}>
                          {getDaysFromNow(appointment.date) === 0 ? 'Today' : 
                           getDaysFromNow(appointment.date) === 1 ? 'Tomorrow' : 
                           `${getDaysFromNow(appointment.date)} days`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No upcoming appointments</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="renewals" className="pt-4">
                {upcomingRenewals.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingRenewals.slice(0, 3).map(policy => (
                      <div key={policy.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="bg-accent rounded-md w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{format(new Date(policy.renewalDate), 'MMM')}</span>
                          <span className="text-lg font-bold">{format(new Date(policy.renewalDate), 'd')}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{policy.name}</h3>
                          <p className="text-xs text-muted-foreground">{policy.provider}</p>
                        </div>
                        
                        <Badge variant={getUrgencyBadge(getDaysFromNow(policy.renewalDate))}>
                          {getDaysFromNow(policy.renewalDate) <= 30 ? 
                            `${getDaysFromNow(policy.renewalDate)} days` : 
                            format(new Date(policy.renewalDate), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No upcoming policy renewals</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="refills" className="pt-4">
                {upcomingRefills.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingRefills.slice(0, 3).map(medication => (
                      <div key={medication.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="bg-accent rounded-md w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{format(new Date(medication.nextRefill), 'MMM')}</span>
                          <span className="text-lg font-bold">{format(new Date(medication.nextRefill), 'd')}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{medication.name}</h3>
                          <p className="text-xs text-muted-foreground">{medication.dosage}, {medication.frequency}</p>
                        </div>
                        
                        <Badge variant={getUrgencyBadge(getDaysFromNow(medication.nextRefill))}>
                          {getDaysFromNow(medication.nextRefill) === 0 ? 'Today' : 
                           getDaysFromNow(medication.nextRefill) === 1 ? 'Tomorrow' : 
                           `${getDaysFromNow(medication.nextRefill)} days`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No upcoming medication refills</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Physicians & Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {physicians.length > 0 ? (
                <div className="space-y-3">
                  {physicians.map(physician => (
                    <div key={physician.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{physician.name}</h3>
                          <p className="text-sm text-muted-foreground">{physician.specialty}</p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="inline-block w-20">Facility:</span> {physician.facility}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="inline-block w-20">Phone:</span> {physician.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="inline-block w-20">Email:</span> {physician.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="inline-block w-20">Last visit:</span> {new Date(physician.lastVisit).toLocaleDateString()}
                        </p>
                        {physician.nextAppointment && (
                          <p className="text-xs flex items-center">
                            <span className="inline-block w-20 text-muted-foreground">Next visit:</span> 
                            {new Date(physician.nextAppointment).toLocaleDateString()}
                            {new Date(physician.nextAppointment) > new Date() && 
                              new Date(physician.nextAppointment) < new Date(new Date().setDate(new Date().getDate() + 30)) && (
                              <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0">
                                Upcoming
                              </Badge>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No physicians added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Shared Access Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Document completion</h3>
                
                <div className="space-y-4">
                  {documentCategories.map(category => (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">
                          {healthDocumentsByCategory.filter(doc => doc.category === category.id).length} of {category.expected}
                        </span>
                      </div>
                      <Progress value={calculateCompletion(category.id)} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <h3 className="text-sm font-medium pt-2">Documents shared with</h3>
                
                {healthDocumentsByCategory.some(doc => doc.permissions && doc.permissions.length > 1) ? (
                  <div className="space-y-3">
                    {['physician', 'family', 'advisor'].map(role => (
                      <div key={role} className="flex items-center justify-between text-sm border-b pb-2">
                        <span className="capitalize">{role}s</span>
                        <span className="text-sm">
                          {role === 'physician' ? 3 : role === 'family' ? 2 : 1} documents
                        </span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full text-sm mt-2">
                      Manage shared access
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3 text-muted-foreground text-sm">
                    <p>No documents have been shared yet</p>
                    <Button variant="outline" className="mt-2 text-xs">
                      Share healthcare documents
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <HealthcareNotificationCenter documents={documents} />
      </div>
    </div>
  );
}
