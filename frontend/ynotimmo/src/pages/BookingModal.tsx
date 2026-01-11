import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import type { IBookingUser } from '../types/IBooking'
import type IRentalProperty from '../types/IRentalProperty'

interface Props {
    open: boolean
    onClose: () => void
    property: IRentalProperty | null
    onSubmit: (bookingUser: IBookingUser) => void
}

export default function BookingModal({
    open,
    onClose,
    onSubmit,
    property,
}: Props) {
    const [formData, setFormData] = useState<IBookingUser>({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        zip: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = () => {
        onSubmit(formData)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Réserver : {property?.name}</DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            label="Nom complet"
                            name="name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Téléphone"
                            name="phone"
                            fullWidth
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Numéro + rue"
                            name="street"
                            fullWidth
                            value={formData.street}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={6}>
                        <TextField
                            label="Ville"
                            name="city"
                            fullWidth
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid size={6}>
                        <TextField
                            label="Code postal"
                            name="zip"
                            fullWidth
                            value={formData.zip}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Confirmer
                </Button>
            </DialogActions>
        </Dialog>
    )
}
