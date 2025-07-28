import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HealthCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertsSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function HealthcareDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Health Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <HealthCardSkeleton key={index} />
          ))}
        </div>

        {/* Alerts and Quick Actions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsSkeleton />
          <QuickActionsSkeleton />
        </div>
      </div>
    </div>
  );
}