# Healthcare Module Integration Guide

This guide provides step-by-step instructions for integrating the healthcare module into your existing project.

## 📋 Prerequisites

- React 18+ with TypeScript
- Tailwind CSS configured
- Supabase project setup
- shadcn/ui components installed

## 🚀 Integration Steps

### 1. File Transfer

Run the file transfer script to copy all healthcare module files:

```bash
chmod +x healthcare-export/utils/file-transfer.sh
./healthcare-export/utils/file-transfer.sh
```

### 2. Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Health metrics table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health documents table  
CREATE TABLE IF NOT EXISTS public.healthcare_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  file_path TEXT,
  content_type TEXT,
  size BIGINT,
  is_private BOOLEAN DEFAULT true,
  shared BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_metrics
CREATE POLICY "Users can manage their own health metrics" ON public.health_metrics
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for healthcare_documents
CREATE POLICY "Users can manage their own healthcare documents" ON public.healthcare_documents
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Storage Setup

Create storage buckets in Supabase:

```sql
-- Create healthcare documents bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('healthcare-documents', 'healthcare-documents', false);

-- Storage policies
CREATE POLICY "Users can upload their healthcare files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their healthcare files" ON storage.objects
  FOR SELECT USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their healthcare files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their healthcare files" ON storage.objects
  FOR DELETE USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Add Routes

Add these routes to your router configuration:

```typescript
// Example for React Router
import { HealthcareDashboard } from '@/pages/healthcare/HealthcareDashboard';
import { HealthcareDocuments } from '@/pages/healthcare/HealthcareDocuments';
import { HealthMetrics } from '@/pages/healthcare/HealthMetrics';

const routes = [
  {
    path: "/health",
    element: <HealthcareDashboard />,
  },
  {
    path: "/health/documents", 
    element: <HealthcareDocuments />,
  },
  {
    path: "/health/metrics",
    element: <HealthMetrics />,
  },
];
```

### 5. Navigation Integration

Add healthcare navigation to your app:

```typescript
import { Activity, FileText, Heart } from 'lucide-react';

const healthcareNavItems = [
  {
    title: "Health Dashboard",
    href: "/health",
    icon: Activity,
    description: "Overview of your health data"
  },
  {
    title: "Health Metrics", 
    href: "/health/metrics",
    icon: Heart,
    description: "Track vital signs and measurements"
  },
  {
    title: "Documents",
    href: "/health/documents", 
    icon: FileText,
    description: "Manage healthcare documents"
  }
];
```

### 6. Required Dependencies

Ensure these packages are installed:

```bash
npm install @supabase/supabase-js lucide-react react-hook-form @hookform/resolvers zod react-dropzone date-fns
```

## 🎯 Usage Examples

### Using Health Data Hook

```typescript
import { useHealthData } from '@/hooks/healthcare';

function MyComponent() {
  const {
    metrics,        // Health metrics array
    isLoading,      // Loading state
    createMetric,   // Create new metric
    updateMetric,   // Update existing metric
    deleteMetric    // Delete metric
  } = useHealthData();

  const handleAddMetric = async () => {
    await createMetric({
      type: 'blood_pressure',
      value: '120/80',
      unit: 'mmHg',
      date: '2024-01-15',
      notes: 'Morning reading'
    });
  };
}
```

### Using Health Documents Hook

```typescript
import { useHealthDocs } from '@/hooks/healthcare';

function MyComponent() {
  const {
    documents,      // Documents array
    stats,          // Document statistics
    isLoading,      // Loading state
    createDocument, // Upload new document
    updateDocument, // Update document metadata
    deleteDocument  // Delete document
  } = useHealthDocs();

  const handleUpload = async (file: File) => {
    await createDocument({
      doc_type: 'lab_results',
      document_name: 'Blood Test Results',
      file: file
    });
  };
}
```

## 🔧 Customization

### Theming
The healthcare module uses your existing Tailwind theme. Customize colors in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        healthcare: {
          primary: '#10b981',    // Green for health
          secondary: '#3b82f6',  // Blue for medical
          accent: '#8b5cf6'      // Purple for wellness
        }
      }
    }
  }
}
```

### Adding Custom Metrics
Extend the health metrics by modifying the `HealthMetric` interface:

```typescript
// In src/types/healthcare.ts
export interface HealthMetric {
  id: string;
  type: string;
  value: string;
  unit?: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Add custom fields
  category?: 'vitals' | 'labs' | 'fitness';
  provider_id?: string;
  is_critical?: boolean;
}
```

## 🛡️ Security Considerations

1. **HIPAA Compliance**: Ensure your Supabase instance meets healthcare compliance requirements
2. **Data Encryption**: All sensitive data is encrypted at rest in Supabase
3. **Access Control**: RLS policies ensure users only access their own data
4. **Audit Logs**: Consider implementing audit logging for healthcare data access

## 🧪 Testing

Test the integration:

1. Create a health metric
2. Upload a document
3. View the dashboard
4. Check that data persists correctly

## 📞 Support

For issues with the healthcare module:

1. Check the console for error messages
2. Verify database tables and policies are created
3. Ensure storage buckets exist and have correct policies
4. Check that authentication is working

## 📄 License

This healthcare module is designed for integration into existing projects. Please ensure compliance with healthcare regulations (HIPAA, GDPR) in your implementation.