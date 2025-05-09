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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

export const HomePage = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') as Status | null
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 10


  const { data, isFetching } = useQuery({
    queryKey: ['ads', status, page, limit],
    initialData: { ads: [], nextPage: null },
    queryFn: async () => {
      const { data } = await fetchAds({ status, limit, page })

      const { ads, nextPage } = data

      const adsParsed: Image[] = ads.map((item, index) => ({
        active: item.status === 'ATIVO',
        id: item.id,
        alt: item.descricao,
        src: item.foto,
        order: index
      }))

      return { ads: adsParsed, nextPage }
    }
  })

  const handlePreviousPage = () => {
    if (Number(page) > 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', (Number(page) - 1).toString());
      setSearchParams(newSearchParams);
    }
  };

  // Handler for the Next button
  const handleNextPage = () => {
    // Check if there is a next page based on the data returned by fetchAds
    if (data?.nextPage !== null && data?.nextPage !== undefined) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', data.nextPage.toString());
      setSearchParams(newSearchParams);
    }
  };


  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-md text-foreground lg:text-xl font-bold">Anúncios Sorocaps</h1>
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild >
                <Button
                  variant='outline'
                  asChild
                  className="flex items-center gap-2"
                >
                  <a href="/carousel">
                    <GalleryThumbnails size={16} />
                    <span className="hidden md:block">
                      Carrossel
                    </span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">
                  Ir para o carrossel
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild >
                <Button
                  variant='outline'
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-2 text-foreground cursor-pointer"
                >
                  <Eye size={16} />
                  <span className="hidden md:block ">
                    Preview do carrossel
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">
                  Abrir preview do carrossel
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild >
                <Button asChild className="flex items-center gap-2">
                  <a href="/new">
                    <Plus size={16} className="text-foreground" />
                    <span className="hidden md:block text-foreground ">
                      Adicionar nova publicação
                    </span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">
                  Ir para adicionar um novo anúncio
                </p>
              </TooltipContent>
            </Tooltip>

          </div>
        </TooltipProvider>
      </header>

      <ImageGrid
        loading={isFetching}
        images={data?.ads}
      />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              title="Página anterior"
              onClick={handlePreviousPage}
              aria-disabled={Number(page) <= 1 || isFetching}
              className="aria-disabled:opacity-50 aria-disabled:cursor-not-allowed cursor-pointer"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {data.nextPage && (
            <PaginationItem>
              <PaginationNext
                title="Próxima página"
                onClick={handleNextPage}
                aria-disabled={!data?.nextPage || isFetching}
                className="aria-disabled:opacity-50 aria-disabled:cursor-not-allowed cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview do carrossel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CarouselPreview images={data.ads?.filter((img) => img.active)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

