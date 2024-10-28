'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Meow() {
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [productToAddCart, setProductToAddCart] = useState()
  const [isAddToCartModalOpen, openAddToCartModal] = useState(false)
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
        return alert('Something went wrong while fetching products')
      }

      const categoriesResponse = await fetch('http://localhost:8080/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!categoriesResponse.ok) {
        return alert('Something went wrong while fetching categories')
      }

      const user = JSON.parse(storageUser)
      if (user.role !== 'customer') {
        alert('You are logged in as admin, Please login as customer first.')
        return logout()
      }

      const productsResult = (await productsResponse.json()).filter(v => v.categories.some(x => x.name !== 'woof'))
      const categoriesResult = (await categoriesResponse.json()).filter(v => (v.name !== 'meow' && v.name !== 'woof'))

      setUser(user)
      setProducts(productsResult)
      setCategories(categoriesResult)
    })()
  }, [])

  async function addToCart(product, quantity) {
    const cartsResponse = await fetch(`http://localhost:8080/api/carts/user/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!cartsResponse.ok) {
      return alert('Something went wrong while fetching carts')
    }

    const currentCart = await cartsResponse.json()
    if (currentCart.cartItems.some(v => v.product.id === product.id)) {
      openAddToCartModal(false)
      return alert('You already have this on your cart')
    }

    const addToCartResponse = await fetch(`http://localhost:8080/api/carts/user/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product,
        quantity
      })
    })

    if (!addToCartResponse.ok) {
      return alert('Something went wrong while adding to cart')
    }

    openAddToCartModal(false)
  }

  function logout() {
    localStorage.removeItem('user')
    setUser({})

    router.push('/login')
  }

  return (
    <>
      {isAddToCartModalOpen &&
        <AddToCartModal
          product={productToAddCart}
          onAddToCart={(product, quantity) => addToCart(product, quantity)}
          onCancel={() => openAddToCartModal(false)}
        />
      }

      <header className='p-4 bg-blue-500 text-white flex justify-between'>
        <div>
          <a href='/' className='text-2xl font-bold'>Pet And Pals - Meow</a>
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

      <div className='flex p-8 gap-12'>
        <div>
          <h1 className='text-xl font-bold'>By Category</h1>

          <ul className='list-none mt-8'>
            {categories.map(category => (
              <li key={category.id} className='flex items-center gap-2'>
                <input type='checkbox' />
                <p>{category.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className='text-3xl font-bold'>Cat Products</h1>
          {products.length <= 0 && (
            <p className='text-center mt-4'>There is no cat products added yet.</p>
          )}

          <div className='mt-4 grid grid-cols-4 gap-4'>
            {products.map(product => (
              <div
                key={product.id}
                className='p-4 font-semibold bg-gray-100 rounded-lg focus:outline-none transition-colors shadow-lg space-y-4'
              >
                <div>
                  <img
                    src={product.image}
                    className='w-full'
                  />
                </div>

                <div>
                  <h1 className='font-semibold text-md'>{product.name}</h1>
                  <p className='font-light text-sm truncate'>- {product.description}</p>

                  <div className='flex justify-between items-center mt-6'>
                    <p className='font-bold text-xl text-red-500'>₱ {product.price}</p>
                    <p className='font-light text-sm text-gray-500'>x{product.stockQuantity}</p>
                  </div>

                  <div className='flex justify-between items-center gap-4 mt-4'>
                    <button
                      className='bg-green-500 hover:bg-green-600 uppercase w-full px-4 py-1 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                      onClick={() => {
                        setProductToAddCart(product)
                        openAddToCartModal(true)}
                      }
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function AddToCartModal({ product, onAddToCart, onCancel }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 '>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold'>Add To Cart</h2>

        <div className='p-4 font-semibold bg-gray-100 rounded-lg focus:outline-none transition-colors shadow-lg space-y-4 mt-4'>
          <div>
            <img
              src={product.image}
              className='w-full'
            />
          </div>

          <div>
            <h1 className='font-semibold text-md'>{product.name}</h1>
            <p className='font-light text-sm truncate'>- {product.description}</p>

            <div className='flex justify-between items-center mt-6'>
              <p className='font-bold text-xl text-red-500'>₱ {product.price}</p>
              <p className='font-light text-sm text-gray-500'>x{product.stockQuantity}</p>
            </div>

            <div className='flex justify-between my-4'>
              <div>
                <p className='font-bold'>Quantity: x{quantity}</p>
              </div>

              <div className='space-x-4'>
                <button
                  className='bg-gray-300 hover:bg-gray-400 uppercase px-4 py-1 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  onClick={() => setQuantity(quantity > 1 ? (quantity - 1) : (quantity))}
                >
                  -
                </button>

                <button
                  className='bg-gray-300 hover:bg-gray-400 uppercase px-4 py-1 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  onClick={() => setQuantity(quantity < product.stockQuantity ? (quantity + 1) : (quantity))}
                >
                  +
                </button>
              </div>
            </div>

            <div className='flex justify-between items-center gap-4 mt-4'>
              <button
                className='bg-red-500 hover:bg-red-600 uppercase w-full px-4 py-1 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                onClick={() => onCancel()}
              >
                Cancel
              </button>

              <button
                className='bg-green-500 hover:bg-green-600 uppercase w-full px-4 py-1 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                onClick={() => onAddToCart(product, quantity)}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
