import CardMedia from '@mui/material/CardMedia'
import type IRentalProperty from '../types/IRentalProperty'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

interface PropertyCardProps {
  property: IRentalProperty
  onSelectDetail: () => void
  onSelectOrder: () => void
}

export default function PropertyCard({
  property,
  onSelectDetail,
  onSelectOrder,
}: PropertyCardProps) {
  const propertyIsRent =
    property.qty_available === 0 && property.virtual_available === 0
  const propertyIsReserved =
    property.qty_available === 1 && property.virtual_available === 0

  return (
    <Card className="property-card">
      <CardMedia
        component="img"
        height="194"
        image={`data:image/jpeg;base64,${property.image_1920}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {property.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {property.number_house} {property.street},
        </Typography>
        <Typography>{property.postal_code}</Typography>
        <Typography variant="body2" color="text.secondary">
          La maison peut accueilir jusqu'à {property.guest_capacity} personnes.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.swimming_pool ? 'Avec piscine' : 'Pas de piscine'}
        </Typography>
        <Typography variant="body1" color="text.info">
          {property.list_price} €*
        </Typography>
        <Typography variant="caption" color="text.secondary">
          *Le prix affiché est par mois, Il sera demandé également une garantie
          locative de 2 mois
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant={
            propertyIsRent
              ? 'text'
              : propertyIsReserved
                ? 'outlined'
                : 'contained'
          }
          disabled={propertyIsRent || propertyIsReserved}
          onClick={onSelectOrder}
          size="small"
        >
          {propertyIsRent
            ? 'Déjà louée'
            : propertyIsReserved
              ? 'Déjà réservée !'
              : 'Demande de location'}
        </Button>
        <Button variant="outlined" onClick={onSelectDetail} size="small">
          En savoir plus
        </Button>
      </CardActions>
    </Card>
  )
}
