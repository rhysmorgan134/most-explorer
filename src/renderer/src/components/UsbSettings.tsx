import React, { useEffect } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Chip, FormControlLabel, Switch, TextField } from '@mui/material'
import { UsbSettings } from 'socketmost/dist/modules/Messages'
import Button from '@mui/material/Button'
import { bootToDFU } from '../ipc'
import stm32dfu from 'stm32dfu'
import StandaloneSettings from './StandaloneSettings'
import StandaloneSettingsMic from './StandaloneSettingsMic'

interface Props {
  actualSettings: any
  setActualSettings: any
}

const UsbSettingsPage: React.FC<Props> = ({ actualSettings, setActualSettings }) => {
  const updateSettings = (key, value) => {
    setActualSettings({ ...actualSettings, [key]: value })
  }

  const updateUsbSettings = (
    key: keyof UsbSettings,
    value: (typeof actualSettings.usbSettings)[keyof typeof actualSettings.usbSettings]
  ) => {
    setActualSettings({
      ...actualSettings,
      usbSettings: { ...actualSettings.usbSettings, [key]: parseInt(value) }
    })
    console.log(actualSettings)
  }
  //we.tl/t-jqcGhBRmi3

  const setAmplifierSettings = (settings) => {
    setActualSettings({
      ...actualSettings,
      usbSettings: {
        ...actualSettings.usbSettings,
        amplifier: {
          ...actualSettings.usbSettings.amplifier,
          ...settings
        }
      }
    })
    console.log(actualSettings)
  }

  const setMicrophoneSettings = (settings) => {
    setActualSettings({
      ...actualSettings,
      usbSettings: {
        ...actualSettings.usbSettings,
        microphone: {
          ...actualSettings.usbSettings.microphone,
          ...settings
        }
      }
    })
    console.log(actualSettings)
  }

  console.log('settings in view', actualSettings)
  return (
    <>
      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Chip label={'FW Version:  ' + actualSettings.usbSettings.version} variant="outlined" />
      </Grid>
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          id="nodeAddrHigh"
          label="Node Address High"
          value={actualSettings.usbSettings.nodeAddressHigh}
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
          value={actualSettings.usbSettings.nodeAddressLow}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            updateUsbSettings('nodeAddressLow', event.target.value)
          }}
        />
      </Grid>
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          id="groupAddr"
          label="Group Address"
          value={actualSettings.usbSettings.groupAddress}
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
              checked={actualSettings.usbSettings.standalone ? true : false}
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
              checked={actualSettings.usbSettings.autoShutdown ? true : false}
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
              checked={actualSettings.usbSettings.customShutdown ? true : false}
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
              checked={actualSettings.usbSettings.auxPower ? true : false}
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
              checked={actualSettings.usbSettings.forty8Khz ? true : false}
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
              checked={actualSettings.usbSettings.debug ? true : false}
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
          error={parseInt(actualSettings.usbSettings.shutdownTimeDelay) ? false : true}
          value={actualSettings.usbSettings.shutdownTimeDelay}
          type={'number'}
          helperText={
            parseInt(actualSettings.usbSettings.shutdownTimeDelay)
              ? ''
              : 'Enter value as hex or decimal'
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
          error={parseInt(actualSettings.usbSettings.startupTimeDelay) ? false : true}
          value={actualSettings.usbSettings.startupTimeDelay}
          type={'number'}
          helperText={
            parseInt(actualSettings.usbSettings.startupTimeDelay)
              ? ''
              : 'Enter value as hex or decimal'
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            updateUsbSettings('startupTimeDelay', event.target.value)
          }}
        />
      </Grid>
      {actualSettings.usbSettings.standalone ? (
        <>
          <StandaloneSettings
            setAmplifierSettings={setAmplifierSettings}
            amplifierSettings={actualSettings.usbSettings.amplifier}
          />
          <StandaloneSettingsMic
            setMicrophoneSettings={setMicrophoneSettings}
            microphoneSettings={actualSettings.usbSettings.microphone}
          />
        </>
      ) : (
        <></>
      )}
      <Grid xs={4} sx={{ display: 'none', justifyContent: 'center' }}>
        <Button onClick={() => bootToDFU()}>Boot To DFU</Button>
      </Grid>
    </>
  )
}

export default UsbSettingsPage
