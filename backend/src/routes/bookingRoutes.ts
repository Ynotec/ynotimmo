import { Router } from 'express'
import { BookingController } from '../controllers/BookingController'

const router = Router()
const controller = new BookingController()

router.post('/create', controller.create)
router.post('/track', controller.track)
router.post('/order/cancel', controller.cancel)

export default router
