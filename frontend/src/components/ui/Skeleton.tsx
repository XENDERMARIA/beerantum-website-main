import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/[0.08] relative overflow-hidden",
        variant === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export function TeamMemberSkeleton() {
  return (
    <div className="brand-card overflow-hidden flex flex-col h-full border-white/5 bg-white/[0.02]">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col md:flex-row border border-white/5 bg-white/[0.02] h-auto md:h-48">
      <Skeleton className="w-full md:w-60 h-48 md:h-full rounded-none" />
      <div className="flex flex-col gap-4 p-6 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function PartnerSkeleton() {
  return (
    <div className="rounded-xl p-5 flex flex-col items-center justify-center gap-3 border border-white/5 bg-white/[0.02] min-h-[120px]">
      <Skeleton variant="circle" className="w-12 h-12" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-14 w-2/3" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/6" />
      </div>
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  );
}
