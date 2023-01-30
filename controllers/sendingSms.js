const accountSid = 'ACe6b7143e781d62a6698180f55e374b4b'
const authToken = 'c9d76ddbc324a032a504b9d83d4a6845'
const client = require('twilio')(accountSid, authToken)

function sendMsg(message) {
  client.messages
    .create({
      body: `token:${message}:`,
      from: '+18158804130',
      to: '+2349063699411',
    })
    .then((message) => console.log('message sent'))
}

module.exports = sendMsg
