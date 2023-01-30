var aesjs = require('aes-js')

function harGen(meterId, amount) {
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

module.exports = harGen
