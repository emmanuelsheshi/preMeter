const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org', {
  will: {
    topic: 'dead',
    payload: 'mypayload',
    qos: 1,
    retain: true,
  },
})

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
