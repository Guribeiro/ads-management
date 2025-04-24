import { api } from "./api-client";

interface Ad {
  id: string
  foto: string
  descricao: string
  status: 'ATIVO' | 'DESATIVADO'
}

export async function fetchAds() {
  return api.get<Ad[]>('/news')
}