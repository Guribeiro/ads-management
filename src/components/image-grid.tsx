import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleAdActive } from "@/http/toggle-ad-active";
import { toast } from "sonner";

export interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

interface ImageGridProps {
  images?: Image[];
  onSearch?: (query: string) => void;
}

const ImageGrid = ({
  images = [],
  onSearch = () => { },
}: ImageGridProps) => {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState("");
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="w-full bg-background p-4">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search images..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden h-full">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="object-contain w-full h-full transition-opacity"
                style={{ opacity: image.active ? 1 : 0.5 }}
              />
              <Badge
                className="absolute top-2 right-2"
                variant={image.active ? "default" : "outline"}
              >
                {image.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="text-sm truncate">{image.alt}</div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {image.active ? "On" : "Off"}
                </span>
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
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-muted-foreground mb-2">No images found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or add new images to the carousel.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
