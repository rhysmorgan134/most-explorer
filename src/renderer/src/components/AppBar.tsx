import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MenuIcon from '@mui/icons-material/Menu'
import SendIcon from '@mui/icons-material/Send'
import InputIcon from '@mui/icons-material/Input'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import SettingsIcon from '@mui/icons-material/Settings'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Apps, Mic } from '@mui/icons-material'
import { useStatusStore } from '../store'
import { forceSwitch } from '../ipc'

const pages = [{ name: 'Most Explorer', url: 'MostExplorer' }]
interface Props {
  colorMode: {
    toggleColorMode: () => void
  }
}
const ResponsiveAppBar: React.FC<Props> = ({ colorMode }) => {
  const [
    open,
    setOpen,
    retrieveAudioModal,
    setRetrieveAudioModal,
    setManualAll,
    sourceOpen,
    setSourceOpen,
    setSettingsOpen,
    settingsOpen,
    appStatus,
    setFirmwareOpen
  ] = useStatusStore((state) => [
    state.open,
    state.setOpen,
    state.retrieveAudioModal,
    state.setRetrieveAudioModal,
    state.setManualAll,
    state.sourceOpen,
    state.setSourceOpen,
    state.setSettingsOpen,
    state.settingsOpen,
    state.appStatus,
    state.setFirmwareOpen
  ])
  const nav = useNavigate()
  const theme = useTheme()

  return (
    <AppBar position="sticky" sx={{ height: '56px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}></Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.url}
                component={Link}
                to={`/${page.url}`}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={(): void => setFirmwareOpen(true)}
              color="inherit"
              // disabled={appStatus < 3 ? true : false}
            >
              <SystemUpdateAltIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={(): void => setRetrieveAudioModal(!retrieveAudioModal)}
              color="inherit"
              disabled={appStatus < 3 ? true : false}
            >
              <Mic />
            </IconButton>
          </Box>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={(): void => setSettingsOpen(true)} color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={(): void => setManualAll(true)}
              color="inherit"
              disabled={appStatus < 3 ? true : false}
            >
              <SendIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={(): void => forceSwitch()}
              color="inherit"
              disabled={appStatus < 3 ? true : false}
            >
              <AudiotrackIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={(): void => setSourceOpen(!sourceOpen)}
              color="inherit"
              disabled={appStatus < 3 ? true : false}
            >
              <InputIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={(): void => setOpen(!open)} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
