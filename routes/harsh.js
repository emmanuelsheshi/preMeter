var express = require('express')
var router = express.Router()
// var harshGen = require('../controllers/harshGeneration')
// var unHarsh = require('../controllers/harshDecription')
// var sendMsg = require('../controllers/sendingSms')
// var sendFx = require('../controllers/sendToThingsSpeak')

//harshgen
var aesjs = require('aes-js')

function harshGen(meterId, amount) {
  // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
  //   var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  var key = [
    0x2b,
    0x7e,
    0x15,
    0x16,
    0x28,
    0xae,
    0xd2,
    0xa6,
    0xab,
    0xf7,
    0x15,
    0x88,
    0x09,
    0xcf,
    0x4f,
    0x3c,
  ]

  // Convert text to bytes
  var text = `${Math.random(2)},${meterId},${amount}`
  var textBytes = aesjs.utils.utf8.toBytes(text)

  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
  var encryptedBytes = aesCtr.encrypt(textBytes)

  // To print or store the binary data, you may convert it to hex
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
  //   console.log(encryptedHex)
  return encryptedHex
}

//harshdec

function unHarsh(encryptedHex) {
  // When ready to decrypt the hex string, convert it back to bytes
  //   var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  var key = [
    0x2b,
    0x7e,
    0x15,
    0x16,
    0x28,
    0xae,
    0xd2,
    0xa6,
    0xab,
    0xf7,
    0x15,
    0x88,
    0x09,
    0xcf,
    0x4f,
    0x3c,
  ]

  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
  var decryptedBytes = aesCtr.decrypt(encryptedBytes)

  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
  return decryptedText
  // "Text may be any length you wish, no padding is required."
}

// send sms
const accountSid = 'ACe6b7143e781d62a6698180f55e374b4b'
const authToken = '961982af499e01562034ba984c90326d'
const client = require('twilio')(accountSid, authToken)

function sendMsg(message) {
  client.messages
    .create({
      body: `token:${message}:`,
      from: '+18158804130',
      to: '+2349063699411',
    })
    .then((message) => console.log('message sent'))
    .catch((err) => console.log('message not send beacuse of', err))
}

//send things speak
async function sendFx(purchasedUnits) {
  let response = await fetch(
    `https://api.thingspeak.com/update?api_key=R8OEY6N3F53WWTYC&field1=${purchasedUnits}`,
  )
  try {
    let data = await response.text()
    console.log(data)
  } catch (err) {
    console.log('an error occurred while sending to things speeak', err)
  }
}

const url = require('url')
const path = require('path')

/* GET home page. */
router.use('/', function (req, res, next) {
  // console.log(req.url, '00000000000000000009999999')
  // console.log(url.parse(req.url), true)

  const { query, pathName } = url.parse(req.url, true)
  const meterId = query.meterId
  const currentAmount = query.priceId
  const units = currentAmount / 1000

  var result = harshGen(meterId, currentAmount)
  var result2 = unHarsh(result)

  console.log('Generated Harsh - ', result)
  //send harsh to phone number here
  sendMsg(result)
  sendFx(currentAmount)

  console.log(result2)
  // console.log('sucessfull purchase')
  res.send(`sucessfull purchase ${result2} and ${currentAmount}`)
  // res.redirect('/purchase')
})

module.exports = router
