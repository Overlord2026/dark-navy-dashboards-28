import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const PropertyCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-md p-3">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export const PropertySummarySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="bg-card">
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PropertyOverviewStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PropertyActivitySkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const PropertyRemindersSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-36 mb-2" />
      <Skeleton className="h-4 w-40" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const PropertyQuickActionsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PropertyOnboardingSkeleton = () => (
  <div className="container mx-auto p-6 max-w-4xl">
    <div className="mb-6">
      <Skeleton className="h-2 w-full mb-4" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>

    <Card className="mb-6">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border-l-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="flex justify-between">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-16" />
    </div>
  </div>
);

export const PropertyDashboardSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto">
    <div className="mb-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <div className="flex gap-2 border-b">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
    </div>
    
    <div className="space-y-6">
      <PropertyOverviewStatsSkeleton />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PropertyActivitySkeleton />
        <PropertyRemindersSkeleton />
      </div>
      
      <PropertyQuickActionsSkeleton />
    </div>
  </div>
);