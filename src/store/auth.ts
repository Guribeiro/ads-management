import { authenticateUser } from '@/http/authenticate-user'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { handleAxiosError } from '@/lib/axios-error-handler'

interface SigninDTO {
  email: string
  password: string
}

interface AuthState {
  user: {
    id: number | string
    name: string
  } | null,
  loading: boolean
  signin: (data: SigninDTO) => Promise<void>
}

export const authSlice = create<AuthState>()(
  persist((set) => ({
    user: null,
    loading: false,
    signin: async ({ email, password }) => {
      try {
        set({ loading: true })
        const { data } = await authenticateUser({ email, password })

        set({ user: data })
      } catch (error) {
        const message = handleAxiosError(error)
        toast.error(message)
      } finally {
        set({ loading: false })
      }
    },
  }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  )
)
