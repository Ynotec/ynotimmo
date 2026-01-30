import dotenv from 'dotenv'
dotenv.config()

import { LoggerService } from './services/LoggerService'
import { LogLevel } from './models/ILogger'
const logger = LoggerService.getInstance(LogLevel.DEBUG, 'YnotimmoBackEnd')

import express from 'express'
import cors from 'cors'

import bookingRoutes from './routes/bookingRoutes'
import rentalPropertyRoutes from './routes/rentalPropertyRoutes'
import authRoutes from './routes/authRoutes'

const app = express()

const PORT = process.env.YNOTIMMO_PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

app.use(express.json({ limit: '50mb' }))
app.use('/api/bookings', bookingRoutes)
app.use('/api/rentalProperty', rentalPropertyRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Le back-end est en ligne ')
})

app.listen(PORT, () => {
  logger.info('index', 'listen', `Le serveur a démarré sur le port ${PORT}`)
})
