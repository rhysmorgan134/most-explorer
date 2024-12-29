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
    manualIp: false
  })

  useEffect(() => {
    setActualSettings(settings)
  }, [settings])

  const updateSettings = (key, value) => {
    setActualSettings({ ...actualSettings, [key]: value })
  }

  const setUsb = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'true') {
      setActualSettings((prev) => {
        let newState = { ...prev, usb: true, manualIp: false }
        saveSettings(newState)
        return newState
      })
    } else {
      setActualSettings((prev) => {
        let newState = { ...prev, usb: false, manualIp: true }
        saveSettings(newState)
        return newState
      })
    }
  }
  //we.tl/t-jqcGhBRmi3
  const setManualIp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActualSettings({ ...actualSettings, manualIp: event.target.checked })
  }

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
        <></>
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
      {actualSettings.usb ? (
        <Grid container xs={12} sx={{ justifyContent: 'center' }}>
          <UsbSettingsPage />
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  )
}

export default Settings
