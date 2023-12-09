'use client'

import {useRouter} from 'next/navigation'
import React from 'react'

const Register = () => {
  const router = useRouter()

  async function onSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    })
    console.log(res)
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <div>email</div>
          <input type="email" name="email" className="bg-white text-black" />
        </div>
        <div>
          <div>password</div>
          <input type="password" name="password" className="bg-white text-black" />
        <div>
          <div>password_confirm</div>
          <input type="password" name="password2" className="bg-white text-black" />
        </div>
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register
