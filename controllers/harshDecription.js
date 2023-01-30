var aesjs = require('aes-js')

function harshDyc(encryptedHex) {
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
module.exports = harshDyc
