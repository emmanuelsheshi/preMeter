const bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  res.render('purchase_form')
})

module.exports = router
