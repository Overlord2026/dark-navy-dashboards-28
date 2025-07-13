import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader = ({ className, count = 1 }: SkeletonLoaderProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse rounded-md bg-muted",
            className
          )}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => (
  <div className="rounded-lg border bg-card p-6 space-y-4">
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-8 w-1/2" />
    <SkeletonLoader className="h-3 w-full" count={2} />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-6">
        <SkeletonLoader className="h-6 w-1/3 mb-4" />
        <SkeletonLoader className="h-64 w-full" />
      </div>
      <div className="rounded-lg border bg-card p-6">
        <SkeletonLoader className="h-6 w-1/3 mb-4" />
        <SkeletonLoader className="h-64 w-full" />
      </div>
    </div>
  </div>
);