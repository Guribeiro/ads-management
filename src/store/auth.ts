import { authenticateUser } from '@/http/authenticate-user'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { handleAxiosError } from '@/lib/axios-error-handler'

interface SigninDTO {
  email: string
  password: string
}

type Auth = {
  token: string
  user: {
    admin: boolean
    id: number
    iddepartamento: number
    name: string
  }
}

interface AuthState {
  auth: Auth | null,
  loading: boolean
  signin: (data: SigninDTO) => Promise<void>
  signout: () => void
}

export const authSlice = create<AuthState>()(
  persist((set) => ({
    auth: null,
    loading: false,
    signin: async ({ email, password }) => {
      try {
        set({ loading: true })
        const { data } = await authenticateUser({ email, password })

        set({ auth: data })
      } catch (error) {
        const message = handleAxiosError(error)
        toast.error(message)
      } finally {
        set({ loading: false })
      }
    },
    signout: () => {
      set({ auth: null })
    }
  }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  )
)
