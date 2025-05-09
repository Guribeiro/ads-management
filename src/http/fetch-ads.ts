import { api } from "./api-client";
import { Status } from "./toggle-ad-active";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

interface FetchAdsResponse {
  ads: Ad[],
  nextPage: number | null
}

interface FetchAds {
  status: Status | null
  page?: number | string
  limit?: number | string
}

export async function fetchAds({ status, limit, page }: FetchAds) {
  return api.get<FetchAdsResponse>('/news', {
    params: {
      status,
      limit,
      page
    }
  })
}