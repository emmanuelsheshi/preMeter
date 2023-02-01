var express = require('express')
var router = express.Router()
var harshGen = require('../controllers/harshGeneration')
var unHarsh = require('../controllers/harshDecription')
var sendMsg = require('../controllers/sendingSms')
var sendFx = require('../controllers/sendToThingsSpeak')

const url = require('url')
const path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
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
  res.redirect('/purchase')
})

module.exports = router
