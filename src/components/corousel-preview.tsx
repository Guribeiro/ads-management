import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
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
  images = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      alt: "Abstract 1",
      active: true,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80",
      alt: "Abstract 2",
      active: true,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
      alt: "Abstract 3",
      active: true,
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80",
      alt: "Abstract 4",
      active: true,
    },
  ],
  open = false,
  onOpenChange = () => { },
}: CarouselPreviewProps) => {
  // Filter only active images for the carousel
  const activeImages = images.filter((image) => image.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-background">
        <DialogHeader>
          <DialogTitle>Carousel Preview</DialogTitle>
          <DialogDescription>
            This is how your carousel will appear to users. Only active images
            are displayed.
          </DialogDescription>
        </DialogHeader>

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
                            className="w-full h-full object-cover"
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close Preview
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CarouselPreview;
