import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
} from '@mui/material'
import type IRentalProperty from '../types/IRentalProperty'
import RentalPropertyService from '../services/RentalPropertyService'

interface CreatePropertyModalProps {
  open: boolean
  onClose: () => void
}

export default function CreatePropertyModal({
  open,
  onClose,
}: CreatePropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description_sale: '',
    street: '',
    number_house: '',
    postal_code: '',
    list_price: '',
    image_1920: '',
    virtual_available: 1,
    qty_available: 1,
    // Capacity
    guest_capacity: '',
    number_of_bed: '',
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    // Equipment
    climatization: false,
    terrace: false,
    garden: false,
    swimming_pool: false,
    jacuzzi: false,
    charge_ev: false,
    indoor_fireplace: false,
    outdoor_fireplace: false,
    dedicated_workspace: false,
    gym: false,
    // Accessibility
    toilet_grab_bar: false,
    shower_grab_bar: false,
    shower_free_access: false,
    shower_seat: false,
    bedroom_free_access: false,
    bedroom_large_door: false,
    general_free_access: false,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        setFormData((prev) => ({ ...prev, image_1920: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        list_price: parseFloat(formData.list_price as string) || 0,
        guest_capacity: parseInt(formData.guest_capacity as string, 10) || 0,
        number_of_bed: parseInt(formData.number_of_bed as string, 10) || 0,
        number_of_bedrooms:
          parseInt(formData.number_of_bedrooms as string, 10) || 0,
        number_of_bathrooms:
          parseInt(formData.number_of_bathrooms as string, 10) || 0,
        is_storable: true,
      }
      console.log('Payload ready for backend:', payload)

      await RentalPropertyService.importProperty(payload)
      onClose()
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce", error)
    }
  }

  const renderCheckbox = (name: string, label: string) => (
    <Grid size={4} key={name}>
      <FormControlLabel
        control={
          <Checkbox
            checked={(formData as any)[name]}
            onChange={handleChange}
            name={name}
            size="small"
          />
        }
        label={<Typography variant="body2">{label}</Typography>}
      />
    </Grid>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Créer une nouvelle annonce</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* --- Informations Générales --- */}
            <Grid size={12}>
              <Typography variant="h6" color="primary">
                Informations Générales
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Titre de l'annonce"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                name="description_sale"
                fullWidth
                multiline
                rows={3}
                value={formData.description_sale}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Prix / mois (€)"
                name="list_price"
                type="number"
                fullWidth
                value={formData.list_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '100%' }}
              >
                {formData.image_1920
                  ? 'Image chargée (Modifier)'
                  : 'Télécharger une image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>

            {/* --- Localisation --- */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Localisation
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid size={8}>
              <TextField
                label="Rue"
                name="street"
                fullWidth
                value={formData.street}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                label="Numéro"
                name="number_house"
                fullWidth
                value={formData.number_house}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Code Postal"
                name="postal_code"
                fullWidth
                value={formData.postal_code}
                onChange={handleChange}
              />
            </Grid>

            {/* --- Capacité --- */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Capacité
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Voyageurs"
                name="guest_capacity"
                type="number"
                fullWidth
                value={formData.guest_capacity}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Lits"
                name="number_of_bed"
                type="number"
                fullWidth
                value={formData.number_of_bed}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Chambres"
                name="number_of_bedrooms"
                type="number"
                fullWidth
                value={formData.number_of_bedrooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="SDB"
                name="number_of_bathrooms"
                type="number"
                fullWidth
                value={formData.number_of_bathrooms}
                onChange={handleChange}
              />
            </Grid>

            {/* --- Équipements --- */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Équipements
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            {renderCheckbox('climatization', 'Climatisation')}
            {renderCheckbox('terrace', 'Terrasse')}
            {renderCheckbox('garden', 'Jardin')}
            {renderCheckbox('swimming_pool', 'Piscine')}
            {renderCheckbox('jacuzzi', 'Jacuzzi')}
            {renderCheckbox('charge_ev', 'Borne Recharge')}
            {renderCheckbox('indoor_fireplace', 'Cheminée Int.')}
            {renderCheckbox('outdoor_fireplace', 'Cheminée Ext.')}
            {renderCheckbox('dedicated_workspace', 'Espace Travail')}
            {renderCheckbox('gym', 'Salle de sport')}

            {/* --- Accessibilité --- */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Accessibilité
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            {renderCheckbox('toilet_grab_bar', 'Barre appui WC')}
            {renderCheckbox('shower_grab_bar', 'Barre appui Douche')}
            {renderCheckbox('shower_free_access', 'Douche accès libre')}
            {renderCheckbox('shower_seat', 'Siège de douche')}
            {renderCheckbox('bedroom_free_access', 'Chambre accès libre')}
            {renderCheckbox('bedroom_large_door', 'Grande porte chambre')}
            {renderCheckbox('general_free_access', 'Accès général libre')}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
