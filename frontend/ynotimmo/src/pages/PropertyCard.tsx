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
                    {property.guest_capacity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {property.swimming_pool ? 'Piscine' : 'Pas de piscine'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {property.list_price} € / par mois
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    onClick={onSelectOrder}
                    size="small"
                >
                    Demande de location
                </Button>
                <Button
                    variant="outlined"
                    onClick={onSelectDetail}
                    size="small"
                >
                    En savoir plus
                </Button>
            </CardActions>
        </Card>
    )
}
