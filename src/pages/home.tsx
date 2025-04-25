import { useState } from "react";
import { Plus, Eye, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ImageGrid from "../components/image-grid";
import CarouselPreview from "../components/corousel-preview";
import { useQuery } from '@tanstack/react-query'
import { fetchAds } from '@/http/fetch-ads'
import { useSearchParams } from "react-router";
import { Status } from "@/http/toggle-ad-active";

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

export const HomePage = () => {

  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') as Status | null

  const { data, isPending } = useQuery({
    queryKey: ['ads', status],
    queryFn: async () => {
      const { data } = await fetchAds({ status })

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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div>
      <header className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">Image Carousel Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 text-foreground"
          >
            <Eye size={16} />
            Preview Carousel
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus size={16} />
            Add New Image
          </Button>
        </div>
      </header>

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

