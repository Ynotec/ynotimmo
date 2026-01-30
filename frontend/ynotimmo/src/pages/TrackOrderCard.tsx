import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

export interface IOrder {
  id: number
  name: string
  date_order: string
  state: string
  amount_total: number
}

interface Props {
  order: IOrder
}

export default function TrackOrderCard({ order }: Props) {
  const getStatusLabel = (state: string) => {
    switch (state) {
      case 'sale':
        return { label: 'Confirmée', color: 'success' as const }
      case 'cancel':
        return { label: 'Annulée', color: 'error' as const }
      case 'sent':
        return { label: 'Envoyée', color: 'info' as const }
      case 'draft':
        return { label: 'En traitement', color: 'warning' as const }
      default:
        return { label: state, color: 'default' as const }
    }
  }

  const status = getStatusLabel(order.state)

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">{order.name}</Typography>
          <Chip label={status.label} color={status.color} size="small" />
        </Box>
        <Typography color="text.secondary" variant="body2">
          Date : {order.date_order}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          Total : {order.amount_total} €
        </Typography>
      </CardContent>
    </Card>
  )
}
