import { api } from "./api-client";
import { Status } from "./toggle-ad-active";

interface PageCount {
  totalPages: number
}

interface FetchAdsPagesCount {
  status: Status | null
  pageSize?: number
}

export async function fetchAdsPagesCount({ status, pageSize = 10 }: FetchAdsPagesCount) {
  return api.get<PageCount>('/news/count-pages', {
    params: {
      status,
      pageSize
    }
  })
}