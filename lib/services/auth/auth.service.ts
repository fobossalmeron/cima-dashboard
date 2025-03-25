import { authClient } from '@/lib/auth/auth-client'

interface RegisterUserParams {
  name: string
  email: string
  password: string
}

export class AuthService {
  static async register(params: RegisterUserParams) {
    const user = await authClient.signUp.email(params)

    return user
  }
}
