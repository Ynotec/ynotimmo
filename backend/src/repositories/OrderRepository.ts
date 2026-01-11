import OdooApi from '../lib/odooApi'
import IOrder, { IOrderLine } from '../models/IOrder'
import { LoggerService } from '../services/LoggerService'

const QUOTATION_FIELDS = [
    'id',
    'name',
    'partner_id',
    'state',
    'date_order',
    'amount_total',
    'order_line',
]

export default class OrderRepository {
    private api: OdooApi
    private model = 'sale.order'

    private get logger(): LoggerService {
        return LoggerService.getInstance()
    }
    private serviceName: string = 'OrderRepository'

    constructor() {
        this.api = OdooApi.getInstance()
    }

    async create(partnerId: number, lines: IOrderLine[]): Promise<number> {
        const methodName = 'create'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const formattedLines = lines.map((line) => {
                return [
                    0,
                    0,
                    {
                        product_id: line.product_id,
                        name: line.name || '',
                        product_uom_qty: line.product_uom_qty,
                    },
                ]
            })

            return await this.api.call(this.model, 'create', [
                {
                    partner_id: partnerId,
                    order_line: formattedLines,
                    state: 'draft',
                },
            ])
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Unable to create order : ${error}`
            )
            throw error
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    async findById(id: number): Promise<IOrder | null> {
        const methodName = 'findById'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const result = await this.api.call(this.model, 'read', [[id]], {
                fields: QUOTATION_FIELDS,
            })
            if (!result || !Array.isArray(result) || result.length === 0) {
            }
            return result[0] as IOrder
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Unable to retrieve the order : ${error}`
            )
            return null
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    async findByPartnerId(id: number): Promise<IOrder[] | [] | null | number> {
        const methodName = 'findByPartnerId'

        try {
            this.logger.debug(this.serviceName, methodName, 'START')

            this.logger.info(
                this.serviceName,
                methodName,
                `Search order with partnerId : ${id}`
            )
            const result = await this.api.call(
                this.model,
                'search_read',
                [[['partner_id', '=', id]]],
                {
                    fields: QUOTATION_FIELDS,
                }
            )

            if (!result) {
                this.logger.info(this.serviceName, methodName, 'No order found')
                return null
            }
            this.logger.info(
                this.serviceName,
                'findById',
                `Order found : ${result.length}`
            )

            if (result && Array.isArray(result)) {
                return result as IOrder[]
            }
            return []
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Unable to retrieve the order : ${error}`
            )
            return null
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    async confirmOrder(id: number): Promise<boolean> {
        const result = await this.api.call(this.model, 'action_confirm', [[id]])
        return !!result
    }

    async cancelOrder(id: number | IOrderLine): Promise<boolean> {
        const result = await this.api.call(this.model, 'action_cancel', [[id]])
        return !!result
    }
}
