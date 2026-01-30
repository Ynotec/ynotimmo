import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material'

interface CreateAdModalProps {
  open: boolean
  onClose: () => void
  onCreate: () => void
  onImport: () => void
}

export default function CreateAdModal({
  open,
  onClose,
  onCreate,
  onImport,
}: CreateAdModalProps) {
  const handleCreate = () => {
    onClose()
    onCreate()
  }

  const handleImport = () => {
    onClose()
    onImport()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Gestion des annonces</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Button variant="contained" onClick={handleCreate} fullWidth>
            Créer une annonce
          </Button>
          <Button variant="outlined" onClick={handleImport} fullWidth>
            Importer des annonces
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  )
}
