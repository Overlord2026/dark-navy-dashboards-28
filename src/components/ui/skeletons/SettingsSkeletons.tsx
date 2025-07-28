import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const SettingsTabsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 py-3 px-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
    <SettingsCardSkeleton />
  </div>
);

export const SettingsCardSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </CardContent>
  </Card>
);

export const ProfileSectionSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-20 rounded" />
      </div>
    </CardContent>
  </Card>
);

export const SecuritySectionSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-56" />
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Password section */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <Skeleton className="h-10 w-40 rounded" />
      </div>
      
      {/* 2FA section */}
      <div className="border-t pt-6 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
      
      {/* Sessions section */}
      <div className="border-t pt-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const BillingSectionSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-36" />
      </div>
      <Skeleton className="h-4 w-52" />
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Current plan */}
      <div className="p-4 border rounded-lg space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>
      
      {/* Usage */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      
      {/* Payment method */}
      <div className="border-t pt-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Skeleton className="h-8 w-12 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded" />
      </div>
    </CardContent>
  </Card>
);

export const NotificationsSectionSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-60" />
    </CardHeader>
    <CardContent className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      ))}
      <div className="pt-4">
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    </CardContent>
  </Card>
);

export const SettingsHeaderSkeleton = () => (
  <div className="mb-8 space-y-2">
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-4 w-64" />
  </div>
);