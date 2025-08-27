import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { TextField, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { connectSource, switchSource } from '../ipc'
import { useState } from 'react'
import { PartialSendMessage } from '../../../resources/GlobalTypes'

interface Props {
  fBlock: PartialSendMessage
}

const JlrSource: React.FC<Props> = ({ fBlock }) => {
  const [sourceNr, setSourceNr] = useState(1)

  const sources = {
    amFmTuner: {
      fBlockID: 0x40,
      instanceID: 0x01,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x80,
      name: 'amFmTuner'
    },
    dabTuner: {
      fBlockID: 0x43,
      instanceID: 0x01,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x80,
      name: 'dabTuner'
    },
    audioDiskPlayer: {
      fBlockID: 0x31,
      instanceID: 0x02,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x80,
      name: 'audioDiskPlayer'
    },
    usbAudio: {
      fBlockID: 0x31,
      instanceID: 0x05,
      shadow: 0xa2,
      addressHigh: 0x01,
      addressLow: 0x89,
      name: 'usbAudio'
    },
    unknown: {
      fBlockID: 0x23,
      instanceID: 0x05,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x86,
      name: 'unknown'
    },
    auxIn: {
      fBlockID: 0x24,
      instanceID: 0x01,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x80,
      name: 'auxIn'
    },
    carplay: {
      fBlockID: 0x24,
      instanceID: 0x01,
      shadow: 0xa1,
      addressHigh: 0x01,
      addressLow: 0x80,
      name: 'carplay'
    }
  }

  const requestSourceConnect = (): void => {
    connectSource({
      sourceAddrHigh: fBlock?.targetAddressHigh,
      sourceAddrLow: fBlock.targetAddressLow,
      fBlockID: fBlock.fBlockID,
      instanceID: fBlock.instanceID,
      sourceNr
    })
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        {Object.keys(sources).map((item, i) => {
          return (
            <Grid>
              <Box>
                <Button
                  variant={'outlined'}
                  color={'secondary'}
                  key={item}
                  onClick={(): void => switchSource(sources[item])}
                >
                  {item}
                </Button>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default JlrSource
