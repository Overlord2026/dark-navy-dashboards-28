import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const HealthHsaPage = React.lazy(() => import('../HealthHsaPage'));
const HealthScreeningsPage = React.lazy(() => import('../HealthScreeningsPage'));

const HealthLoadingFallback = () => (
  <div className="container mx-auto p-6">
    <Card>
      <CardContent className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading health module...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const LazyHealthHsaPage = () => (
  <Suspense fallback={<HealthLoadingFallback />}>
    <HealthHsaPage />
  </Suspense>
);

export const LazyHealthScreeningsPage = () => (
  <Suspense fallback={<HealthLoadingFallback />}>
    <HealthScreeningsPage />
  </Suspense>
);