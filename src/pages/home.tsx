import { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ImageGrid from "../components/image-grid";
import CarouselPreview from "../components/corousel-preview";

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

export const HomePage = () => {
  // Mock data for images
  const [images, setImages] = useState<Image[]>([
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      alt: "Abstract gradient 1",
      active: true,
      order: 0,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80",
      alt: "Abstract gradient 2",
      active: true,
      order: 1,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
      alt: "Abstract gradient 3",
      active: false,
      order: 2,
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80",
      alt: "Abstract gradient 4",
      active: true,
      order: 3,
    },
    {
      id: "5",
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      alt: "Abstract gradient 5",
      active: false,
      order: 4,
    },
    {
      id: "6",
      src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
      alt: "Abstract gradient 6",
      active: true,
      order: 5,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter images based on search term
  const filteredImages = images.filter((image) =>
    image.alt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle image active status
  const toggleImageActive = (id: string) => {
    setImages(
      images.map((image) =>
        image.id === id ? { ...image, active: !image.active } : image,
      ),
    );
  };

  // Reorder images after drag and drop
  const reorderImages = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setImages(updatedItems);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Image Carousel Management</h1>
        <Button
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          Preview Carousel
        </Button>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus size={16} />
          Add New Image
        </Button>
      </div>

      {/* Main Content - Image Grid */}
      <div className="flex-1">
        <ImageGrid
          images={filteredImages}
          toggleActive={toggleImageActive}
          onReorder={reorderImages}
        />
      </div>

      {/* Carousel Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Carousel Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CarouselPreview images={images.filter((img) => img.active)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

