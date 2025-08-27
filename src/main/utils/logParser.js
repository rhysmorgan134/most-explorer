const fs = require('fs')

let data = fs.readFileSync('./dump.log')
let json = JSON.parse(data)
let outArray = []

let masterArray = []
json.forEach((data) => {
  let msgData = data.data
  // data.data.forEach((d) => {
  //   msgData.push(parseInt(d))
  // })

  if (data.opType === '0xc') {
    console.log('found status')
    if (msgData[2] === '0x0') {
      console.log('new message found')
      if (masterArray.length > 0) {
        let header = masterArray.slice(0, 18)
        let datat = masterArray.slice(18, masterArray.length)
        let charData = []
        datat.forEach((t) => {
          charData.push(parseInt(t))
        })
        console.log(charData)
        charData = Buffer.from(charData)

        outArray.push({ header, text: charData.toString() })
        masterArray = []
      }
      // masterArray.push(...msgData.slice(2, 11))
    }
    masterArray.push(...msgData.slice(3, data.telLen))
  }
})

outArray.forEach((d) => {
  console.log('header: ', d.header)
  console.log('text: ', d.text)
})
fs.writeFileSync('./out.json', JSON.stringify(outArray, null, 2))
// console.log(JSON.stringify(outArray))
