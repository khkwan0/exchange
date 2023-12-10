import Link from 'next/link'
import {handleLogin} from '../actions.js'
import {redirect} from 'next/navigation'
import {Input} from '@/components/ui/input'

export default function Login() {
  async function onSubmit(formData) {
    'use server'
    const res = await handleLogin(formData)
    if (res.status === 'ok') {
      redirect('/dashboard')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form action={onSubmit}>
        <div>
          <div>email</div>
          <Input type="email" name="email" />
        </div>
        <div>
          <div>password</div>
          <Input type="password" name="password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <div>
        <Link href="/register">Register</Link>
      </div>
    </div>
  )
}
