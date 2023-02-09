const bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  res.render('energyMonitor')
})

module.exports = router
