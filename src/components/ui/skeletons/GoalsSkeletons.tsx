import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const GoalCardSkeleton = () => (
  <Card className="group">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="p-2 rounded-lg bg-muted">
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

export const GoalStatsCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

export const GoalsHeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="space-y-2">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-6 w-96" />
    </div>
    <Skeleton className="h-11 w-40" />
  </div>
);

export const GoalsSearchSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-4">
    <Skeleton className="h-10 flex-1" />
    <Skeleton className="h-10 w-full md:w-48" />
    <Skeleton className="h-10 w-full md:w-48" />
  </div>
);

export const GoalsTabsSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-10 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const GoalsDashboardSkeleton = () => (
  <div className="container mx-auto p-6 space-y-8">
    <GoalsHeaderSkeleton />
    
    {/* Family Office Message Skeleton */}
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-64" />
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <GoalStatsCardSkeleton key={i} />
      ))}
    </div>

    <GoalsSearchSkeleton />
    <GoalsTabsSkeleton />
  </div>
);

export const GoalProgressChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
  </Card>
);

export const GoalMilestoneSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);