import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function DetailSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="space-y-2 px-4 pt-4">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-8/12" />
        </div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
      <div className="space-y-4">
        <Separator />
        <Skeleton className="mx-3 h-8" />
        <Separator />
        <Skeleton className="mx-3 h-8" />
        <Separator />
        <Skeleton className="mx-3 h-8" />
        <Separator />
        <Skeleton className="mx-3 h-8" />
        <Separator />
      </div>
    </div>
  );
}
