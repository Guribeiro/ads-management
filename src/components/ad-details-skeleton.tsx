import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have Skeleton installed

export function AdDetailsSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative aspect-square overflow-hidden">
        {/* Skeleton for the image */}
        <Skeleton className="w-full h-full object-cover" />
        {/* Skeleton for the Badge */}
        <Skeleton className="absolute top-2 right-2 h-6 w-16 rounded-full" />
      </div>
      <CardContent className="p-4 flex justify-between items-center">
        {/* Skeleton for the text content */}
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center space-x-2">
          {/* Skeleton for "On/Off" text */}
          <Skeleton className="h-4 w-8" />
          {/* Skeleton for the Switch component */}
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}