import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'
import IAuth from '../models/IAuth'
import { LoggerService } from '../services/LoggerService'

export class AuthController {
  private authService: AuthService

  private serviceName = 'AuthController'
  private logger: LoggerService

  constructor() {
    this.authService = new AuthService()
    this.logger = LoggerService.getInstance()
  }

  /**
   * POST /auth/login
   * Body: { email: string, password: string }
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'login'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')

      const authData: IAuth = req.body
      const userId = await this.authService.authenticate(authData)

      if (userId) {
        this.logger.info(
          this.serviceName,
          methodName,
          `User authenticated, ID: ${JSON.stringify(userId)}`
        )
        res.status(200).json({ userId })
      } else {
        this.logger.error(this.serviceName, methodName, 'Authentication failed')
        res.status(401).json({ message: 'Unauthorized' })
      }
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error during login: ${error}`
      )
      res.status(500).json({ message: 'Internal Server Error' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }
}
