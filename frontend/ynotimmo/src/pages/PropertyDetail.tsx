import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
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

  const propertyIsRent =
    property.qty_available === 0 && property.virtual_available === 0
  const propertyIsReserved =
    property.qty_available === 1 && property.virtual_available === 0

  // Configuration des équipements (mapping clé -> libellé)
  const amenitiesConfig = [
    { key: 'climatization', label: 'Climatisation' },
    { key: 'terrace', label: 'Terrasse' },
    { key: 'garden', label: 'Jardin' },
    { key: 'swimming_pool', label: 'Piscine' },
    { key: 'jacuzzi', label: 'Jacuzzi' },
    { key: 'charge_ev', label: 'Borne de recharge' },
    { key: 'indoor_fireplace', label: 'Cheminée intérieure' },
    { key: 'outdoor_fireplace', label: 'Cheminée extérieure' },
    { key: 'dedicated_workspace', label: 'Espace de travail' },
    { key: 'gym', label: 'Salle de sport' },
    // Accessibilité
    { key: 'toilet_grab_bar', label: 'Barre appui WC' },
    { key: 'shower_grab_bar', label: 'Barre appui Douche' },
    { key: 'shower_free_access', label: 'Douche accès libre' },
    { key: 'shower_seat', label: 'Siège de douche' },
    { key: 'bedroom_free_access', label: 'Chambre accès libre' },
    { key: 'bedroom_large_door', label: 'Grande porte chambre' },
    { key: 'general_free_access', label: 'Accès général libre' },
  ]

  // Filtrer pour ne garder que les équipements présents (true)
  const activeAmenities = amenitiesConfig.filter(
    (item) => (property as any)[item.key]
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{property.name}</DialogTitle>
      <DialogContent>
        <img
          src={`data:image/jpeg;base64,${property.image_1920}`}
          alt={property.name}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
        />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
          {property.description_sale}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Équipements
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeAmenities.length > 0 ? (
            activeAmenities.map((amenity) => (
              <Chip
                key={amenity.key}
                label={amenity.label}
                color="primary"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucun équipement spécifique.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
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
        <Button variant="outlined" onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
