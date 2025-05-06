
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
}

interface CarouselPreviewProps {
  images?: Image[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CarouselPreview = ({
  images = []
}: CarouselPreviewProps) => {
  // Filter only active images for the carousel
  const activeImages = images.filter((image) => image.active);

  return (
    <div>
      {activeImages.length > 0 ? (
        <div className="w-full py-6">
          <Carousel className="w-full">
            <CarouselContent>
              {activeImages.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-fill"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No active images to display in the carousel.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselPreview;
