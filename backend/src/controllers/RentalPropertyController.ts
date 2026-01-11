import { Request, Response } from 'express'
import { LoggerService } from '../services/LoggerService'
import RentalPropertyService from '../services/RentalPropertyService'

export default class RentalPropertyController {
    private rentalPropertyService: RentalPropertyService
    private serviceName = 'RentalPropertyController'

    private get logger(): LoggerService {
        return LoggerService.getInstance()
    }

    constructor() {
        this.rentalPropertyService = RentalPropertyService.getInstance()
    }

    /**
     * POST /rentalProperty/get
     */
    getAll = async (req: Request, res: Response): Promise<void> => {
        const methodName = 'getAll'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const rentalProperties = await this.rentalPropertyService.getAll()

            this.logger.info(
                this.serviceName,
                methodName,
                `Rental properties : ${rentalProperties?.length}`
            )
            res.status(200).json(rentalProperties)
        } catch (error) {
            this.logger.error(this.serviceName, methodName, `Error : ${error}`)
            res.status(500).json({ error: 'Erreur serveur' })
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }
}
