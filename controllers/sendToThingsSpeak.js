async function sendFx(purchasedUnits) {
  let response = await fetch(
    `https://api.thingspeak.com/update?api_key=R8OEY6N3F53WWTYC&field1=${purchasedUnits}`,
  )
  try {
    let data = await response.text()
    console.log(data)
  } catch (err) {
    console.log('an error occurred while sending to things speeak', err)
  }
}

module.exports = sendFx
