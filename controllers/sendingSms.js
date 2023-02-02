const accountSid = 'ACe6b7143e781d62a6698180f55e374b4b'
const authToken = '3b2576209c749378e937d547c6138204'
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

module.exports = sendMsg
