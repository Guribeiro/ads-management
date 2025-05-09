import { useMemo, useState } from "react";

import { CirclePower, Loader2, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { z } from 'zod'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { Status, toggleAdActive } from "@/http/toggle-ad-active";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ImageListSkeleton } from "./ad-card-skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

interface ImageGridProps {
  images?: Image[];
  loading: boolean;
  onSearch?: (query: string) => void;
}

const pageSizeOptions = [10, 20, 50, 100];

const searchSchema = z.object({
  search: z.string()
})

type SearchForm = z.infer<typeof searchSchema>

const ImageGrid = ({
  images = [],
  loading = false
}: ImageGridProps) => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status') as Status | null || 'ATIVO'
  const search = searchParams.get('search') || ''
  const limit = searchParams.get('limit') || 10

  const { control, handleSubmit } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search
    }
  })

  const [pendingId, setPendingId] = useState<string | null>(null)

  const toggleActiveMutation = useMutation({
    mutationKey: ['toggle-active'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      setPendingId(null)
      toast.success('Sucesso', {
        description: 'Anúncio atualizado com sucesso',
        richColors: true
      })
    },
    onError: ({ message }) => {
      toast.error('Erro', {
        description: message
      })
    },
    onMutate: ({ id }) => {
      setPendingId(id)
    },
    mutationFn: toggleAdActive
  })

  const handleChangePageLimit = (limit: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('limit', limit)
      return params
    })
  }

  const handleSubmitSearch = ({ search }: SearchForm) => {

    if (search.length < 1) {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev)
        params.delete('search')
        return params
      })
    }

    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('search', search)
      return params
    })
  };

  const ads = useMemo(() => {
    if (!search || search.length < 1) return images

    return images.filter(image => image.alt.toUpperCase().includes(search.toUpperCase()))
  }, [images, search])


  return (
    <div className="w-full bg-background p-4">
      <div className="relative mb-6">
        <form onSubmit={handleSubmit(handleSubmitSearch)}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Controller
            control={control}
            name="search"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Buscar anúncio..."
                className="pl-10"
                value={value}
                onChange={onChange}
              />
            )}
          />

        </form>
      </div>

      <div className="py-4 gap-3 flex justify-end">
        <ToggleGroup
          variant={"outline"}
          type="single"
          onValueChange={(value) => setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            if (value.length === 0) {
              newParams.delete('status')
              return newParams
            }
            newParams.set('status', value)
            return newParams
          })}
          value={status}
        >
          <ToggleGroupItem className="px-4 hover:border-primary" value="ativo" aria-label="Toggle bold">
            <span className="hidden md:block">
              Ativado
            </span>
            <CirclePower className="text-green-500 h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className="px-4 hover:border-destructive" value="desativado" aria-label="Toggle italic">
            <span className="hidden md:block">
              Desativado
            </span>
            <CirclePower className="text-red-500 h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Select onValueChange={handleChangePageLimit} value={limit.toString()}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <ImageListSkeleton count={6} />}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {ads.map((image) => (
          <Card key={image.id} className="overflow-hidden h-full hover:border-primary border-4 transition">
            <div className="relative aspect-square overflow-hidden">
              <a href={`/${image.id}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-contain w-full h-full transition-opacity"
                  style={{ opacity: image.active ? 1 : 0.5 }}
                />
              </a>
              <Badge
                className="absolute top-2 right-2"
                variant={image.active ? "default" : "destructive"}
              >
                {image.active ? "Ativo" : "Desativado"}
              </Badge>
            </div>
            <CardContent className="p-4">
              <p className="text-sm truncate">{image.alt}</p>
              <div className=" mt-4 flex items-center justify-end space-x-2">
                <div className="relative w-fit">
                  <Switch
                    checked={image.active}
                    onCheckedChange={(checked) =>
                      toggleActiveMutation.mutate({
                        id: image.id,
                        status: checked ? 'ATIVO' : 'DESATIVADO'
                      })
                    }
                  />
                  {toggleActiveMutation.isPending && pendingId === image.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-md cursor-not-allowed">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-muted-foreground mb-2">Não foram encontrados anúncios</div>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros de busca ou adicionar novos anúncios ao carrossel
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
