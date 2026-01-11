import IRentalProperty from "../models/IRentalProperty"
import { RentalPropertyRepository } from "../repositories/RentalPropertyRepository"
import { LoggerService } from "./LoggerService"

export default class RentalPropertyService {
    private static instance : RentalPropertyService | null = null

    private serviceName = 'RentalPropertyService'
    private rentalPropertyRepo : RentalPropertyRepository
    private get logger(): LoggerService {
        return LoggerService.getInstance()
    }

    private constructor() {
        this.rentalPropertyRepo = new RentalPropertyRepository()
    }

    public static getInstance(): RentalPropertyService {
        if (!this.instance) {
            this.instance = new RentalPropertyService()
        }
        return this.instance
    }

    async getAll() {
        const methodName = 'getRentalProperties'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const rentalProperties = await this.rentalPropertyRepo.findAll()
            return rentalProperties
        } catch (error) {
            this.logger.error(this.serviceName, methodName, `Error : ${error}`)
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    async create(rentalProperty: IRentalProperty) : Promise<number> {
        const methodName = 'createRentalProperty'

        try {
            this.logger.debug(this.serviceName, methodName, 'START')

            const property = await this.rentalPropertyRepo.create(rentalProperty)
            this.logger.info(this.serviceName, methodName, `Property created : ${property}`)

            return property
        } catch (error) {
            this.logger.error(this.serviceName, methodName, `Error : ${error}`)
            throw error
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

}