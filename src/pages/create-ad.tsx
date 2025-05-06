import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useEffect, useMemo } from "react"
import { Loader2, UploadCloud, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createAd } from "@/http/create-ad"
import { fileToBase64 } from "@/utils/file-to-base64"
import { useNavigate } from "react-router"

const createAdFormSchema = z.object({
  description: z.string().min(1, 'Adicione uma descrição para a publicação'),
  file: z.instanceof(FileList)
    .nullable() // Allows the initial value to be null
    .refine(
      (fileList) => fileList === null || (fileList && fileList.length > 0),
      {
        message: "Selecione uma imagem",
      }
    ),
})

export const CreateAdPage = () => {

  const queryClient = useQueryClient()

  const navigate = useNavigate();

  const createAdMutation = useMutation({
    mutationKey: ['ads'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      toast.success('Sucesso', {
        description: 'Anúncio adicionado com sucesso',
        richColors: true
      })

      navigate('/')
    },
    onError: ({ message }) => {
      toast.error('Erro', {
        description: message
      })
    },

    mutationFn: createAd
  })


  const form = useForm<z.infer<typeof createAdFormSchema>>({
    resolver: zodResolver(createAdFormSchema),
    defaultValues: {
      description: '',
      file: null
    },
  })

  const file = form.watch('file')
  const description = form.watch('description')

  const preview = useMemo(() => {
    if (file && file.length > 0) {
      return URL.createObjectURL(file[0]); // Create a URL for the image
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);


  async function onSubmit({ description, file }: z.infer<typeof createAdFormSchema>) {
    if (!file) {
      return toast.warning('Campos inválidos', {
        description: 'Selecione a imagem',
        richColors: true
      })
    }
    const fileItem = file[0]
    const fileAsBase64 = await fileToBase64(fileItem) as string

    createAdMutation.mutate({
      description,
      file: fileAsBase64
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="description">Título</FormLabel>
                <FormControl>
                  <Input
                    id="description"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="file">Imagem</FormLabel>
                <FormControl>
                  <>
                    <input
                      id="file"
                      type="file"
                      accept="image/png, image/jpeg"
                      autoComplete="email"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      name={field.name}
                      onChange={(e) => field.onChange(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="file"
                      className="group flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-lg border border-zinc-300 px-6 py-4 text-center text-zinc-500 shadow-sm hover:border-green-200 hover:bg-green-25 hover:text-green-500"
                    >
                      <div className="rounded-full border-6 border-zinc-50 bg-zinc-100 p-2 group-hover:border-green-50 group-hover:bg-green-100">
                        <UploadCloud className="h-5 w-5 text-zinc-600 group-hover:text-green-600" />
                      </div>

                      <div className="flex flex-col items-center gap-1 transition">
                        <span className="text-sm">
                          <span className="font-semibold text-green-700">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </span>
                        <span className="text-xs">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </span>
                      </div>
                    </label>
                    {preview && (
                      <div>
                        <div className="flex justify-end pb-2">
                          <Button
                            type="button"
                            variant='destructive'
                            onClick={() => form.setValue('file', null)}
                          >
                            <X />
                          </Button>
                        </div>
                        <div className="relative aspect-video w-full">
                          <Card className="overflow-hidden h-full">
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={preview}
                                alt={description}
                                className="object-contain w-full h-full transition-opacity"
                              />
                              <Badge
                                className="absolute top-2 right-2"
                                variant={'default'}
                              >
                                Active
                              </Badge>
                            </div>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div className="text-sm truncate">{description}</div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  On
                                </span>
                                <div className="relative w-fit">
                                  <Switch
                                    checked={true}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <Button
            type="submit"
            className="w-full"
            disabled={createAdMutation.isPending}
          >
            {createAdMutation.isPending ? <Loader2 className="animate-spin" /> : 'Publicar'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 