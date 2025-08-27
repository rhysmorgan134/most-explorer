import Box from '@mui/material/Box'
import { CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useMostSettings } from '../store'

export default function Starting({ appStatus }) {
  const ip: string = useMostSettings((state) => state.ip)
  const renderStatus = () => {
    switch (appStatus) {
      case 0:
        return <Typography>Loading</Typography>
      case 1:
        return <Typography>Loaded</Typography>
      case 2:
        return <Typography>Waiting For Server Connect {ip}</Typography>
      case 3:
        return <Typography>Searching for SocketMost Server</Typography>
      case 4:
        return <Typography>Server found!</Typography>
      default:
        return <Typography>No State</Typography>
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <CircularProgress />
      {renderStatus()}
    </Box>
  )
}
