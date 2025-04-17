import { api } from "./api-client";

interface AuthenticateUser {
  email: string
  password: string
}

export async function authenticateUser({ email, password }: AuthenticateUser) {
  return api.post('/users/authenticate', {
    email,
    password
  })
}