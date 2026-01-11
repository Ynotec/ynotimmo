import { PartnerRepository } from '../repositories/PartnerRepository'
import OrderRepository from '../repositories/OrderRepository'
import IPartner from '../models/IPartner'
import { IOrderLine } from '../models/IOrder'
import { LoggerService } from './LoggerService'

export class BookingService {
    private serviceName = 'BookingService'
    private partnerRepo: PartnerRepository
    private quoteRepo: OrderRepository

    private get logger(): LoggerService {
        return LoggerService.getInstance()
    }

    constructor() {
        this.partnerRepo = new PartnerRepository()
        this.quoteRepo = new OrderRepository()
    }

    /**
     * Create User if not exists and order
     */
    async processBooking(userData: IPartner, bookingLines: IOrderLine[]) {
        const methodName = 'processBooking'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            let partnerId: number

            const existingUser = await this.partnerRepo.findByEmail(
                userData.email || ''
            )

            if (existingUser && existingUser.id) {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `Customer found (ID: ${existingUser.id})`
                )
                partnerId = existingUser.id
            } else {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    'Create customer...'
                )
                partnerId = await this.partnerRepo.create(userData)
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `ID customer : ${partnerId}`
                )
            }

            
            const quoteId = await this.quoteRepo.create(partnerId, bookingLines)
            this.logger.info(
                this.serviceName,
                methodName,
                `partnerdId : ${partnerId}, quoteId : ${quoteId}`
            )
            return {
                success: true,
                partnerId,
                quoteId,
                message: 'Order created successfully',
            }
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                'Error during booking process:',
                error
            )
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    /**
     * Find orders via email
     * Logic : Find the user ID via email -> Find orders for that ID
     */
    async trackOrdersByEmail(email: string) {
        const methodName = 'trackOrdersByEmail'

        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const user = await this.partnerRepo.findByEmail(email)

            if (!user || !user.id) {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `No customer found with email : ${email}`
                )
                return []
            }
            this.logger.info(
                this.serviceName,
                methodName,
                `partnerId corresponding to the email : ${user.id}`
            )

            const orders = await this.quoteRepo.findByPartnerId(user.id)

            if (!orders) {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `No orders found for mail : ${email}`
                )
            }
            return orders
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Unable to retrieve the order : ${error}`
            )
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    async cancelBooking(email: string, orderId: number) {
        const methodName = 'cancelBooking'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const user = await this.partnerRepo.findByEmail(email)
            const order = await this.quoteRepo.findById(orderId)

            const rawPartnerId = order?.partner_id
            const orderPartnerId = Array.isArray(rawPartnerId)
                ? rawPartnerId[0]
                : rawPartnerId

            this.logger.info(
                this.serviceName,
                methodName,
                `orderPartnerId : ${orderPartnerId}`
            )
            if (orderPartnerId !== user?.id) {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `Unauthorized for cancel, id not matching : ${user?.id} !== ${orderPartnerId}`
                )
                return false
            }

            const cancel = await this.quoteRepo.cancelOrder(orderId)
            if (cancel) {
                this.logger.info(
                    this.serviceName,
                    methodName,
                    `Order ${orderId} canceled`
                )
                return true
            }
            this.logger.info(
                this.serviceName,
                methodName,
                `Order ${orderId} not canceled`
            )
            return false
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Unable to cancel the order : ${error}`
            )
            return false
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }
    private areLinesSetsEqual(
        lines1: IOrderLine[],
        lines2: IOrderLine[]
    ): boolean {
        if (!lines1 || !lines2 || lines1.length !== lines2.length) {
            return false
        }

        const lineToString = (line: IOrderLine) =>
            `${line.product_id}|${line.product_uom_qty}`

        const lines1Map = new Map<string, number>()
        for (const line of lines1) {
            const key = lineToString(line)
            lines1Map.set(key, (lines1Map.get(key) || 0) + 1)
        }

        const lines2Map = new Map<string, number>()
        for (const line of lines2) {
            const key = lineToString(line)
            lines2Map.set(key, (lines2Map.get(key) || 0) + 1)
        }

        if (lines1Map.size !== lines2Map.size) {
            return false
        }

        for (const [key, count] of lines1Map) {
            if (lines2Map.get(key) !== count) {
                return false
            }
        }

        return true
    }
}
