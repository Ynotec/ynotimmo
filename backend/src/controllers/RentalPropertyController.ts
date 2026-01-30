import { Request, Response } from 'express'
import { LoggerService } from '../services/LoggerService'
import RentalPropertyService from '../services/RentalPropertyService'
import IRentalProperty from '../models/IRentalProperty'
import FileUtils from '../utils/FileUtils'

export default class RentalPropertyController {
  private rentalPropertyService: RentalPropertyService
  private serviceName = 'RentalPropertyController'

  private logger: LoggerService

  constructor() {
    this.rentalPropertyService = RentalPropertyService.getInstance()
    this.logger = LoggerService.getInstance()
  }

  /**
   * GET /rentalProperty/get
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
      res.status(500).json({ error: 'Error retrieving rental properties' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }

  /**
   * POST /rentalProperty/import
   */
  import = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'import'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')

      const rentalPropertyImport = req.body

      if (!rentalPropertyImport) {
        this.logger.error(
          this.serviceName,
          methodName,
          'Missing data : rentalPropertyImport is required'
        )
        res
          .status(400)
          .json({ error: 'Missing data : rentalPropertyImport is required' })
        return
      }

      if (rentalPropertyImport.image_1920) {
        const imageCheck = FileUtils.imageLessThanMaxSize(
          rentalPropertyImport.image_1920,
          10
        )
        if (!imageCheck) {
          this.logger.error(
            this.serviceName,
            methodName,
            `Picture is too big. Max allowed is 10 MB.`
          )
          res.status(400).json({
            error: `Picture is too big. Please upload a picture with a size less than 10 MB.`,
          })
          return
        }
      }
      const logPayload = { ...rentalPropertyImport }
      if (logPayload.image_1920) {
        logPayload.image_1920 = `[BASE64 Content: ${logPayload.image_1920.length} chars]`
      }

      this.logger.info(
        this.serviceName,
        methodName,
        `Rental property import data : ${JSON.stringify(logPayload)}`
      )

      const rentalProperty =
        await this.rentalPropertyService.create(rentalPropertyImport)

      this.logger.info(
        this.serviceName,
        methodName,
        `Rental property created with ID : ${rentalProperty}`
      )
      res.status(200).json(rentalProperty)
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error importing rental property: ${error}`
      )
      res.status(500).json({ error: 'Error importing rental property' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }

  /**
   * POST /rentalProperty/import-json
   */
  importJson = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'importJson'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const properties = req.body.properties as IRentalProperty[]

      if (
        !properties ||
        !Array.isArray(properties) ||
        properties.length === 0
      ) {
        this.logger.warn(
          this.serviceName,
          methodName,
          'No properties array provided.'
        )
        res.status(400).json({ error: 'Aucune annonce à importer fournie.' })
        return
      }

      await this._processPropertyImports(properties, res)
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error importing properties : ${error}`
      )
      res.status(500).json({ error: 'Error importing properties' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }

  private async _processPropertyImports(
    properties: IRentalProperty[],
    res: Response
  ): Promise<void> {
    const methodName = 'importJson._processPropertyImports'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      this.logger.info(
        this.serviceName,
        methodName,
        `${properties.length} properties to import, starting processing...`
      )

      let createdCount = 0
      const errors: { propertyName: string; error: string }[] = []

      for (const property of properties) {
        try {
          if (!property.name) {
            this.logger.error(
              this.serviceName,
              methodName,
              `Property without name: ${JSON.stringify(property)}`
            )
            throw new Error("Fields 'name' is required .")
          }

          if (property.image_1920) {
            const imageCheck = FileUtils.imageLessThanMaxSize(
              property.image_1920,
              10
            )
            if (!imageCheck) {
              this.logger.error(
                this.serviceName,
                methodName,
                `Image too large for property '${property.name}': exceeds 10 MB limit.`
              )
              throw new Error(
                `Image too large for property '${property.name}': exceeds 10 MB limit.`
              )
            }
          }

          await this.rentalPropertyService.create(property)
          createdCount++
          this.logger.info(
            this.serviceName,
            methodName,
            `Property '${property.name}' created successfully, total created: ${createdCount}`
          )
        } catch (error) {
          this.logger.error(
            this.serviceName,
            methodName,
            `Failed to create property '${property.name || 'N/A'}': ${error}`
          )
          errors.push({
            propertyName: property.name || 'Unknown Name',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

      this.logger.info(
        this.serviceName,
        methodName,
        `${createdCount} of ${properties.length} properties created.`
      )

      if (errors.length > 0) {
        this.logger.info(
          this.serviceName,
          methodName,
          `Import completed with errors: ${errors.length} failures.`
        )
        res.status(207).json({
          message: `${createdCount} of ${properties.length} properties imported successfully.`,
          created: createdCount,
          failed: errors.length,
          errors: errors,
        })
      } else {
        this.logger.info(
          this.serviceName,
          methodName,
          'All properties imported successfully without errors.'
        )
        res.status(201).json({
          message: `All properties imported successfully. ${createdCount} properties created.`,
        })
      }
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error during property imports processing: ${error}`
      )
      res
        .status(500)
        .json({ error: 'Error during property imports processing' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }
}
