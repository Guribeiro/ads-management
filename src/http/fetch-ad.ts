import { api } from "./api-client";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

interface FetchAd {
  adId: string
}

export async function fetchAd({ adId }: FetchAd) {
  const { data } = await api.get<Ad>(`/news/${adId}`)
  return data
}