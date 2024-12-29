import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  RetrieveAudio,
  SocketMostSendMessage,
  Source,
  Stream,
  UsbSettings
} from 'socketmost/dist/modules/Messages'
import { SourceRecord } from '../main/parsers/JlrTouch'
import { Settings } from '../main/Types'

// Custom APIs for renderer
const api = {}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('most', {
      sendMessage: (message: SocketMostSendMessage) => ipcRenderer.invoke('sendMessage', message),
      newMessage: (callback) => ipcRenderer.on('newMessage', callback),
      error: (callback) => ipcRenderer.on('error', callback),
      appStatus: (callback) => ipcRenderer.on('appStatus', callback),
      registryUpdate: (callback) => ipcRenderer.on('registryUpdate', callback),
      functions: (callback) => ipcRenderer.on('functions', callback),
      requestRegistry: () => ipcRenderer.invoke('requestRegistry'),
      getSource: () => ipcRenderer.invoke('getSource'),
      allocate: () => ipcRenderer.invoke('allocate'),
      stream: (data: Stream) => ipcRenderer.invoke('stream', data),
      retrieveAudio: (data: RetrieveAudio) => ipcRenderer.invoke('retrieveAudio', data),
      getAppState: (data: RetrieveAudio) => ipcRenderer.invoke('getAppState', data),
      connectSource: (data: Source) => ipcRenderer.invoke('connectSource', data),
      disconnectSource: (data: Source) => ipcRenderer.invoke('disconnectSource', data),
      switchSource: (data: SourceRecord) => ipcRenderer.invoke('switchSource', data),
      settingsUpdate: (callback) => ipcRenderer.on('settingsUpdate', callback),
      getSettings: () => ipcRenderer.invoke('getSettings'),
      saveSettings: (settings: Settings) => ipcRenderer.invoke('saveSettings', settings),
      usbSettings: (settings: UsbSettings) => ipcRenderer.on('usbSettings', settings),
      bootToDFU: () => ipcRenderer.invoke('bootToDFU'),
      forceSwitch: () => ipcRenderer.invoke('forceSwitch'),
      getUsbSettings: () => ipcRenderer.invoke('getUsbSettings'),
      sendToDongle: (settings: UsbSettings) => ipcRenderer.invoke('sendToDongle', settings)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
