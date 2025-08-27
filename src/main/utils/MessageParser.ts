import EventEmitter from 'events'
import { fBlocks } from '../../resources/Enums'
import { SocketMostMessageRx } from 'socketmost/dist/modules/Messages'
import { Registry } from '../../resources/GlobalTypes'

export class Parser extends EventEmitter {
  registry: Registry
  lastMessageSeq: number
  data: Buffer
  dataType?
  multipartLength: number
  finalData?: Buffer
  messageInProg: boolean
  constructor() {
    super()
    this.registry = {}
    this.lastMessageSeq = 0
    this.data = Buffer.alloc(65536)
    this.multipartLength = 0
    this.messageInProg = false
  }

  parseMessage(data: SocketMostMessageRx, fkt: number): void {
    console.log('parsing message', data)
    if (data.telID === 1) {
      this.registry = {}
      this.dataType = fkt
      this.messageInProg = true
      this.addChunk(data)
    } else if (data.telID === 2) {
      const newSeq = data.data.readUInt8(0)
      if (newSeq === this.lastMessageSeq + 1) {
        this.addChunk(data)
      } else {
        console.log('SEQUENCE ERROR')
      }
    } else if (data.telID === 3) {
      this.addChunk(data)
      this.finalData = this.data.subarray(0, this.multipartLength)
      this.data = Buffer.alloc(65536)
      this.lastMessageSeq = 0
      this.multipartLength = 0
      this.messageInProg = false
      switch (this.dataType) {
        case 2561:
          console.log('found registry')
          this.parseRegistry()
          break
        case 0:
          this.parseFktIDs()
          break
      }
    } else {
      this.finalData = data.data.subarray(0, data.telLen)
      this.data = Buffer.alloc(65536)
      this.dataType = fkt
      this.lastMessageSeq = 0
      this.multipartLength = 0
      this.messageInProg = false
      console.log(this.dataType)
      switch (this.dataType) {
        case 2561:
          this.parseRegistry()
          break
        case 0:
          this.parseFktIDs()
          break
      }
    }
  }

  protected addChunk({ data, telLen }: SocketMostMessageRx): void {
    this.lastMessageSeq = data.readUInt8(0)
    data.copy(this.data, this.multipartLength, 1, data.length)
    this.multipartLength += telLen - 1
  }

  protected parseRegistry(): void {
    try {
      console.log('parsing registry')
      for (let i = 0; i < this.finalData!.length; i += 4) {
        const tempFblockID = this.finalData!.readUInt8(i + 2)
        const readableName = tempFblockID in fBlocks ? fBlocks[tempFblockID] : tempFblockID
        if (!(readableName in this.registry)) {
          this.registry[readableName] = []
        }
        this.registry[readableName].push({
          address: this.finalData!.readUint16BE(i),
          instanceID: this.finalData!.readUInt8(i + 3),
          fBlockID: tempFblockID
        })
      }
      this.emit('registryComplete', this.registry)
    } catch {
      console.log('message sequence error')
    }
  }

  parseFktIDs(): void {
    console.log('parsing fkts', this.finalData)
    const functions: string[] = []
    for (let i = 0; i < this.finalData!.length - 1; i += 3) {
      functions.push((this.finalData!.readUint16BE(i) >> 4).toString(16))
      if (i + 1 < this.finalData!.length - 1) {
        functions.push((this.finalData!.readUint16BE(i + 1) & 0xfff).toString(16))
      }
    }
    if (functions[functions.length - 1] === '0') {
      functions.pop()
    }
    console.log(functions)

    const activeData: string[] = []
    let enabled = true
    for (let i = 0; i < 4096; i++) {
      if (functions.indexOf(i.toString(16)) > -1) {
        enabled = !enabled
      }
      if (enabled) {
        activeData.push(i.toString(16))
      }
    }
    this.emit('functions', activeData)
  }
}
