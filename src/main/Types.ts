import { UsbSettings } from 'socketmost/dist/modules/Messages'

export interface StmSettings {
  nodeAddressHigh: number
  nodeAddressLow: number
  nodeGroupAddress: number
  fwVersion: string
  auxPower: boolean
  auxAutoShutdown: boolean
  auxShutdownDelay: boolean
}

export interface Settings {
  usb: boolean
  manualIp: boolean
  ip: string
  usbSettings?: UsbSettings
}
