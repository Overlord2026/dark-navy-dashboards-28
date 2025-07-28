import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ReportCardSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </CardContent>
  </Card>
);

export const ReportsTableSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Table header skeleton */}
        <div className="grid grid-cols-5 gap-4 pb-2 border-b">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ReportGeneratorSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left side - report types */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-md space-y-2">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5 rounded mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded" />
        </div>
        
        {/* Right side - preview */}
        <div className="md:col-span-3 border rounded-md p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-md space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="p-4 bg-muted rounded-md space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ReportsBadgesSkeleton = () => (
  <div className="flex items-center gap-2">
    <Skeleton className="h-6 w-24 rounded-full" />
    <Skeleton className="h-6 w-32 rounded-full" />
  </div>
);

export const ReportsTabsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
    </div>
    <ReportsTableSkeleton />
  </div>
);

export const ReportsHeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-64" />
    </div>
    <Skeleton className="h-10 w-48 rounded" />
  </div>
);

export const EmptyReportsStateSkeleton = () => (
  <div className="text-center py-12 space-y-4">
    <Skeleton className="h-12 w-12 mx-auto rounded" />
    <Skeleton className="h-6 w-32 mx-auto" />
    <Skeleton className="h-4 w-64 mx-auto" />
    <Skeleton className="h-10 w-32 mx-auto rounded" />
  </div>
);