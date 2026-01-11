import { Router } from 'express'
import RentalPropertyController from '../controllers/RentalPropertyController'

const router = Router()

const controller = new RentalPropertyController()

router.get('/getAll', controller.getAll)

export default router
