import { Request, Response } from 'express'
import { BookingService } from '../services/BookingService'
import { LoggerService } from '../services/LoggerService'

export class BookingController {
  private service: BookingService
  private serviceName = 'BookingController'

  private logger: LoggerService

  constructor() {
    this.service = new BookingService()
    this.logger = LoggerService.getInstance()
  }

  /**
   * POST /bookings/create
   * Body: {
   * user: { name: "Jean", email: "johndoe@gmail.com", ... },
   * lines: [ { product_id: 32, qty: 7 ... } ]
   * }
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'create'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const { user, lines } = req.body

      if (!user || !user.email || !lines) {
        this.logger.error(
          this.serviceName,
          methodName,
          'Missing data (user email or lines missing)'
        )
        res.status(400).json({
          error: 'Missing data (user email or lines missing)',
        })
        return
      }

      this.logger.info(
        this.serviceName,
        methodName,
        `Processing booking for user: ${user.email} : lines count: ${lines.length} : ${JSON.stringify(lines)}`
      )
      const result = await this.service.processBooking(user, lines)
      this.logger.info(
        this.serviceName,
        methodName,
        `Booking processed successfully for user: ${user.email}`
      )

      res.status(201).json(result)
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error during booking: ${error}`
      )
      res.status(500).json({ error: 'Error during booking' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }

  /**
   * POST /bookings/track
   * Body: { email: "johndoe@gmail.com" }
   */
  track = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'track'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const { email } = req.body

      if (!email) {
        this.logger.error(this.serviceName, methodName, 'Email missing')
        res.status(400).json({ error: 'Email missing' })
        return
      }

      this.logger.info(
        this.serviceName,
        methodName,
        `Tracking orders for email: ${email}`
      )
      const orders = await this.service.trackOrdersByEmail(email)

      res.status(200).json({ orders })
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error tracking orders: ${error}`
      )
      res.status(500).json({ error: 'Error tracking orders' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }

  cancel = async (req: Request, res: Response): Promise<void> => {
    const methodName = 'cancel'
    try {
      this.logger.debug(this.serviceName, methodName, 'START')
      const { email, orderId } = req.body

      if (!email || !orderId) {
        this.logger.error(
          this.serviceName,
          methodName,
          'Data missing : email and orderId are required'
        )
        res.status(400).json({
          error: 'Data missing : email and orderId are required',
        })
        return
      }

      this.logger.info(
        this.serviceName,
        methodName,
        `Cancelling booking for email: ${email}, orderId: ${orderId}`
      )
      const canceled = await this.service.cancelBooking(email, orderId)
      if (canceled) {
        this.logger.info(
          this.serviceName,
          methodName,
          'Booking canceled successfully'
        )
        res.status(200).json({
          message: `Booking with orderId ${orderId} canceled successfully`,
        })
      } else {
        this.logger.info(
          this.serviceName,
          methodName,
          `Booking not found for email: ${email}, orderId: ${orderId}`
        )
        res.status(404).json({
          error: `Booking not found for email: ${email}, orderId: ${orderId}`,
        })
      }
    } catch (error) {
      this.logger.error(
        this.serviceName,
        methodName,
        `Error cancelling booking: ${error}`
      )
      res.status(500).json({ error: 'Error cancelling booking' })
    } finally {
      this.logger.debug(this.serviceName, methodName, 'END')
    }
  }
}
