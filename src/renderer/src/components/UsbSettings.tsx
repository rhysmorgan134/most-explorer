import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useMostSettings } from '../store'
import { UsbSettings } from 'socketmost/dist/modules/Messages'

interface Props {
  actualSettings: any
  setActualSettings: any
}

const UsbSettingsPage: React.FC<Props> = ({ actualSettings, setActualSettings }) => {
  // const [settings] = useMostSettings((state) => [state])
  // const [actualSettings, setActualSettings] = useState({
  //   usb: false,
  //   ip: '',
  //   usbSettings: {
  //     version: '',
  //     standalone: false,
  //     autoShutdown: false,
  //     customShutdown: false,
  //     auxPower: false,
  //     forty8Khz: false,
  //     spare3: false,
  //     spare4: false,
  //     spare5: false,
  //     nodeAddressHigh: 0,
  //     nodeAddressLow: 0,
  //     groupAddress: 0,
  //     shutdownTimeDelay: 0,
  //     startupTimeDelay: 0,
  //     customShutdownMessage: {
  //       fblockId: 0,
  //       fktId: 0,
  //       optype: 0,
  //       data: []
  //     },
  //     amplifier: {
  //       fblockId: 0,
  //       targetAddressHigh: 0,
  //       targetAddressLow: 0,
  //       instanceId: 0,
  //       sinkNumber: 0
  //     }
  //   }
  // })

  // useEffect(() => {
  //   setActualSettings(settings)
  // }, [settings])

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
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
    </>
  )
}

export default UsbSettingsPage
