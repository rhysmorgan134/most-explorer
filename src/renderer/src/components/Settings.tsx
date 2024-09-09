import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { FormControlLabel, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import { useMostSettings } from '../store'
import Button from '@mui/material/Button'
import { saveSettings } from '../ipc'
import UsbSettingsPage from './UsbSettings'

interface Props {}

const Settings: React.FC<Props> = () => {
  const [settings] = useMostSettings((state) => [state])
  const [actualSettings, setActualSettings] = useState({
    usb: false,
    ip: '',
    manualIp: false,
    usbSettings: {
      version: '',
      standalone: false,
      autoShutdown: false,
      customShutdown: false,
      auxPower: false,
      forty8Khz: false,
      spare3: false,
      spare4: false,
      spare5: false,
      nodeAddressHigh: 0,
      nodeAddressLow: 0,
      groupAddress: 0,
      shutdownTimeDelay: 0,
      startupTimeDelay: 0,
      customShutdownMessage: {
        fblockId: 0,
        fktId: 0,
        optype: 0,
        data: []
      },
      amplifier: {
        fblockId: 0,
        targetAddressHigh: 0,
        targetAddressLow: 0,
        instanceId: 0,
        sinkNumber: 0
      }
    }
  })

  useEffect(() => {
    setActualSettings(settings)
  }, [settings])

  const updateSettings = (key, value) => {
    setActualSettings({ ...actualSettings, [key]: value })
  }

  const setUsb = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'true') {
      setActualSettings({ ...actualSettings, usb: true, manualIp: false })
    } else {
      setActualSettings({ ...actualSettings, usb: false, manualIp: true })
    }
  }
  //we.tl/t-jqcGhBRmi3
  const setManualIp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActualSettings({ ...actualSettings, manualIp: event.target.checked })
  }

  console.log('settings in view', actualSettings)
  return (
    <Grid container spacing={2} sx={{ minHeight: '80%' }}>
      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={actualSettings.usb}
          name="radio-buttons-group"
          row
          onChange={setUsb}
        >
          <FormControlLabel value={'true'} control={<Radio />} label={'Usb'} />
          <FormControlLabel value={'false'} control={<Radio />} label="Network" />
        </RadioGroup>
      </Grid>

      {actualSettings.usb ? (
        <UsbSettingsPage actualSettings={actualSettings} setActualSettings={setActualSettings} />
      ) : (
        <>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={actualSettings.manualIp}
                  onChange={setManualIp}
                  inputProps={{ 'aria-label': 'Manual Ip' }}
                />
              }
              label="Manual Ip"
            ></FormControlLabel>
          </Grid>
          {actualSettings.manualIp ? (
            <Grid xs={8}>
              <TextField
                id={'ipAddress'}
                label={'Ip Address'}
                value={actualSettings.ip}
                error={actualSettings.ip.split('.').length === 4 ? false : true}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  updateSettings('ip', event.target.value)
                }}
              ></TextField>
            </Grid>
          ) : (
            <Grid xs={8}></Grid>
          )}
        </>
      )}

      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={(): void => saveSettings(actualSettings)}>
          SAVE
        </Button>
      </Grid>
    </Grid>
  )
}

export default Settings
