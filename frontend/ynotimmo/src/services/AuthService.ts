import type { IAuth } from '../types/IAuth'

export default class AuthService {
  private static API_URL = 'http://localhost:3000/api/auth'

  static async login(authData: IAuth): Promise<any> {
    try {
      const response = await fetch(`${AuthService.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      })

      if (!response.ok) {
        throw new Error(`Error during login: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }
}
