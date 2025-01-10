import React, { useEffect } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Chip, FormControlLabel, Switch, TextField } from '@mui/material'
import { UsbSettings } from 'socketmost/dist/modules/Messages'
import Button from '@mui/material/Button'
import { bootToDFU, getUsbSettings, reqSettings, sendToDongle } from '../ipc'
import StandaloneSettings from './StandaloneSettings'
import StandaloneSettingsMic from './StandaloneSettingsMic'
import { useUsbSettings } from '../store'

const UsbSettingsPage: React.FC = () => {
  const [settingsReceived, setSettingsRecevied] = React.useState(false)
  const [usbSettings] = useUsbSettings((state) => [state.usbSettings])
  const [tempSettings, setTempSettings] = React.useState<UsbSettings>({} as UsbSettings)
  const updateSettings = (key, value) => {
    setTempSettings({ ...tempSettings, [key]: value })
  }

  useEffect(() => {
    getUsbSettings()
    setSettingsRecevied(false)
  }, [])

  useEffect(() => {
    console.log('received settings update')
    if (usbSettings.version != '') {
      setSettingsRecevied(true)
    } else {
      setSettingsRecevied(false)
    }
    setTempSettings(usbSettings)
  }, [usbSettings])

  const updateUsbSettings = (
    key: keyof UsbSettings,
    value: (typeof usbSettings)[keyof typeof usbSettings]
  ) => {
    setTempSettings({
      ...tempSettings,
      [key]: parseInt(value)
    })
  }
  //we.tl/t-jqcGhBRmi3

  const setAmplifierSettings = (settings) => {
    setTempSettings({
      ...tempSettings,
      amplifier: settings
    })
  }

  const setMicrophoneSettings = (settings) => {
    console.log('setting microphone', settings)
    setTempSettings({
      ...tempSettings,
      microphone: settings
    })
  }

  return (
    <>
      {settingsReceived ? (
        <>
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip label={'FW Version:  ' + tempSettings.version} variant="outlined" />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="nodeAddrHigh"
              label="Node Address High"
              value={tempSettings.nodeAddressHigh}
              type={'number'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                updateUsbSettings('nodeAddressHigh', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="nodeAddrLow"
              label="Node Address Low"
              value={tempSettings.nodeAddressLow}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                updateUsbSettings('nodeAddressLow', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="groupAddr"
              label="Group Address"
              value={tempSettings.groupAddress}
              type={'number'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                updateUsbSettings('groupAddress', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="standalone"
                  checked={tempSettings.standalone ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('standalone', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'Standalone'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="autoShutdown"
                  checked={tempSettings.autoShutdown ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('autoShutdown', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'Auto Shutdown'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'none', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="customeShutdown"
                  checked={tempSettings.customShutdown ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('customShutdown', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'Custom Shutdown'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="auxPower"
                  checked={tempSettings.auxPower ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('auxPower', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'Aux Power'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'none', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="48Khz"
                  checked={tempSettings.forty8Khz ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('forty8Khz', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'48Khz'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  id="debug"
                  checked={tempSettings.debug ? true : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    updateUsbSettings('debug', event.target.checked ? 1 : 0)
                  }}
                />
              }
              label={'debug'}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="ShutdownDelay"
              label="Shutdown Time Delay"
              error={parseInt(tempSettings.shutdownTimeDelay) ? false : true}
              value={tempSettings.shutdownTimeDelay}
              type={'number'}
              helperText={
                parseInt(tempSettings.shutdownTimeDelay) ? '' : 'Enter value as hex or decimal'
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                updateUsbSettings('shutdownTimeDelay', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="StartUpDelay"
              label="Startup Time Delay"
              error={parseInt(tempSettings.startupTimeDelay) ? false : true}
              value={tempSettings.startupTimeDelay}
              type={'number'}
              helperText={
                parseInt(tempSettings.startupTimeDelay) ? '' : 'Enter value as hex or decimal'
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                updateUsbSettings('startupTimeDelay', event.target.value)
              }}
            />
          </Grid>
          {tempSettings.standalone ? (
            <>
              <StandaloneSettings
                setAmplifierSettings={setAmplifierSettings}
                amplifierSettings={tempSettings.amplifier}
              />
              <StandaloneSettingsMic
                setMicrophoneSettings={setMicrophoneSettings}
                microphoneSettings={tempSettings.microphone}
              />
            </>
          ) : (
            <></>
          )}
          <Grid xs={4} sx={{ display: 'none', justifyContent: 'center' }}>
            <Button onClick={() => bootToDFU()}>Boot To DFU</Button>
          </Grid>{' '}
          <Grid xs={4} sx={{ justifyContent: 'center' }}>
            <Button onClick={(): void => sendToDongle(tempSettings)}>Send To Dongle</Button>
          </Grid>{' '}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default UsbSettingsPage
