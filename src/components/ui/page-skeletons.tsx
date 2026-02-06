import { Skeleton } from "./skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AchievementCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function AchievementsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AchievementCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GalleryItemSkeleton() {
  return <Skeleton className="aspect-square w-full rounded-lg" />;
}

export function GalleryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Avatar and intro */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
        </div>
      </div>

      {/* Skills section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Experience section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="text-center space-y-4 mb-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 max-w-full mx-auto" />
    </div>
  );
}
