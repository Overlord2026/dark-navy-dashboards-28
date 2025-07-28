import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DashboardSkeletonProps {
  variant?: 'default' | 'compact' | 'wide';
  className?: string;
}

export function DashboardSkeleton({ variant = 'default', className = '' }: DashboardSkeletonProps) {
  const getHeight = () => {
    switch (variant) {
      case 'compact': return 'h-32';
      case 'wide': return 'h-96';
      default: return 'h-64';
    }
  };

  return (
    <Card className={`animate-pulse ${className}`}>
      <CardContent className={`p-6 ${getHeight()}`}>
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded-md w-48"></div>
              <div className="h-4 bg-muted rounded-md w-32"></div>
            </div>
            <div className="h-8 w-8 bg-muted rounded-full"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-3/4"></div>
            <div className="h-4 bg-muted rounded-md w-1/2"></div>
          </div>
          
          {variant !== 'compact' && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-md w-full"></div>
                  <div className="h-3 bg-muted rounded-md w-2/3"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-md w-full"></div>
                  <div className="h-3 bg-muted rounded-md w-2/3"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-md w-24"></div>
              <div className="h-8 bg-muted rounded-md w-32"></div>
              <div className="h-3 bg-muted rounded-md w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded-md w-48"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-muted rounded-full"></div>
                <div className="h-3 bg-muted rounded-md w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WelcomeBannerSkeleton() {
  return (
    <Card className="animate-pulse bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-muted rounded-md w-64"></div>
            <div className="h-4 bg-muted rounded-md w-96"></div>
            <div className="flex space-x-3 mt-4">
              <div className="h-10 bg-muted rounded-md w-32"></div>
              <div className="h-10 bg-muted rounded-md w-28"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-muted rounded-full ml-4"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReferralCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded"></div>
            <div className="h-5 bg-muted rounded-md w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-3/4"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded-md w-full"></div>
            <div className="h-3 bg-muted rounded-md w-full"></div>
            <div className="h-3 bg-muted rounded-md w-2/3"></div>
          </div>
          <div className="h-10 bg-muted rounded-md w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}