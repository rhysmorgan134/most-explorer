import { messages } from 'socketmost'

export class JlrMain {
  constructor() {}

  parseMessage(data: messages.MostRxMessage): void {
    switch (data.fBlockID) {
      case 0x24:
        this.parseAux(data)
        break
      case 0x22:
        this.parseAmp(data)
        break
      case 0xf0:
        this.parseGateway(data)
        break
    }
  }

  parseAux(data: messages.MostRxMessage): void {
    switch (data.fktID) {
      case 0xc80:
        if (data.opType === 0x06) {
          this.send0xc80Resp(
            0xa,
            [0x00, 0x01],
            data.fBlockID,
            data.instanceID,
            data.sourceAddrHigh,
            data.sourceAddrLow
          )
          setTimeout(() => {
            this.send0xc80Resp(
              0xd,
              [0x00, 0x01],
              data.fBlockID,
              data.instanceID,
              data.sourceAddrHigh,
              data.sourceAddrLow
            )
          })
        }
    }
  }

  parseAmp(data: messages.MostRxMessage): void {}

  parseGateway(data: messages.MostRxMessage): void {}

  send0xc80Resp(
    opType: number,
    data: number[],
    fBlockID: number,
    instanceID: number,
    targetAddressHigh: number,
    targetAddressLow: number
  ) {
    let messageOut: messages.SocketMostSendMessage = {
      data: data,
      fBlockID: fBlockID,
      fktID: 0xc80,
      instanceID: instanceID,
      opType: opType,
      targetAddressHigh: targetAddressHigh,
      targetAddressLow: targetAddressLow
    }
  }

  switchToCd() {
    let message: messages.SocketMostSendMessage = {
      data: [0x00, 0x01, 0x31, 0xa1, 0x1, 0x1, 0x31, 0x2, 0x1, 0x11],
      fBlockID: 0xf0,
      fktID: 0x405,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
  }
}
