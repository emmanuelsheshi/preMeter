const accountSid = 'ACe6b7143e781d62a6698180f55e374b4b'
const authToken = '1b07db6b8707e9db4b0ba3eca2243832'
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
