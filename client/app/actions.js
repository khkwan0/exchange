'use server'
import {cookies} from 'next/headers'

export async function handleLogin(data) {
  const email = data.get('email')
  const password = data.get('password')
  const res = await fetch('https://chuckwow.fun/api/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })
  })
  const json = await res.json()

  if (typeof json.status !== 'undefined' && json.status === 'ok') {
    cookies().set({
      name: 'session',
      value: json.data.token,
      httpOnly: true,
      secure: true,
      path: '/',
    })
  }
  return json
}

export async function handleOrder(data) {
  const action = data.get('market_action')
  const type = data.get('type')
  const amount = data.get('amount')
  const price = data.get('price')
  const market = data.get('market')
  const sessionCookie = cookies().get('session').value
  const res = await fetch('https://chuckwow.fun/api/order', {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionCookie}`,
    },
    body: JSON.stringify({
      action,
      type,
      amount,
      price,
      market,
    })
  })
  const json = await res.json()
  return json
}
