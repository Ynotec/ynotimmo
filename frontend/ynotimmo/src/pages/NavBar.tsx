import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function Navbar() {
    return (
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
                    <Button color="inherit">Suivre mes demandes</Button>
                    <Button color="inherit">Contact</Button>
                    <Button color="inherit">Se connecter</Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
