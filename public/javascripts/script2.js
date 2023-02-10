const powerPlacer = document.querySelector('.power')
const voltagePlacer = document.querySelector('.voltage')
const currentPlacer = document.querySelector('.current')
const unitPlacer = document.querySelector('.availableUnits')
const controlbtn = document.querySelector('.control')

const cart = document.querySelector('.cart')
const tooltip = document.querySelector('.label')

cart.addEventListener('mouseover', () => {
  tooltip.style.visibility = 'visible'
})
cart.addEventListener('mouseout', () => {
  tooltip.style.visibility = 'hidden'
})

async function sendControl(controlVal) {
  let response = await fetch(
    `https://api.thingspeak.com/update?api_key=R8OEY6N3F53WWTYC&field4=${controlVal}`,
  )
  try {
    let data = await response.text()
    console.log(data)
  } catch (err) {
    console.log('an error occurred while sending to things speeak', err)
  }
}

let energyParams = async () => {
  let url =
    'https://api.thingspeak.com/channels/2021286/fields/3.json?api_key=0FI59AL4T0A4XF84&results=1'

  let res = await fetch(url)

  let data = await res.json()

  let values = await data.feeds[0].field3

  let results = values.split(',')

  return results
}
let power,
  voltage,
  current_,
  powerFactor,
  unitsNow = 0

setInterval(() => {
  energyParams()
    .then((results) => {
      console.log(results, 'i can use this \n')
      power = results[0]
      voltage = results[1]
      current_ = results[2]
      powerFactor = results[3]
      unitsNow = results[4]

      powerPlacer.textContent = power
      currentPlacer.textContent = current_
      voltagePlacer.textContent = voltage
      unitPlacer.textContent = unitsNow + ' uts'
    })
    .catch((error) => {
      console.log('wahalla, could not get values')
    })
}, 5000)

let btn = document.querySelector('.control')
let btnStates = 2
let btnState = 0

btn.addEventListener('click', () => {
  btnState += 1
  if (btnState >= btnStates) {
    btnState = 0
  }
  if (btnState == 0) {
    //do something
    // write control channel on
    btn.textContent = 'on'
    sendControl('1')
  }
  if (btnState == 1) {
    //do something
    // write control channel off
    btn.textContent = 'off'
    sendControl('0')
    // updateChannel('2')
  }
})
