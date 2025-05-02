import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { InputFile } from "@/components/input-file"


const createAdFormSchema = z.object({
  description: z.string().min(1),
  file: z.string().min(1),
})

export const CreateAdPage = () => {
  const form = useForm<z.infer<typeof createAdFormSchema>>({
    resolver: zodResolver(createAdFormSchema),
    defaultValues: {
      description: '',
      file: ''
    },
  })

  async function onSubmit(values: z.infer<typeof createAdFormSchema>) {
    console.log(values)
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
                    placeholder="johndoe@mail.com"
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
                <FormLabel htmlFor="file">Título</FormLabel>
                <FormControl>
                  <InputFile
                    id="file"
                    type="file"
                    placeholder="johndoe@mail.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <Button type="submit" className="w-full">
            {/* {loading ? <Loader2 className="animate-spin" /> : 'Login'} */}
            Publicar
          </Button>
        </div>
      </form>
    </Form>
  )
} 