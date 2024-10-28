'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()

    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    if (!response.ok) {
      return alert('Invalid Username or Password')
    }

    const user = await response.json()
    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 'admin') {
      router.push('/admin-dashboard')
    } else if (user.role === 'customer') {
      router.push('/')
    }
  }

  return (
    <div className='w-96 mx-auto py-32'>
      <h1 className='text-4xl text-center'>Login</h1>

      <form
        className='space-y-4 mt-8'
        onSubmit={(e) => handleLogin(e)}
      >
        <div>
          <p className='font-bold'>Username</p>

          <input
            className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            type='text'
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <p className='font-bold'>Password</p>

          <input
            className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            className='w-full px-4 py-2 text-white bg-blue-500 uppercase rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Login
          </button>

          <p className='text-center mt-4'>
            <span>Don't have an account? </span>
            <a className='text-blue-500 underline' href='/register'>
              <span>Register</span>
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
