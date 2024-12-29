import {
  RetrieveAudio,
  SocketMostSendMessage,
  Source,
  Stream,
  UsbSettings
} from 'socketmost/dist/modules/Messages'
import { SourceRecord } from '../../main/parsers/JlrTouch'
import { Settings } from '../../main/Types'

export const requestRegistry = (): void => {
  window['most'].requestRegistry()
}

export const getSource = (): void => {
  window['most'].getSource()
}

export const sendMessage = (data: SocketMostSendMessage): void => {
  window['most'].sendMessage(data)
}

export const allocate = (): void => {
  window['most'].allocate()
}

export const stream = (data: Stream): void => {
  window['most'].stream(data)
}

export const retrieveAudio = (data: number[]): void => {
  window['most'].retrieveAudio(data)
}

export const getAppState = (): void => {
  window['most'].getAppState()
}

export const saveSettings = (settings: Settings): void => {
  window['most'].saveSettings(settings)
}

export const reqSettings = (): void => {
  console.log('requestingSettings')
  window['most'].getSettings()
}

export const connectSource = (data: Source): void => {
  console.log('ipc connect source request')
  window['most'].connectSource(data)
}

export const disconnectSource = (data: Source): void => {
  console.log('ipc connect source request')
  window['most'].disconnectSource(data)
}

export const switchSource = (data: SourceRecord): void => {
  window['most'].switchSource(data)
}

export const bootToDFU = (): void => {
  window['most'].bootToDFU()
}

export const forceSwitch = (): void => {
  window['most'].forceSwitch()
}

export const getUsbSettings = (): void => {
  window['most'].getUsbSettings()
}

export const sendToDongle = (settings: UsbSettings): void => {
  window['most'].sendToDongle(settings)
}
