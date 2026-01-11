import type IBooking from '../types/IBooking'

export default class BookingService {
    private static API_URL = 'http://localhost:3000/api/bookings'

    static async createBooking(bookingdata: IBooking): Promise<any> {
        try {
            const response = await fetch(`${BookingService.API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingdata),
            })

            if (!response.ok) {
                throw new Error(
                    `Error creating booking: ${response.statusText}`
                )
            }

            return await response.json()
        } catch (error) {
            console.error('Error creating booking:', error)
            throw error
        }
    }

    static async trackBooking(trackingData: {
        bookingRef: string
        email: string
    }): Promise<any> {
        try {
            const response = await fetch(`${BookingService.API_URL}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackingData),
            })

            if (!response.ok) {
                throw new Error(
                    `Error tracking booking: ${response.statusText}`
                )
            }

            return await response.json()
        } catch (error) {
            console.error('Error tracking booking:', error)
            throw error
        }
    }

    static async cancelBooking(cancelData: {
        bookingRef: string
        email: string
    }): Promise<any> {
        try {
            const response = await fetch(
                `${BookingService.API_URL}/order/cancel`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cancelData),
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Error cancelling booking: ${response.statusText}`
                )
            }

            return await response.json()
        } catch (error) {
            console.error('Error cancelling booking:', error)
            throw error
        }
    }
}
