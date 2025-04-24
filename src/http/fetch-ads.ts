import { api } from "./api-client";
import { Status } from "./toggle-ad-active";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

interface FetchAds {
  status: Status | null
}

export async function fetchAds({ status }: FetchAds) {
  return api.get<Ad[]>('/news', {
    params: {
      status
    }
  })
}