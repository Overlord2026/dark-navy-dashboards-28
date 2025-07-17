import { Skeleton } from "@/components/ui/skeleton";

export const ResourceCardSkeleton = () => (
  <div className="border rounded-lg p-6 bg-card">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

export const SolutionCardSkeleton = () => (
  <div className="bg-card p-6 rounded-xl border border-border">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-6" />
    <div className="flex gap-3">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
);

export const ClientSegmentSkeleton = () => (
  <div className="bg-card p-6 rounded-xl border border-border">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    </div>
    <div className="mb-6">
      <Skeleton className="h-4 w-20 mb-3" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
    <Skeleton className="h-8 w-full" />
  </div>
);

export const BookCardSkeleton = () => (
  <div className="bg-card p-6 rounded-xl border border-border">
    <Skeleton className="w-full h-48 mb-4 rounded-lg" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

export const CourseCardSkeleton = () => (
  <div className="bg-card p-6 rounded-xl border border-border">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

export const EducationTabSkeleton = () => (
  <div className="education-tab">
    <Skeleton className="h-8 w-64 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg flex items-center gap-3">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-5 flex-1" />
        </div>
      ))}
    </div>
  </div>
);