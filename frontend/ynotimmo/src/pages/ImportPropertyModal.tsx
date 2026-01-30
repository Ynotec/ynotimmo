import { useState, type ChangeEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import Papa from 'papaparse'
import RentalPropertyService from '../services/RentalPropertyService'
import type IRentalProperty from '../types/IRentalProperty'

interface ImportPropertyModalProps {
  open: boolean
  onClose: () => void
}

export default function ImportPropertyModal({
  open,
  onClose,
}: ImportPropertyModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<
    string | { message: string; errors: any[] }
  >('')

  const getErrorMessage = (err: any): string => {
    if (typeof err === 'string') return err
    if (err instanceof Error) return err.message
    return "Une erreur est survenue lors de l'import du fichier."
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (
        selectedFile.type !== 'text/csv' &&
        !selectedFile.name.endsWith('.csv')
      ) {
        setError('Veuillez sélectionner un fichier au format CSV.')
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          console.log('Données analysées depuis le CSV:', results.data)

          const properties: IRentalProperty[] = results.data
            .map((row: any) => {
              // Adapter ce mapping aux colonnes de votre CSV
              return {
                name: row.name,
                description_sale: row.description_sale,
                list_price: parseFloat(row.list_price) || 0,
                street: row.street,
                number_house: row.number_house,
                postal_code: row.postal_code,
                guest_capacity: parseInt(row.guest_capacity, 10) || 0,
                number_of_bed: parseInt(row.number_of_bed, 10) || 0,
                number_of_bedrooms: parseInt(row.number_of_bedrooms, 10) || 0,
                number_of_bathrooms: parseInt(row.number_of_bathrooms, 10) || 0,
                climatization: ['true', '1', 'oui'].includes(
                  String(row.climatization).toLowerCase()
                ),
                image_1920:
                  row.image_1920 && row.image_1920.includes('base64,')
                    ? row.image_1920.split('base64,')[1]
                    : row.image_1920 || '',
                is_storable: true,
                virtual_available: 1,
                qty_available: 1,
              }
            })
            .filter((p) => p.name) // On ne garde que les lignes qui ont un nom

          if (properties.length === 0) {
            throw new Error(
              "Le fichier CSV est vide ou ne contient aucune ligne avec un 'nom' valide."
            )
          }

          const response =
            await RentalPropertyService.importPropertiesFromJson(properties)

          console.log('Import terminé.', response)

          if (response.errors && response.errors.length > 0) {
            setError({
              message: response.message,
              errors: response.errors,
            })
            setLoading(false)
          } else {
            // Tout s'est bien passé, on ferme
            handleClose()
          }
        } catch (err) {
          console.error("Erreur lors de l'import :", err)
          setError(getErrorMessage(err))
          setLoading(false)
        }
      },
      error: (err: Error) => {
        console.error('Erreur PapaParse:', err)
        setError(`Erreur lors de l'analyse du fichier CSV: ${err.message}`)
        setLoading(false)
      },
    })
  }

  // Réinitialise l'état à la fermeture
  const handleClose = () => {
    setFile(null)
    setError('')
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importer des annonces (CSV)</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {typeof error === 'string' ? error : error.message}
            {typeof error !== 'string' && error.errors && (
              <List dense>
                {error.errors.slice(0, 5).map((e, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Ligne pour '${e.propertyName}': ${e.error}`}
                    />
                  </ListItem>
                ))}
                {error.errors.length > 5 && (
                  <ListItem>
                    <ListItemText
                      primary={`... et ${error.errors.length - 5} autre(s) erreur(s)`}
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Alert>
        )}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" gutterBottom>
            Sélectionnez un fichier CSV contenant les annonces à importer. Le
            fichier doit respecter le format attendu par le système.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={loading}
          >
            {file ? file.name : 'Choisir un fichier...'}
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || loading}
        >
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
