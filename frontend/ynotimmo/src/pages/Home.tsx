import type IRentalProperty from '../types/IRentalProperty.ts'
import type { IBookingUser } from '../types/IBooking'
import type IBooking from '../types/IBooking'

import RentalPropertyService from '../services/RentalPropertyService'
import BookingService from '../services/BookingService'

import PropertyCard from './PropertyCard.tsx'
import PropertyDetail from './PropertyDetail.tsx'
import BookingModal from './BookingModal.tsx'

import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid'

import { useState, useEffect } from 'react'

export default function Home() {
    const [selectedProperty, setSelectedProperty] =
        useState<IRentalProperty | null>(null)
    const [properties, setProperties] = useState<IRentalProperty[]>([])
    const [selectedOrder, setSelectedOrder] = useState<IRentalProperty | null>(
        null
    )

    const [loading, setLoading] = useState(true)

    const handleCreateBooking = async (userData: IBookingUser) => {
        if (
            !selectedOrder ||
            typeof selectedOrder.id === 'undefined' ||
            typeof selectedOrder.list_price === 'undefined'
        ) {
            alert(
                'La propriété sélectionnée est invalide ou incomplète. Impossible de réserver.'
            )
            return
        }

        try {
            const bookingPayload: IBooking = {
                user: userData,
                lines: [
                    {
                        product_id: selectedOrder.id,
                        name: `Location : ${selectedOrder.name || ''}`,
                        product_uom_qty: 1,
                        price_unit: selectedOrder.list_price,
                    },
                ],
            }

            await BookingService.createBooking(bookingPayload)
            setSelectedOrder(null)

            alert('Votre demande de location a bien été envoyée !')
        } catch (error) {
            console.error('Erreur lors de la réservation', error)
            alert("Une erreur est survenue lors de l'envoi.")
        }
    }
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true)
                const data = await RentalPropertyService.getAllProperties()
                setProperties(data)
            } catch (error) {
                console.error('Erreur', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProperties()
    }, [])

    return (
        <div>
            <Grid container spacing={2}>
                {loading
                    ? Array.from(new Array(6)).map((_, index) => (
                          <Grid size={6} key={index}>
                              <Skeleton variant="rectangular" height={200} />
                              <Skeleton variant="text" height={40} />
                              <Skeleton variant="text" width="60%" />
                          </Grid>
                      ))
                    : properties.map((property) => (
                          <Grid size={6} key={property.id}>
                              <PropertyCard
                                  property={property}
                                  onSelectDetail={() =>
                                      setSelectedProperty(property)
                                  }
                                  onSelectOrder={() =>
                                      setSelectedOrder(property)
                                  }
                              />
                          </Grid>
                      ))}
            </Grid>
            <PropertyDetail
                open={!!selectedProperty}
                onSelectOrder={() => setSelectedOrder(selectedProperty)}
                onClose={() => setSelectedProperty(null)}
                property={selectedProperty}
            />
            <BookingModal
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onSubmit={handleCreateBooking}
                property={selectedOrder}
            />
        </div>
    )
}
