console.log('connected')
const form = document.querySelector('.form')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const meterId = document.querySelector('.in_meterId').value
  const amount = document.querySelector('.in_amount').value
  const phoneNumber = document.querySelector('.in_phone').value

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
