
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Pill, Share, Calendar, User, AlertTriangle } from 'lucide-react';
import { useHealthcare } from '@/hooks/useHealthcare';
import { PrescriptionManager } from './PrescriptionManager';
import { HealthcareDocumentsList } from './HealthcareDocumentsList';
import { format, isAfter, isBefore, addDays } from 'date-fns';

export const HealthcareDashboardUpdated: React.FC = () => {
  const { documents, prescriptions, sharedDocuments, loading } = useHealthcare();

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-center h-24">
                <div className="animate-pulse bg-muted h-4 w-20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading healthcare data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Share className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sharedDocuments.length}</p>
                <p className="text-sm text-muted-foreground">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                overdueRefills.length > 0 ? 'bg-red-100' : upcomingRefills.length > 0 ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <AlertTriangle className={`h-6 w-6 ${
                  overdueRefills.length > 0 ? 'text-red-600' : upcomingRefills.length > 0 ? 'text-yellow-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueRefills.length + upcomingRefills.length}</p>
                <p className="text-sm text-muted-foreground">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(overdueRefills.length > 0 || upcomingRefills.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Prescription Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueRefills.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Pill className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">{prescription.name}</p>
                      <p className="text-sm text-red-600">
                        Overdue since {format(new Date(prescription.next_refill), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}
              
              {upcomingRefills.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Pill className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">{prescription.name}</p>
                      <p className="text-sm text-yellow-600">
                        Refill due {format(new Date(prescription.next_refill), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Due Soon</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="shared">Shared Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <HealthcareDocumentsList />
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-6">
          <PrescriptionManager />
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Shared Healthcare Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharedDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <Share className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Shared Documents</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't shared any healthcare documents with professionals yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sharedDocuments.map((sharedDoc) => (
                    <div key={sharedDoc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-medium">{sharedDoc.document_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Shared with {sharedDoc.professional_name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {sharedDoc.permission_level}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          Shared on {format(new Date(sharedDoc.shared_at), "MMM d, yyyy")}
                        </span>
                        {sharedDoc.expires_at && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Expires {format(new Date(sharedDoc.expires_at), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
