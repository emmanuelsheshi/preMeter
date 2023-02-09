console.log('connected')
const form = document.querySelector('.form')
const submit_button = document.querySelector('.submit')

//values

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const meterId = document.querySelector('.in_meterId').value
  const amount = document.querySelector('.in_amount').value
  const phoneNumber = document.querySelector('.in_phone').value

  console.log(amount)

  fetch('/create-checkout-session2', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      items: { id: 1, quantity: amount, meter: meterId },
    }),
  })
    .then((res) => {
      if (res.ok) return res.json()
      return res.json().then((json) => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
      console.log(url)
    })
    .catch((e) => {
      console.error(e.error)
    })
})

// some resposes
const smartConponentVal = document.querySelector('.units')
const amountInput = document.querySelector('.in_amount')
const error = document.querySelector('.error')

amountInput.addEventListener('input', (event) => {
  let updateVal = event.target.value
  let conveterdUnits = updateVal / 80

  if (updateVal < 600) {
    submit_button.disabled = true
    // event.target.style.borderColor = '#c90303'
    error.textContent = 'too small'
  } else {
    submit_button.disabled = false

    // event.target.style.borderColor = 'no-border'
    error.textContent = ''
  }

  // console.log(updateVal, 'heeleoe')

  smartConponentVal.textContent = conveterdUnits.toFixed(1)
})
