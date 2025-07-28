import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PortfolioCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function EmptyStateSkeleton() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-4 w-48 mx-auto mb-4" />
        <Skeleton className="h-9 w-36 mx-auto" />
      </CardContent>
    </Card>
  );
}

export function TabsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Tabs List Skeleton */}
      <div className="grid w-full grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-9 rounded-md" />
        ))}
      </div>
      
      {/* Tab Content Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <PortfolioCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function PortfolioPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>

      {/* Tabs Skeleton */}
      <TabsSkeleton />
    </div>
  );
}

export function InfoRequestDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}