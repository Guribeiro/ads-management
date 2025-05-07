import { useState } from "react";
import { Plus, Eye, GalleryThumbnails } from "lucide-react";
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
    networkMode: 'offlineFirst',
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
        <h1 className="text-md lg:text-xl font-bold">Anúncios Sorocaps</h1>
        <div className="flex gap-2">
          <Button
            variant='outline'
            asChild
            className="flex items-center gap-2"
          >
            <a href="/carousel">
              <GalleryThumbnails size={16} />
              <span className="hidden md:block ">
                Carrossel
              </span>
            </a>
          </Button>
          <Button
            variant='outline'
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 text-foreground"
          >
            <Eye size={16} />
            <span className="hidden md:block ">
              Preview do carrossel
            </span>
          </Button>
          <Button asChild className="flex items-center gap-2">
            <a href="/new">
              <Plus size={16} className="text-foreground" />
              <span className="hidden md:block text-foreground ">
                Adicionar nova publicação
              </span>
            </a>
          </Button>
        </div>
      </header>

      <ImageGrid
        loading={isPending}
        images={data}
      />

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview do carrossel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CarouselPreview images={data?.filter((img) => img.active)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

