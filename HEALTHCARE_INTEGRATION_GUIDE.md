# Healthcare Module - Complete Integration Guide

This guide provides step-by-step instructions for integrating the healthcare module into your main project.

## Prerequisites

- React project with TypeScript
- Supabase integration
- shadcn/ui components
- Tailwind CSS
- React Router DOM

## Integration Steps

### 1. Copy Type Definitions

Create `src/types/healthcare.ts`:

```typescript
export interface HealthMetric {
  id: string;
  user_id: string;
  type: string;
  value: string;
  unit?: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthDoc {
  id: string;
  user_id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  file_path?: string;
  content_type?: string;
  size?: number;
  tags?: string[];
  is_private: boolean;
  shared: boolean;
  encrypted: boolean;
  is_folder: boolean;
  parent_folder_id?: string;
  uploaded_by?: string;
  modified?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  totalDocuments: number;
  recentDocuments: number;
  sharedDocuments: number;
  expiringDocuments: number;
}

export interface HealthCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  className?: string;
}
```

### 2. Copy Healthcare Hooks

Create `src/hooks/healthcare/` directory and copy the following files:

#### `src/hooks/healthcare/useHealthData.ts`
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthMetric } from '@/types/healthcare';

export const useHealthData = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const createMetric = async (metricData: Omit<HealthMetric, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert([metricData])
        .select()
        .single();

      if (error) throw error;
      await fetchMetrics(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    isLoading,
    error,
    createMetric,
    refetch: fetchMetrics
  };
};
```

#### `src/hooks/healthcare/useHealthDocs.ts`
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthDoc, DocumentStats } from '@/types/healthcare';

export const useHealthDocs = () => {
  const [documents, setDocuments] = useState<HealthDoc[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('healthcare_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const recent = data?.filter(doc => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(doc.created_at) > weekAgo;
      }).length || 0;
      
      setStats({
        totalDocuments: total,
        recentDocuments: recent,
        sharedDocuments: data?.filter(doc => doc.shared).length || 0,
        expiringDocuments: 0 // Implement based on your business logic
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (docData: any, file?: File) => {
    try {
      let filePath = null;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) throw new Error('Not authenticated');
        
        filePath = `${user.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('healthcare-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      }

      // Create document record
      const { data, error } = await supabase
        .from('healthcare_documents')
        .insert([{
          ...docData,
          file_path: filePath,
          content_type: file?.type,
          size: file?.size
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchDocuments(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    stats,
    isLoading,
    error,
    createDocument,
    refetch: fetchDocuments
  };
};
```

#### `src/hooks/healthcare/index.ts`
```typescript
export { useHealthData } from './useHealthData';
export { useHealthDocs } from './useHealthDocs';
export type { HealthMetric } from './useHealthData';
export type { HealthDoc, DocumentStats } from './useHealthDocs';
```

### 3. Copy Healthcare Components

Create `src/components/healthcare/` directory and copy these components:

#### Core Components:
- `HealthCard.tsx` - Display health metrics cards
- `HealthMetricCard.tsx` - Specialized metric display
- `StatusIndicator.tsx` - Document status badges
- `DocumentUploadModal.tsx` - File upload interface
- `HealthcareDocumentsPage.tsx` - Complete documents management page

### 4. Copy Healthcare Pages

Create `src/pages/healthcare/` directory:

#### `src/pages/healthcare/HealthcareDashboard.tsx`
```typescript
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Activity, FileText, Users, Calendar } from 'lucide-react';
import { HealthCard } from '@/components/healthcare/HealthCard';
import { useHealthData } from '@/hooks/healthcare/useHealthData';
import { useHealthDocs } from '@/hooks/healthcare/useHealthDocs';

export default function HealthcareDashboard() {
  const { metrics, isLoading: metricsLoading } = useHealthData();
  const { documents, stats, isLoading: docsLoading } = useHealthDocs();

  if (metricsLoading || docsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your health data, documents, and wellness journey
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HealthCard
          title="Total Documents"
          value={stats?.totalDocuments?.toString() || '0'}
          icon={<FileText className="h-4 w-4" />}
          status="info"
        />
        <HealthCard
          title="Recent Metrics"
          value={metrics?.length.toString() || '0'}
          icon={<Activity className="h-4 w-4" />}
          status="success"
        />
        <HealthCard
          title="Expiring Documents"
          value={stats?.expiringDocuments?.toString() || '0'}
          icon={<Calendar className="h-4 w-4" />}
          status="warning"
        />
        <HealthCard
          title="Family Members"
          value="0"
          icon={<Users className="h-4 w-4" />}
          status="info"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Metrics</CardTitle>
            <CardDescription>Your latest health measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics && metrics.length > 0 ? (
              <div className="space-y-4">
                {metrics.slice(0, 3).map((metric) => (
                  <div key={metric.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{metric.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(metric.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{metric.value}</p>
                      {metric.unit && (
                        <p className="text-sm text-muted-foreground">{metric.unit}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No health metrics recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your latest uploaded health documents</CardDescription>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-4">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### `src/pages/healthcare/HealthcareDocuments.tsx`
```typescript
import React from 'react';
import { HealthcareDocumentsPage } from '@/components/healthcare/HealthcareDocumentsPage';

export default function HealthcareDocuments() {
  return <HealthcareDocumentsPage />;
}
```

### 5. Database Setup

Run the healthcare database migration (already provided in previous steps):

```sql
-- Healthcare Database Schema has been applied
-- Tables: healthcare_documents, healthcare_document_permissions, health_metrics
-- RLS policies and storage bucket configured
```

### 6. Update Routing

Add healthcare routes to your main routing configuration:

```typescript
// In your App.tsx or routing file
import HealthcareDashboard from '@/pages/healthcare/HealthcareDashboard';
import HealthcareDocuments from '@/pages/healthcare/HealthcareDocuments';

// Add these routes
{
  path: "/healthcare",
  element: <HealthcareDashboard />
},
{
  path: "/healthcare/documents",
  element: <HealthcareDocuments />
}
```

### 7. Update Navigation

Add healthcare navigation links to your sidebar or navigation component:

```typescript
// Healthcare navigation items
{
  title: "Healthcare",
  href: "/healthcare",
  icon: Activity
},
{
  title: "Medical Documents",
  href: "/healthcare/documents", 
  icon: FileText
}
```

### 8. Required Dependencies

Ensure these packages are installed:

```bash
npm install @supabase/supabase-js
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-dropdown-menu
npm install lucide-react
npm install react-router-dom
```

### 9. Authentication Setup

Ensure your app has authentication configured. The healthcare module requires users to be authenticated to access their data.

```typescript
// Example auth check
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

## Features Included

### ✅ Document Management
- Secure file upload with drag & drop
- Document categorization and tagging
- File type validation and size limits
- Search and filtering capabilities
- Status indicators for document states

### ✅ Health Metrics Tracking
- Custom health metric recording
- Historical data visualization
- Type-based organization
- Date-based filtering

### ✅ Security & Privacy
- Row-level security (RLS) policies
- User data isolation
- Encrypted file storage
- Permission management system

### ✅ User Interface
- Responsive design with Tailwind CSS
- Dark/light mode support
- Accessible components using Radix UI
- Toast notifications for user feedback

## Customization Options

### Theme Integration
The healthcare module uses your existing design system tokens. Customize colors in your `index.css`:

```css
:root {
  --healthcare-primary: hsl(var(--primary));
  --healthcare-success: hsl(142, 76%, 36%);
  --healthcare-warning: hsl(38, 92%, 50%);
  --healthcare-error: hsl(0, 84%, 60%);
}
```

### Document Types
Customize document types in `DocumentUploadModal.tsx`:

```typescript
const documentTypes = [
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'prescription', label: 'Prescription' },
  // Add your custom types here
];
```

### Metric Types
Add custom health metric types in your health metrics form components.

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure RLS is properly configured and user is authenticated
2. **File Upload Failures**: Check storage bucket permissions and file size limits
3. **Database Connection Issues**: Verify Supabase configuration and environment variables

### Database Permissions
If you encounter RLS policy errors, ensure:
- User is authenticated before making requests
- RLS policies match your authentication setup
- Foreign key references are correct

## Support

For additional support or customization needs:
- Check the component documentation
- Review Supabase RLS policies
- Ensure all required dependencies are installed
- Verify authentication is working correctly

## Version History

- v1.0.0 - Initial healthcare module with document management and health metrics
- Database schema with RLS security
- File storage with encryption support
- Responsive UI components