import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TrackOrder from './TrackOrder'
import LoginModal from './LoginModal'
import CreateAdModal from './CreateAdModal'
import CreatePropertyModal from './CreatePropertyModal'
import ImportPropertyModal from './ImportPropertyModal'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [openTrackOrder, setOpenTrackOrder] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [openCreateAd, setOpenCreateAd] = useState(false)
  const [openImportProperty, setOpenImportProperty] = useState(false)
  const [openCreateProperty, setOpenCreateProperty] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: 'white', color: 'black' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <img src="../../public/logo.jpg" style={{ width: '10%' }} />
          <Typography variant="caption" component="div">
            Pourquoi pas votre prochain chez-vous ?
          </Typography>

          <Box>
            <Button color="inherit">A propos</Button>

            {user ? null : (
              <Button color="inherit" onClick={() => setOpenTrackOrder(true)}>
                Suivre mes demandes
              </Button>
            )}

            <Button color="inherit">Contact</Button>
            {user ? (
              <Button color="inherit" onClick={() => setOpenCreateAd(true)}>
                Créer une annonce
              </Button>
            ) : null}
            {user ? (
              <Button color="inherit" onClick={logout}>
                Se déconnecter
              </Button>
            ) : (
              <Button color="inherit" onClick={() => setOpenLogin(true)}>
                Se connecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <TrackOrder
        open={openTrackOrder}
        onClose={() => setOpenTrackOrder(false)}
      />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      <CreateAdModal
        open={openCreateAd}
        onClose={() => setOpenCreateAd(false)}
        onCreate={() => setOpenCreateProperty(true)}
        onImport={() => setOpenImportProperty(true)}
      />
      <CreatePropertyModal
        open={openCreateProperty}
        onClose={() => setOpenCreateProperty(false)}
      />
      <ImportPropertyModal
        open={openImportProperty}
        onClose={() => setOpenImportProperty(false)}
      />
    </>
  )
}
