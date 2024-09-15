import EventEmitter from 'events'
import { io, Socket as IoSocket } from 'socket.io-client'
import { Dgram } from './utils/Dgram'
import {
  AllocResult,
  SocketMostMessageRx,
  Stream,
  RetrieveAudio,
  SocketMostSendMessage,
  SocketTypes,
  Source
} from 'socketmost/dist/modules/Messages'
import { BrowserWindow } from 'electron'
import { ErrorParser } from './utils/ErrorParser'
import { Parser } from './utils/MessageParser'
import { AppState, IoMostRx } from '../resources/GlobalTypes'
import { Settings } from './Types'
import { JlrAudioControl } from 'socketmost'
import { SourceRecord } from './parsers/JlrTouch'

export class Most extends EventEmitter {
  socket?: IoSocket
  dgram: Dgram
  win: BrowserWindow
  errorParser: ErrorParser
  parser: Parser
  appState: number
  settings: Settings
  address: null | string
  audio?: JlrAudioControl

  constructor(win: BrowserWindow, settings: Settings) {
    super()
    this.parser = new Parser()
    this.win = win
    this.address = null

    this.errorParser = new ErrorParser()
    this.appState = AppState.loading
    this.settings = settings
    this.updateAppState(this.appState)
    if (this.settings.manualIp) {
      this.createSocketIo(this.settings.ip)
    } else {
      this.dgram = new Dgram()
      this.dgram.on('listening', () => {
        this.updateAppState(AppState.waitingForServer)
      })
      this.dgram.on('close', () => {
        console.log('dgram closed')
      })
      this.dgram.on('error', () => {
        console.log('dgram error')
      })
      this.dgram.on('serverFound', (address: string) => {
        this.address = address
        this.createSocketIo(address)
      })
    }

    this.parser.on('registryComplete', (registry) => {
      this.win?.webContents.send('registryUpdate', registry)
    })

    this.parser.on('functions', (data) => {
      this.win?.webContents.send('functions', data)
    })
  }

  createSocketIo(address): void {
    this.socket = io(`ws://${address}:5556`)
    this.audio = new JlrAudioControl(this.socket)
    this.updateAppState(AppState.waitingForServer)
    this.socket.on('message', (message: SocketMostMessageRx) => {
      if (message.opType === 0x0f) {
        try {
          this.win?.webContents.send('error', this.errorParser.parseError(message))
        } catch {
          this.win?.webContents.send('error', 'undefined error' + JSON.stringify(message))
        }
      } else {
        //Parse used functions to relevant data
        switch (message.fktID) {
          case 2561:
            console.log('reg update')
            this.parser.parseMessage(message, message.fktID)
            break
          case 0:
            message.fBlockID > 1 ? this.parser.parseMessage(message, message.fktID) : null
        }
        const messageOut: IoMostRx = { ...message, data: [...message.data] }
        this.win?.webContents.send('newMessage', messageOut)
      }
    })
    this.socket.on('allocResults', (data: AllocResult) => {
      console.log('alloc results', data)
    })
    this.socket.on('disconnect', () => {
      this.updateAppState(AppState.waitingForServer)
    })
    this.socket.on('connect', () => {
      this.updateAppState(AppState.connectingToSocket)
    })
    this.socket.on('connect_error', (err) => {
      console.log(`Socket.io error: ${err.message}`)
      this.socket!.close()
      setTimeout(() => {
        this.socket!.connect()
      }, 1000)
    })
  }

  updateAppState(value: number): void {
    console.log('App State', AppState[value], value)
    this.appState = value
    this.win?.webContents.send('appStatus', value)
  }

  getRegistry(): void {
    this.socket?.emit('requestRegistry')
  }

  sendControlMessage(data: SocketMostSendMessage): void {
    this.socket?.emit('sendControlMessage', data)
  }

  getSource(connectionLabel = 0): void {
    this.socket?.emit('getSource', { connectionLabel })
  }

  allocate(): void {
    this.socket?.emit('allocate')
  }

  stream(data: Stream): void {
    console.log('streaming')
    this.socket?.emit('stream', data)
  }

  retrieveAudio(data: RetrieveAudio): void {
    console.log('retrieving audio')
    this.socket?.emit('retrieveAudio', data)
  }

  connectSource(data: Source): void {
    console.log('connecting source', data)
    this.socket?.emit(SocketTypes.ConnectSource, data)
  }

  disconnectSource(data: Source): void {
    this.socket?.emit('disconnectSource', data)
  }

  switchSource(message: SourceRecord): void {
    this.audio!.switchSource(message)
  }
}
