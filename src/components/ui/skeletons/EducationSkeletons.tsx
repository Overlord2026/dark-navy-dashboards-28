import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mt-2" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function ResourceCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-3/4 mt-2" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function EducationTabsSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Main Section Tabs Skeleton */}
      <div className="grid w-full grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-9 rounded-md" />
        ))}
      </div>

      {/* Category Buttons Skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-md" />
        ))}
      </div>

      {/* Content Tabs Skeleton */}
      <div className="grid w-full grid-cols-5 gap-1 p-1 bg-muted rounded-lg">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 rounded-md" />
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function ResourcesCatalogSkeleton() {
  return (
    <div className="space-y-8 px-1">
      {/* Hero Section Skeleton */}
      <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
        <Skeleton className="h-10 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      {/* Educational Tabs Skeleton */}
      <EducationTabsSkeleton />
    </div>
  );
}

export function EducationalResourcesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Skeleton className="h-9 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
      </div>

      {/* Email Input Skeleton */}
      <div className="max-w-md mx-auto space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Guides Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Skeleton className="h-6 w-6" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>
    </div>
  );
}