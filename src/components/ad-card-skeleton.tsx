import { Card, CardContent } from "@/components/ui/card"; // Adjust path as needed
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path as needed

export function ImageCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full border-4 border-transparent">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />

        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />

        <div className="mt-4 flex items-center justify-end space-x-2">
          <div className="relative w-fit">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ImageListSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ImageCardSkeleton key={index} />
      ))}
    </div>
  );
}