import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AssetCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </CardContent>
  </Card>
);

export const NetWorthSummarySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <AssetCardSkeleton />
    <AssetCardSkeleton />
    <AssetCardSkeleton />
  </div>
);

export const PropertyOverviewSkeleton = () => (
  <Card>
    <CardContent className="pt-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AssetAllocationSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 h-[320px] flex items-center justify-center">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
        <div className="md:w-1/2 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="py-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Skeleton className="w-3 h-3 rounded-full mr-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="ml-3 h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AccountOverviewSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
      </Card>
    ))}
  </div>
);

export const WealthManagementOverviewSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-80 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>

    {/* Quick Stats */}
    <NetWorthSummarySkeleton />

    {/* Quick Access Grid */}
    <AccountOverviewSkeleton />

    {/* Coming Soon Section */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const ComprehensiveAssetsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-28 mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-20 mb-2" />
          <div>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
    <AssetAllocationSkeleton />
  </div>
);