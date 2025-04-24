import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { fetchAd } from "@/http/fetch-ad"
import { toggleAdActive } from "@/http/toggle-ad-active"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useParams, useNavigate } from "react-router"
import { toast } from "sonner"

export const AdDetails = () => {
  const { adId } = useParams<{ adId: string }>()

  const navigate = useNavigate();


  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    initialData: undefined,
    queryKey: ['ad-details', adId],
    enabled: !!adId,
    queryFn: async () => {
      if (!adId) return
      const item = await fetchAd({ adId })

      const ad = {
        active: item.status === 'ATIVO',
        id: item.id,
        alt: item.descricao,
        src: item.foto,
        order: 0
      }

      return ad
    }
  })

  const toggleActiveMutation = useMutation({
    mutationKey: ['toggle-active'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      queryClient.invalidateQueries({ queryKey: ['add-details', adId] });
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

    mutationFn: toggleAdActive
  })

  if (!data) return

  if (isError) {
    return <h1>Error: {error.message}</h1>
  }

  if (isPending) {
    return <h1>Loading</h1>
  }
  return (
    <div className="max-w-lg w-full mx-auto pt-16">
      <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">{data.alt}</h1>
        <div className="w-8" /> {/* Spacer to balance the back button */}
      </div>
      <Card className="overflow-hidden h-full">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={data.src}
            alt={data.alt}
            className="object-contain w-full h-full transition-opacity"
            style={{ opacity: data.active ? 1 : 0.5 }}
          />
          <Badge
            className="absolute top-2 right-2"
            variant={data.active ? "default" : "outline"}
          >
            {data.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardContent className="p-4 flex justify-between items-center">
          <div className="text-sm truncate">{data.alt}</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {data.active ? "On" : "Off"}
            </span>
            <div className="relative w-fit">
              <Switch
                checked={data.active}
                onCheckedChange={(checked) =>
                  toggleActiveMutation.mutate({
                    id: data.id,
                    status: checked ? 'ATIVO' : 'DESATIVADO'
                  })
                }
              />
              {toggleActiveMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-md cursor-not-allowed">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}