import { api } from "./api-client";

type Status = 'ATIVO' | 'DESATIVADO'

interface Ad {
  id: string
  foto: string
  descricao: string
  status: Status
}

interface ToggleAdActive {
  id: string
  status: Status
}

export async function toggleAdActive({ id, status }: ToggleAdActive) {
  return api.patch<Ad>(`/news/${id}/status`, {
    status
  })
}