import { Request, Response } from 'express'
import { BookingService } from '../services/BookingService'

export class BookingController {
    private service: BookingService

    constructor() {
        this.service = new BookingService()
    }

    /**
     * POST /bookings/create
     * Body: {
     * user: { name: "Jean", email: "jean@test.com", ... },
     * lines: [ { product_id: 32, qty: 7 ... } ]
     * }
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user, lines } = req.body

            if (!user || !user.email || !lines) {
                res.status(400).json({
                    error: 'Données incomplètes (user email ou lines manquants)',
                })
                return
            }

            const result = await this.service.processBooking(user, lines)
            res.status(201).json(result)
        } catch (error) {
            console.error('Erreur booking:', error)
            res.status(500).json({ error: 'Erreur lors de la réservation' })
        }
    }

    /**
     * POST /bookings/track
     * Body: { email: "jean@test.com" }
     */
    track = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body

            if (!email) {
                res.status(400).json({ error: 'Email manquant' })
                return
            }

            const orders = await this.service.trackOrdersByEmail(email)
            res.status(200).json({ orders })
        } catch (error) {
            console.error('Erreur tracking:', error)
            res.status(500).json({ error: 'Erreur serveur' })
        }
    }

    cancel = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, orderId } = req.body

            if (!email || !orderId) {
                res.status(400).json({
                    error: 'Données incomplètes (email ou orderId manquantes)',
                })
                return
            }

            const canceled = await this.service.cancelBooking(email, orderId)
            if (canceled) {
                res.status(200).json({
                    message: 'Réservation annulée avec succès',
                })
            } else {
                res.status(404).json({ error: 'Réservation non trouvée' })
            }
        } catch (error) {
            console.error('Erreur annulation:', error)
            res.status(500).json({ error: 'Erreur serveur' })
        }
    }
}
