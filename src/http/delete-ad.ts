import { api } from "./api-client";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

interface DeleteAd {
  adId: string
}

export async function deleteAd({ adId }: DeleteAd) {
  return api.delete<Ad>(`/news/${adId}`)
}