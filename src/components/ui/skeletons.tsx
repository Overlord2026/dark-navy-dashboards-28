import React from 'react';

export const ToolCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-muted rounded-lg p-4 space-y-3">
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
      <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
      <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
      <div className="h-6 bg-muted-foreground/20 rounded w-1/3"></div>
    </div>
  </div>
);

export const ReceiptSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-16"></div>
        </div>
      </div>
      <div className="h-6 bg-muted-foreground/20 rounded w-20"></div>
    </div>
  </div>
);

export const TabGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <ToolCardSkeleton key={i} />
    ))}
  </div>
);

export const ReceiptsStripSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <ReceiptSkeleton key={i} />
    ))}
  </div>
);