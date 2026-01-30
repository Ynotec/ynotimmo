import OdooApi from '../lib/odooApi'
import IAuth from '../models/IAuth'
import { LoggerService } from '../services/LoggerService'

export class AuthRepository {
  private api: OdooApi

  private logger: LoggerService
  private serviceName = 'AuthRepository'

  constructor() {
    this.api = OdooApi.getInstance()
    this.logger = LoggerService.getInstance()
  }

  async authenticate(authData: IAuth): Promise<number | null> {
    const methodName = 'authenticate'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      return await this.api.verifyCredentials(authData.email, authData.password)
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
