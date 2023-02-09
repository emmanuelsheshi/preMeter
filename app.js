var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var purchaseRouter = require('./routes/purchase')
var harshRouter = require('./routes/harsh')
var energyMonitorRouter = require('./routes/energyMonitor')

var bodyParser = require('body-parser')

var app = express()

const dotenv = require('dotenv')
dotenv.config()

const stripe = require('stripe')(
  'sk_test_51MV1RaArfjBctNtXLlJqdma9eXpEiIFmyJU5PvEQHW3DX8uHc1x0eZGupJH3Cb0KFRFvwNyaUlPJ7SUXkIDS4ltK000j9U5x6I',
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use('/purchase', purchaseRouter)

app.use('/energyMonitor', energyMonitorRouter)

app.post('/create-checkout-session2', async (req, res, next) => {
  const service_charge = 120
  const purchaseInfo = {
    id: req.body.items.id,
    amount: req.body.items.quantity,
    meterId: req.body.items.meter,
  }
  const newAmout = parseInt(purchaseInfo.amount) + service_charge

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `amount with a $${service_charge} service charge`,
            },
            unit_amount: newAmout * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.API_URL}/harsh?meterId=${purchaseInfo.meterId}&priceId=${purchaseInfo.amount}`,

      cancel_url: `${process.env.API_URL}/cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  } finally {
  }
})

app.use('/webhooks', (req, res, next) => {
  const event = req.body

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment intent succeded')

      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }
})

app.use('/harsh', harshRouter)

app.use('/success', (req, res) => {
  res.render('success')
})

app.use('/cancel', (req, res) => {
  res.render('cancel')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
