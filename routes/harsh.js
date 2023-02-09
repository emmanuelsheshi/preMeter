var express = require('express')
var router = express.Router()
// var harshGen = require('../controllers/harshGeneration')
// var unHarsh = require('../controllers/harshDecription')
// var sendMsg = require('../controllers/sendingSms')
// var sendFx = require('../controllers/sendToThingsSpeak')

//harshgen
var aesjs = require('aes-js')

//thingspeak client
var ThingSpeakClient = require('thingspeakclient')
var thingClient = new ThingSpeakClient({ updateTimeout: 20000 })
const channelId = 2021286
thingClient.attachChannel(channelId, {
  writeKey: 'R8OEY6N3F53WWTYC',
  readKey: '0FI59AL4T0A4XF84',
})

function updateChannel(units) {
  thingClient.updateChannel(channelId, { field1: units })
}

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

// client.on('tokenAboutToExpire', function () {
//   // Implement fetchToken() to make a secure request to your backend to retrieve a refreshed access token.
//   // Use an authentication mechanism to prevent token exposure to 3rd parties.
//   fetchToken(function (updatedToken) {
//     client.updateToken(updatedToken)
//   })
// })

function sendMsg(id, units, time) {
  client.messages
    .create({
      body: `id:${id},units:${units},${time}`,
      from: '+18158804130',
      to: '+2349063699411',
    })
    .then((message) => console.log('message sent'))
    .catch((err) => console.log('message not sent beacuse of', err))
}

const url = require('url')
const path = require('path')
const { time } = require('console')

/* GET home page. */
router.use('/', function (req, res, next) {
  //send things speak
  // async function sendFx(purchasedUnits) {
  //   const rechargeTime = new Date()
  //   let randomGen = Math.random(0, 1)
  //   let randValue = parseFloat(purchasedUnits)
  //   let ans = randValue + randomGen
  //   console.log(randValue, purchasedUnits, randomGen)
  //   console.log(typeof randomGen, ' -- ', ans)
  //   let response = await fetch(
  //     `https://api.thingspeak.com/update?api_key=R8OEY6N3F53WWTYC&field1=${randValue}&field2=${rechargeTime.toISOString()}`,
  //   )
  //   try {
  //     let data = await response.text()
  //     console.log(data)
  //   } catch (err) {
  //     console.log('an error occurred while sending to things speeak', err)
  //   }
  // }

  const { query, pathName } = url.parse(req.url, true)
  const meterId = query.meterId
  const currentAmount = query.priceId

  // price per unit  determined here:::::
  const units = ((currentAmount + 120) / 80 / 1000).toFixed(1)

  var result = harshGen(meterId, currentAmount)
  var result2 = unHarsh(result)
  const timeElapsed = Date.now()
  const today = new Date(timeElapsed)

  // let rechargeMessgae =

  console.log('sent message - ')
  //send harsh to phone number here
  // sendMsg(meterId, amount, today.toUTCString())
  // sendFx(units)
  updateChannel(units)

  console.log(result2)
  console.log('sucessfull purchase')
  // res.send(`sucessfull purchase ${result2} and ${currentAmount}`)
  res.redirect('/energyMonitor')
})

module.exports = router
