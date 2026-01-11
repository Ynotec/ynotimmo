import OdooApi from '../lib/odooApi'
import IPartner from '../models/IPartner'
import { LoggerService } from '../services/LoggerService'

export class PartnerRepository {
  private api: OdooApi
  private model = 'res.partner'

  private get logger(): LoggerService {
    return LoggerService.getInstance()
  }
  private serviceName: string = 'PartnerRepository'

  constructor() {
    this.api = OdooApi.getInstance()
  }

  async create(partner: IPartner): Promise<number> {
    return await this.api.call(this.model, 'create', [partner])
  }

  async update(id: number, partner: IPartner): Promise<boolean> {
    return await this.api.call(this.model, 'write', [[id], partner])
  }

  async delete(id: number): Promise<boolean> {
    return await this.api.call(this.model, 'unlink', [[id]])
  }

  async findAll(limit: number = 30): Promise<IPartner[]> {
    return await this.api.call(this.model, 'search_read', [[]], {
      fields: ['id', 'name', 'phone', 'email'],
      limit,
    })
  }

  async findById(id: number): Promise<IPartner | null> {
    return await this.api.call(this.model, 'read', [[id]], {
      fields: ['id', 'name', 'phone', 'email'],
    })
  }

  async findByEmail(email: string): Promise<IPartner | null> {
    const methodName = 'findByEmail'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const result = await this.api.call(
        this.model,
        'search_read',
        [[['email', '=', email]]],
        { fields: ['id', 'name', 'email'], limit: 1 }
      )
      
      if(result && Array.isArray(result) && result.length > 0) {
        return result[0] as IPartner
      }

      return null
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Impossible de récupérer l'id correspondant au mail ${email} : ${error}`
      )
      return null
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }
}
