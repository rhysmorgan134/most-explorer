import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { Amplifier } from 'socketmost/dist/modules/Messages'
import { preDefinedMicrophones } from 'socketmost/dist/modules/Messages'
import Divider from '@mui/material/Divider'

interface Props {
  microphoneSettings: Amplifier
  setMicrophoneSettings: any
}

const StandaloneSettingsMic: React.FC<Props> = ({ microphoneSettings, setMicrophoneSettings }) => {
  const [microphone, setMicrophone] = React.useState('')

  const handleMicChange = (event: SelectChangeEvent): void => {
    setMicrophone(event.target.value as string)
    setMicrophoneSettings(preDefinedMicrophones[event.target.value as string])
  }

  console.log('microphone settings in view', microphoneSettings)
  return (
    <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Grid xs={12}>Microphone</Grid>
      <Divider />
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl fullWidth>
          <InputLabel id={'amp-select'}>Microphone</InputLabel>
          <Select
            labelId={'amp-select'}
            id={'amp-select'}
            value={microphone}
            label={'Microphone'}
            onChange={handleMicChange}
          >
            <MenuItem value={'jlr'}>Jaguar/Land Rover</MenuItem>
            <MenuItem value={'bmw'}>BMW</MenuItem>
            <MenuItem value={'volvoP1'}>Volvo P1</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid key={'fblock_amp'} xs={4}>
        <TextField
          label={'Amp Fblock'}
          type={'Number'}
          value={microphoneSettings.fblockId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMicrophoneSettings({ ...microphoneSettings, fblockId: parseInt(event.target.value) })
          }}
        />
      </Grid>
      <Grid key={'amp_address_high'} xs={4}>
        <TextField
          label={'Amp Address High'}
          type={'Number'}
          value={microphoneSettings.targetAddressHigh}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMicrophoneSettings({
              ...microphoneSettings,
              targetAddressHigh: parseInt(event.target.value)
            })
          }}
        />
      </Grid>
      <Grid key={'amp_address_low'} xs={4}>
        <TextField
          label={'Amp Address low'}
          type={'Number'}
          value={microphoneSettings.targetAddressLow}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMicrophoneSettings({
              ...microphoneSettings,
              targetAddressLow: parseInt(event.target.value)
            })
          }}
        />
      </Grid>
      <Grid key={'instance_id'} xs={4}>
        <TextField
          label={'Amp Instance ID'}
          type={'Number'}
          value={microphoneSettings.instanceId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMicrophoneSettings({
              ...microphoneSettings,
              instanceId: parseInt(event.target.value)
            })
          }}
        />
      </Grid>
      <Grid key={'sink_number'} xs={4}>
        <TextField
          label={'Amp Sink Number'}
          type={'Number'}
          value={microphoneSettings.sinkNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMicrophoneSettings({
              ...microphoneSettings,
              sinkNumber: parseInt(event.target.value)
            })
          }}
        />
      </Grid>
    </Grid>
  )
}

export default StandaloneSettingsMic
