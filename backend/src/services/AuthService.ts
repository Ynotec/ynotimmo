import { LoggerService } from './LoggerService'
import { AuthRepository } from '../repositories/AuthRepository'
import IAuth from '../models/IAuth'

export class AuthService {
  private serviceName = 'AuthService'
  private authRepo: AuthRepository

  private logger: LoggerService

  constructor() {
    this.authRepo = new AuthRepository()
    this.logger = LoggerService.getInstance()
  }

  async authenticate(authData: IAuth): Promise<number | null> {
    const methodName = 'authenticate'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const userId = await this.authRepo.authenticate(authData)

      this.logger.info(this.serviceName, methodName, `User authenticated`)
      return userId
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error during authentication: ${error}`
      )
      throw error
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }
}
