'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [addedToCart, setAddedToCart] = useState()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const storageUser = localStorage.getItem('user')
      if (!storageUser) {
        alert('Please login first')
        return router.push('/login')
      }

      const productsResponse = await fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!productsResponse.ok) {
        return alert('Something went wrong')
      }

      const user = JSON.parse(storageUser)
      if (user.role !== 'customer') {
        alert('You are logged in as admin, Please login as customer first.')
        return logout()
      }

      setUser(user)
      setProducts(await productsResponse.json())
    })()
  }, [])

  function logout() {
    localStorage.removeItem('user')
    setUser({})

    router.push('/login')
  }

  return (
    <>
      <header className='p-4 bg-blue-500 text-white flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Pet And Pals</h1>
        </div>

        <div className='flex justify-center items-center gap-8'>
          <a
            href='/cart'
            className='flex items-center gap-2'
          >
            <i className="fa-solid fa-cart-shopping"></i>
            Cart
          </a>

          <a
            href='/cart'
            className='flex items-center gap-2'
          >
            <i className="fa-solid fa-truck"></i>
            Orders
          </a>

          <button
            className='w-full px-4 py-1 text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            onClick={() => logout()}
          >
            <i className='fa-solid fa-right-from-bracket'></i>
          </button>
        </div>
      </header>

      <div className='px-32 py-12'>
        <h1 className='text-3xl font-extrabold text-blue-500 uppercase'>Shop For</h1>

        <div className='grid grid-cols-2 gap-8 mt-8'>
          <a href='/products/meow' className='shadow-lg bg-gray-100'>
            <div>
              <img className='w-full' src='/assets/meow.png' />
            </div>

            <div className='p-8 text-center'>
              <h1 className='text-xl font-bold'>Meow</h1>
            </div>
          </a>

          <a href='/products/woof' className='shadow-lg bg-gray-100'>
            <div>
              <img className='w-full h-full' src='/assets/woof.png' />
            </div>

            <div className='p-8 text-center'>
              <h1 className='text-xl font-bold'>Woof</h1>
            </div>
          </a>
        </div>
      </div>
    </>
  )
}
