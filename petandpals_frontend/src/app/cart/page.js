'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Cart() {
  const [user, setUser] = useState()
  const [cart, setCart] = useState({})
  const [checkoutItems, setCheckoutItems] = useState([])
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const storageUser = localStorage.getItem('user')
      if (!storageUser) {
        alert('Please login first')
        return router.push('/login')
      }

      const user = JSON.parse(storageUser)
      if (user.role !== 'customer') {
        alert('You are logged in as admin, Please login as customer first.')
        return logout()
      }

      const cartResponse = await fetch(`http://localhost:8080/api/carts/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!cartResponse.ok) {
        return alert('Something went wrong while fetching carts')
      }

      setUser(user)
      setCart(await cartResponse.json())
    })()
  }, [])

  function addCheckoutItems(isAdd, product) {
    console.log(isAdd, product)
    if (isAdd) {
      console.log('ran')
      setCheckoutItems([...checkoutItems, product])
    } else {
      setCheckoutItems(checkoutItems.filter(v => v.id !== product.id))
    }

    console.log(checkoutItems)
  }

  function logout() {
    localStorage.removeItem('user')
    setUser({})

    router.push('/login')
  }

  return (
    <>
      <header className='p-4 bg-blue-500 text-white flex justify-between'>
        <div>
          <a href='/' className='text-2xl font-bold'>Pet And Pals - Cart</a>
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

      <div className='p-8'>
        <h1 className='text-3xl font-bold'>Carts</h1>
        {(cart.cartItems && cart.cartItems.length <= 0) && (
          <p className='text-center mt-4'>You have not added any product to your cart yet.</p>
        )}

        <div className='mt-4 grid grid-cols-4 gap-4'>
          {(cart.cartItems && cart.cartItems.length > 0) && cart.cartItems.map(cart => (
            <div
              key={cart.id}
              className='p-4 font-semibold rounded-lg focus:outline-none transition-colors bg-white shadow-xl space-y-4'
            >
              <div>
                <input
                  type='checkbox'
                  className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={(e) => addCheckoutItems(e.target.checked, cart.product)}
                />

                <img
                  src={cart.product.image}
                  className='w-full'
                />
              </div>

              <div>
                <h1 className='font-semibold text-md'>{cart.product.name}</h1>
                <p className='font-light text-sm truncate'>- {cart.product.description}</p>
                <div className='text-sm text-white flex items-center gap-2 mt-2'>
                  {cart.product.categories.map(category => (
                    <div key={category.id} className='bg-blue-500 rounded-lg px-2'>
                      {category.name}
                    </div>
                  ))}
                </div>

                <div className='flex justify-between items-center mt-6'>
                  <p className='font-bold text-xl text-red-500'>₱ {(cart.product.price * cart.quantity).toFixed(2).toLocaleString()}</p>
                  <p className='font-light text-sm text-gray-500'>x{cart.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
