import { Router } from 'express'
import RentalPropertyController from '../controllers/RentalPropertyController'

const router = Router()

const controller = new RentalPropertyController()

router.get('/getAll', controller.getAll)
router.post('/import', controller.import)
router.post('/import-json', controller.importJson)

export default router
