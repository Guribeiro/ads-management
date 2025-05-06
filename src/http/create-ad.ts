import { api } from "./api-client";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

interface CreateAd {
  file: string
  description: string
}

export async function createAd({ file, description }: CreateAd) {
  return api.post<Ad[]>('/news', {
    media: file,
    description
  })
}