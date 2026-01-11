export interface IBookingUser {
    name: string
    email: string
    phone: string
    street: string
    city: string
    zip: string

}

export interface IBookingLine {
    product_id: number
    name: string
    product_uom_qty: number
    price_unit: number
}

export default interface IBooking {
    user: IBookingUser
    lines: IBookingLine[]
}
