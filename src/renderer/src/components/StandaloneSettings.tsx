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
import { Amplifier, UsbSettings } from 'socketmost/dist/modules/Messages'
import { preDefinedAmplifiers } from 'socketmost/dist/modules/Messages'
import Divider from '@mui/material/Divider'

interface Props {
  amplifierSettings: Amplifier
  setAmplifierSettings: any
}

const StandaloneSettings: React.FC<Props> = ({ amplifierSettings, setAmplifierSettings }) => {
  const [amplifier, setAmplifier] = React.useState('')

  const handleAmpChange = (event: SelectChangeEvent): void => {
    setAmplifier(event.target.value as string)
    setAmplifierSettings(preDefinedAmplifiers[event.target.value as string])
  }

  console.log('amplifier settings in view', amplifierSettings)
  return (
    <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Grid xs={12}>Amplifier</Grid>
      <Divider />
      <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl fullWidth>
          <InputLabel id={'amp-select'}>Amplifier</InputLabel>
          <Select
            labelId={'amp-select'}
            id={'amp-select'}
            value={amplifier}
            label={'Amplifier'}
            onChange={handleAmpChange}
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
          value={amplifierSettings.fblockId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmplifierSettings({ fblockId: parseInt(event.target.value) })
          }}
        />
      </Grid>
      <Grid key={'amp_address_high'} xs={4}>
        <TextField
          label={'Amp Address High'}
          type={'Number'}
          value={amplifierSettings.targetAddressHigh}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmplifierSettings({ targetAddressHigh: parseInt(event.target.value) })
          }}
        />
      </Grid>
      <Grid key={'amp_address_low'} xs={4}>
        <TextField
          label={'Amp Address low'}
          type={'Number'}
          value={amplifierSettings.targetAddressLow}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmplifierSettings({ targetAddressLow: parseInt(event.target.value) })
          }}
        />
      </Grid>
      <Grid key={'instance_id'} xs={4}>
        <TextField
          label={'Amp Instance ID'}
          type={'Number'}
          value={amplifierSettings.instanceId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmplifierSettings({ instanceId: parseInt(event.target.value) })
          }}
        />
      </Grid>
      <Grid key={'sink_number'} xs={4}>
        <TextField
          label={'Amp Sink Number'}
          type={'Number'}
          value={amplifierSettings.sinkNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmplifierSettings({ sinkNumber: parseInt(event.target.value) })
          }}
        />
      </Grid>
    </Grid>
  )
}

export default StandaloneSettings
