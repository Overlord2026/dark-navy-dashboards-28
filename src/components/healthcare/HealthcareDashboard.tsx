
import React from "react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  HeartPulse, 
  Pill, 
  User, 
  Calendar, 
  Users, 
  Clock, 
  Bell, 
  Shield, 
  BadgeAlert
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { DocumentItem, DocumentPermission } from "@/types/document";
import { Professional } from "@/types/professional";
import { format, addDays, isBefore } from "date-fns";

// Sample data - in a real app this would come from an API or context
const medications = [
  { 
    id: "med1", 
    name: "Lisinopril", 
    dosage: "20mg", 
    frequency: "Once daily", 
    nextRefill: addDays(new Date(), 7),
    doctor: "Dr. Smith",
    pharmacy: "CVS Pharmacy"
  },
  { 
    id: "med2", 
    name: "Metformin", 
    dosage: "500mg", 
    frequency: "Twice daily", 
    nextRefill: addDays(new Date(), 14),
    doctor: "Dr. Johnson",
    pharmacy: "Walgreens"
  },
  { 
    id: "med3", 
    name: "Atorvastatin", 
    dosage: "10mg", 
    frequency: "Once daily", 
    nextRefill: addDays(new Date(), 3),
    doctor: "Dr. Smith",
    pharmacy: "CVS Pharmacy"
  }
];

const healthcareProviders: Professional[] = [
  {
    id: "doc1",
    name: "Dr. Sarah Smith",
    type: "Physician",
    company: "City Medical Group",
    phone: "(555) 123-4567",
    email: "dr.smith@citymedical.com",
    specialties: ["Primary Care", "Internal Medicine"]
  },
  {
    id: "doc2",
    name: "Dr. James Johnson",
    type: "Physician",
    company: "Specialty Care Associates",
    phone: "(555) 987-6543",
    email: "dr.johnson@specialtycare.com",
    specialties: ["Cardiology"]
  },
  {
    id: "doc3",
    name: "Dr. Emily Roberts",
    type: "Physician",
    company: "Metro Health Partners",
    phone: "(555) 456-7890",
    email: "dr.roberts@metrohealth.com",
    specialties: ["Endocrinology", "Diabetes Care"]
  }
];

const upcomingAppointments = [
  {
    id: "apt1",
    title: "Annual Physical",
    doctor: "Dr. Sarah Smith",
    location: "City Medical Group",
    date: addDays(new Date(), 14),
    time: "10:00 AM",
    notes: "Fasting required"
  },
  {
    id: "apt2",
    title: "Cardiology Follow-up",
    doctor: "Dr. James Johnson",
    location: "Specialty Care Associates",
    date: addDays(new Date(), 7),
    time: "2:30 PM",
    notes: "Bring medication list"
  },
  {
    id: "apt3",
    title: "Lab Work",
    doctor: "Metro Health Partners",
    location: "Metro Health Lab",
    date: addDays(new Date(), 3),
    time: "8:15 AM",
    notes: "Fasting required"
  }
];

interface HealthcareDashboardProps {
  documents: DocumentItem[];
}

export const HealthcareDashboard: React.FC<HealthcareDashboardProps> = ({ 
  documents 
}) => {
  const { policies } = useInsuranceStore();
  
  // Filter health insurance policies
  const healthPolicies = policies.filter(policy => 
    policy.type === 'health' || policy.type === 'long-term-care'
  );
  
  // Get shared healthcare documents
  const sharedDocuments = documents.filter(doc => 
    doc.category.includes('healthcare') && 
    doc.permissions && 
    doc.permissions.length > 1
  );
  
  // Get upcoming medicine refills
  const upcomingRefills = medications.filter(med => 
    isBefore(med.nextRefill, addDays(new Date(), 10))
  ).sort((a, b) => a.nextRefill.getTime() - b.nextRefill.getTime());
  
  // Get upcoming appointments
  const nextAppointments = upcomingAppointments
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Insurance Coverage Card */}
        <DashboardCard
          title="Insurance Coverage"
          icon={<Shield className="h-5 w-5" />}
          className="col-span-1"
        >
          <div className="space-y-4">
            {healthPolicies.length > 0 ? (
              healthPolicies.map(policy => (
                <div key={policy.id} className="flex flex-col space-y-2 pb-2 border-b border-border/30 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{policy.name}</h4>
                      <p className="text-sm text-muted-foreground">{policy.provider}</p>
                    </div>
                    <Badge>{policy.type === 'health' ? 'Health' : 'LTC'}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coverage: ${policy.coverageAmount.toLocaleString()}</span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Renewal: {new Date(policy.endDate || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No health insurance policies found
              </div>
            )}
          </div>
          <div className="text-sm text-right mt-2">
            <a href="/insurance" className="text-primary hover:underline">
              View all policies →
            </a>
          </div>
        </DashboardCard>

        {/* Prescriptions & Refills Card */}
        <DashboardCard
          title="Prescriptions & Refills"
          icon={<Pill className="h-5 w-5" />}
          className="col-span-1"
        >
          <div className="space-y-4">
            {upcomingRefills.length > 0 ? (
              upcomingRefills.map(med => (
                <div key={med.id} className="flex flex-col space-y-2 pb-2 border-b border-border/30 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{med.name} {med.dosage}</h4>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    </div>
                    <Badge variant={isBefore(med.nextRefill, new Date()) ? "destructive" : "outline"}>
                      {isBefore(med.nextRefill, new Date())
                        ? "Overdue"
                        : `Refill in ${Math.ceil((med.nextRefill.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dr. {med.doctor}</span>
                    <span>{med.pharmacy}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming prescription refills
              </div>
            )}
          </div>
          <div className="text-sm text-right mt-2">
            <a href="#" className="text-primary hover:underline">
              Add medication →
            </a>
          </div>
        </DashboardCard>

        {/* Upcoming Reminders Card */}
        <DashboardCard
          title="Upcoming Reminders"
          icon={<Bell className="h-5 w-5" />}
          className="col-span-1"
        >
          <div className="space-y-4">
            {nextAppointments.length > 0 ? (
              nextAppointments.map(apt => (
                <div key={apt.id} className="flex flex-col space-y-2 pb-2 border-b border-border/30 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{apt.title}</h4>
                      <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                    </div>
                    <Badge>
                      {format(apt.date, 'MMM d')}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{apt.time}</span>
                    <span>{apt.location}</span>
                  </div>
                  {apt.notes && (
                    <p className="text-xs italic">Note: {apt.notes}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming appointments
              </div>
            )}
          </div>
          <div className="text-sm text-right mt-2">
            <a href="#" className="text-primary hover:underline">
              View calendar →
            </a>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Physicians & Contacts Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Physicians & Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthcareProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">
                      {provider.name}
                      <div className="text-xs text-muted-foreground">{provider.company}</div>
                    </TableCell>
                    <TableCell>
                      {provider.specialties?.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {specialty}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{provider.phone}</div>
                      <div className="text-xs text-primary">{provider.email}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-sm text-right mt-4">
              <a href="/professionals" className="text-primary hover:underline">
                View all healthcare providers →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Shared Access Overview Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Shared Access Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sharedDocuments.length > 0 ? (
              <div className="space-y-4">
                {sharedDocuments.slice(0, 5).map(doc => (
                  <div key={doc.id} className="flex flex-col space-y-2 pb-2 border-b border-border/30 last:border-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{doc.name}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{(doc.permissions?.length || 1) - 1}</span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.permissions?.filter(p => p.userId !== "Tom Brady").map((permission, i) => (
                        <TooltipProvider key={i}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="text-xs">
                                {permission.userName?.split(' ')[0]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{permission.userName}</p>
                              <p className="text-xs">Access: {permission.accessLevel}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No shared healthcare documents
              </div>
            )}
            <div className="text-sm text-right mt-4">
              <a href="#" className="text-primary hover:underline">
                Manage document permissions →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
