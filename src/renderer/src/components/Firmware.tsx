import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect } from 'react'
import usbDfuDevice from './usbDfuDevice'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Markdown from 'react-markdown'
import MuiMarkdown from 'mui-markdown'

let dfu = null

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

const Firmware: React.FC = () => {
  const [foundDevice, setDevice] = React.useState(null)
  const [serialNumber, setSerialNumber] = React.useState('')
  const [releases, setReleases] = React.useState({})
  const [selectedRelease, setSelectedRelease] = React.useState()
  const [versions, setVersions] = React.useState([])
  const [selectedVersion, setSelectedVersion] = React.useState('')
  const [status, setStatus] = React.useState('Idle')
  const [percentDone, setPercentDone] = React.useState(0)

  useEffect(() => {
    dfu = new usbDfuDevice(dfuStatusHandler, dfuProgressHandler, dfuuDisconnectHandler)
    getVersions()
  }, [])

  const selectDevice = async () => {
    setSerialNumber(await dfu.connect())
  }

  const getVersions = async () => {
    const url = 'https://api.github.com/repos/rhysmorgan134/pimost-usb/releases'
    const reponse = await fetch(url)
    const json = await reponse.json()
    const out = {}
    const tempVersions = []
    json.forEach((release) => {
      out[release.tag_name] = {
        body: release.body,
        versions: release.assets.map((e) => {
          return {
            name: e.name,
            url: 'https://api.cors.lol/?url=' + e.browser_download_url
          }
        })
      }
    })
    setVersions(tempVersions)
    setReleases(out)
  }

  const handleReleaseChange = (event: SelectChangeEvent) => {
    setSelectedRelease(event.target.value as string)
  }

  const handleVersionChange = (event: SelectChangeEvent) => {
    setSelectedVersion(event.target.value as string)
    console.log(selectedVersion)
  }

  const startUpdate = async () => {
    const response = await fetch(selectedVersion, { mode: 'cors' })
    console.log(selectedVersion)
    if (!response.ok) {
      console.log(response)
      throw 'Error: ' + response.status + ' ' + response.statusText
    }
    console.log(response)
    const fileArr = await response.arrayBuffer()
    console.log(fileArr)
    try {
      await dfu.runUpdateSequence(fileArr, 102400, 2048)
    } catch (e) {
      setStatus('Idle')
      alert(e)
    }

    alert('done')
  }

  const dfuStatusHandler = (status) => {
    setStatus(status)
    console.log('status ' + status)
  }

  const dfuProgressHandler = (progress) => {
    console.log('progress' + progress)
    setPercentDone(progress)
  }

  const dfuuDisconnectHandler = () => {
    console.log('disconnected')
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={4} sx={{ flexDirection: 'column' }}>
          <Button variant={'contained'} onClick={selectDevice}>
            connect
          </Button>
        </Grid>
        <Grid xs={4}>
          <Typography>Status: {status}</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography>Serial Number: {serialNumber}</Typography>
        </Grid>
        <Grid xs={4}>
          <FormControl fullWidth>
            <InputLabel id="pimost-release-label">Release</InputLabel>
            <Select
              labelId="pimost-release-label"
              id="pimost-release"
              value={selectedRelease ?? ''}
              label="Release"
              onChange={handleReleaseChange}
            >
              {Object.keys(releases).map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <FormControl fullWidth>
            <InputLabel id="pimost-release-label">version</InputLabel>
            <Select
              labelId="pimost-release-label"
              disabled={selectedRelease ? false : true}
              id="pimost-release"
              value={selectedVersion ?? ''}
              label="Release"
              onChange={handleVersionChange}
            >
              {selectedRelease
                ? releases[selectedRelease].versions.map((v) => (
                    <MenuItem key={v.name} value={v.url}>
                      {v.name}
                    </MenuItem>
                  ))
                : []}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12}>
          {selectedRelease ? <Markdown>{releases[selectedRelease].body}</Markdown> : <></>}
        </Grid>
        <Grid xs={12}>
          <Button
            onClick={startUpdate}
            variant={'contained'}
            disabled={selectedVersion && status === 'Connected' ? false : true}
          >
            Flash
          </Button>
        </Grid>
        <Grid
          xs={10}
          sx={{ display: status !== 'Idle' && status !== 'Connected' ? 'display' : 'none' }}
        >
          <LinearProgressWithLabel value={percentDone} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Firmware
