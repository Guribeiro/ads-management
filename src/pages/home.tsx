import { useState } from "react";
import { Search, Plus, Eye, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ImageGrid from "../components/image-grid";
import CarouselPreview from "../components/corousel-preview";
import { useQuery } from '@tanstack/react-query'
import { fetchAds } from '@/http/fetch-ads'

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

export const HomePage = () => {

  // Mock data for images
  // const [images, setImages] = useState<Image[]>([
  //   {
  //     id: "1",
  //     src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  //     alt: "Abstract gradient 1",
  //     active: true,
  //     order: 0,
  //   },
  // ]);

  const { data, isPending } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data } = await fetchAds()

      const images: Image[] = data.map((item, index) => ({
        active: item.status === 'ATIVO',
        id: item.id,
        alt: item.descricao,
        src: item.foto,
        order: index
      }))

      return images
    }
  })



  const [searchTerm, setSearchTerm] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

      <div className="flex-1 relative">
        <ImageGrid
          images={data}
        />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center w-full rounded-md cursor-not-allowed">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>

      {/* Carousel Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Carousel Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CarouselPreview images={data?.filter((img) => img.active)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

