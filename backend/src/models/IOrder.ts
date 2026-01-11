export interface IOrderLine {
    product_id: number
    name?: string
    product_uom_qty: number
    price_unit: number
}

export default interface IOrder {
    id?: number
    name?: string
    partner_id?: number
    date_order?: string
    state?: 'draft' | 'sent' | 'sale' | 'cancel'
    amount_total?: number
    order_line: number[] | IOrderLine[]
    OrderLine: IOrderLine[]
}