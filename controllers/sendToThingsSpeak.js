async function sendFx(purchasedUnits) {
  let response = await fetch(
    `https://api.thingspeak.com/update?api_key=R8OEY6N3F53WWTYC&field1=${purchasedUnits}`,
  )

  let data = await response.text()

  console.log(data)
}

module.exports = sendFx
