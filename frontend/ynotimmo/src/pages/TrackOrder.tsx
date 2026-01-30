import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import TrackOrderCard from './TrackOrderCard'
import type { IOrder } from './TrackOrderCard'

interface TrackOrderProps {
  open: boolean
  onClose: () => void
}

export default function TrackOrder({ open, onClose }: TrackOrderProps) {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!email) return
    setLoading(true)
    setHasSearched(false)
    try {
      // Assurez-vous que l'URL correspond à votre backend (ex: http://localhost:3000)
      // Si vous avez un proxy configuré dans vite.config.ts, gardez juste /api/...
      const response = await fetch('http://localhost:3000/api/bookings/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error)
      setOrders([])
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Suivre mes demandes</DialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 3 }}>
          <TextField
            label="Votre adresse email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Voir'}
          </Button>
        </Box>

        {hasSearched && orders.length === 0 && (
          <Typography align="center" color="text.secondary">
            Aucune demande trouvée pour cet email.
          </Typography>
        )}

        {orders.map((order) => (
          <TrackOrderCard key={order.id} order={order} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
