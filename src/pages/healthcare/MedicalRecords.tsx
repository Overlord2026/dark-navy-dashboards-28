import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Search, Filter } from 'lucide-react';

export default function MedicalRecords() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">
            Manage your healthcare documents securely
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Coming Soon Message */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Document Management Coming Soon</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            This feature is currently under development. You'll be able to upload, organize, and manage your medical documents here.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" disabled>
              <Search className="h-4 w-4 mr-2" />
              Search Documents
            </Button>
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filter by Type
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}