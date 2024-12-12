import React, { useEffect, useState } from 'react'
import {
  useLogStore,
  useMessageStore,
  useNetworkStore,
  useStatusStore,
  LogStore,
  MessageStore,
  NetworkStore
} from '../store'
import { Alert, Box, TextField, Dialog, DialogContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Messages from './Messages'
import Button from '@mui/material/Button'
import { requestRegistry, getSource, allocate } from '../ipc'
import ManualMessage from './ManualMessage'
import RetrieveAudio from './RetrieveAudio'
import ManualMessageAll from './ManualMessageAll'
import JlrSource from './JlrSource'
import Settings from './Settings'

const Home: React.FC = () => {
  let errorTimer: NodeJS.Timer | undefined = undefined
  const [error, setError] = useState(null)
  const [
    log,
    clearLog,
    loggingEnabled,
    setLoggingEnabled,
    logOnlyData,
    setLogOnlyData,
    dataLog,
    logCount
  ] = useLogStore((state: LogStore) => [
    state.log,
    state.clearLog,
    state.loggingEnabled,
    state.setLoggingEnabled,
    state.logOnlyData,
    state.setLogOnlyData,
    state.dataLog,
    state.logCount
  ])
  const [filter, setFilter, messages] = useMessageStore((state: MessageStore) => [
    state.filter,
    state.setFilter,
    state.messages
  ])
  const [
    fBlock,
    clearFBlock,
    retrieveAudioModal,
    setRetrieveAudioModal,
    setManualAll,
    manualOpen,
    sourceOpen,
    setSourceOpen,
    settingsOpen,
    setSettingsOpen,
    fBlockModalOpen,
    setFBlockModalOpen,
  ] = useStatusStore((state) => [
    state.fBlock,
    state.clearFBlock,
    state.retrieveAudioModal,
    state.setRetrieveAudioModal,
    state.setManualAll,
    state.manualOpen,
    state.sourceOpen,
    state.setSourceOpen,
    state.settingsOpen,
    state.setSettingsOpen,
    state.fBlockModalOpen,
    state.setFBlockModalOpen,
  ])
  const [clearFunctions] = useNetworkStore((state: NetworkStore) => [state.clearFunctions])
  const [logName, setlogName] = useState('')
  //console.log(functions)
  useEffect(() => {
    window['most'].error((_event, value: string): void => {
      setErrorData(value)
    })
    window['most'].getSettings()
    return () => {
      clearTimeout(errorTimer)
    }
  }, [])

  function setErrorData(value): void {
    if (errorTimer) {
      clearTimeout(errorTimer)
    }
    setError(value)
    errorTimer = setTimeout(() => {
      setError(null)
    }, 10000)
  }

  function convertLog(): object[] {
    const rows = log.split('\n')

    const jsons: object[] = []

    rows.forEach((row) => {
      console.log(row.length)
      if (row.length > 0) {
        const temp = JSON.parse(row)

        const out = {}
        Object.keys(temp).forEach((key) => {
          if (key !== 'data') {
            out[key] = '0x' + temp[key].toString(16)
          } else {
            const tempData: string[] = []
            temp[key].forEach((dKey) => {
              tempData.push('0x' + dKey.toString(16))
            })
            out[key] = tempData
          }
        })
        jsons.push(out)
      }
    })
    return jsons
  }

  function setLogging(): void {
    if (loggingEnabled) {
      const blob = new Blob([JSON.stringify(convertLog(), null, '\t')], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = logName === '' ? 'MostDump.log' : logName + '.log'
      link.href = url
      link.click()
      setLoggingEnabled(false)
      clearLog()
    } else {
      setLoggingEnabled(true)
    }
  }

  function setDataLogging(): void {
    if (logOnlyData) {
      const blob = new Blob([dataLog])
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = logName === '' ? 'MostDump.log' : logName + '.log'
      link.href = url
      link.click()
      setLogOnlyData(false)
      clearLog()
    } else {
      setLogOnlyData(true)
    }
  }

  const filterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const logNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setlogName(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 0, height: '100%' }}>
      <Button variant={'outlined'} onClick={(): void => requestRegistry()}>
        Request Registry
      </Button>
      <Button variant={'outlined'} onClick={(): void => allocate()}>
        Allocate
      </Button>
      <Button variant={'outlined'} onClick={(): void => getSource()}>
        get source
      </Button>
      <Button variant={'outlined'} onClick={(): void => setLogging()}>
        {loggingEnabled ? 'Stop Logging' : 'Begin Logging'}
      </Button>
      <Button variant={'outlined'} onClick={(): void => setDataLogging()}>
        {logOnlyData ? `Stop Data Logging ${logCount}` : 'Begin Data Logging'}
      </Button>
      <TextField label={'Log File Name'} value={logName} onChange={logNameChange} />
      {error ? <Alert severity="error">{error}</Alert> : <div></div>}
      <Box sx={{ flexGrow: 0, flexDirection: 'row', display: 'flex' }}>
        <Grid xs={12} container spacing={2} sx={{ flexGrow: 1 }}>
          <TextField label={'FBlock ID'} value={filter} onChange={filterChange} />
          <Messages messages={messages} />
        </Grid>
      </Box>
      <Dialog
        open={fBlockModalOpen}
        onClose={(): void => {
          clearFBlock()
          clearFunctions()
          setFBlockModalOpen(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <ManualMessage fBlock={fBlock!} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={retrieveAudioModal}
        onClose={(): void => {
          setRetrieveAudioModal(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <RetrieveAudio />
        </DialogContent>
      </Dialog>
      <Dialog
        open={manualOpen}
        onClose={(): void => {
          setManualAll(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <ManualMessageAll />
        </DialogContent>
      </Dialog>
      <Dialog
        open={sourceOpen}
        onClose={(): void => {
          setSourceOpen(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <JlrSource />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Home
