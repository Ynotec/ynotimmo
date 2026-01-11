import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material'
import type IRentalProperty from '../types/IRentalProperty'

interface PropertyDetailProps {
    open: boolean
    onClose: () => void
    property: IRentalProperty | null
    onSelectOrder: () => void
}

export default function PropertyDetail({
    open,
    onClose,
    property,
    onSelectOrder,
}: PropertyDetailProps) {
    if (!property) return null

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{property.name}</DialogTitle>
            <DialogContent>
                <img
                    src={`data:image/jpeg;base64,${property.image_1920}`}
                    alt={property.name}
                    style={{ width: '100%' }}
                />
                <p>{property.description_sale}</p>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onSelectOrder}
                    size="small"
                >
                    Demande de location
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    )
}
