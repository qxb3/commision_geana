'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import ProductsManager from './ProductsManager.js'
import CategoriesManager from './CategoriesManager.js'

export default function Admin() {
  const [user, setUser] = useState()
  const [activeTab, setActiveTab] = useState('products')
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const storageUser = localStorage.getItem('user')
      if (!storageUser) {
        alert('Please login first')
        return router.push('/login')
      }

      const user = JSON.parse(storageUser)
      if (user.role === 'customer') {
        alert('Access denied')
        return logout()
      }
    })()
  }, [])

  function logout() {
    localStorage.removeItem('user')
    setUser()

    router.push('/login')
  }

  return (
    <>
      <header className='p-4 bg-blue-500 text-white flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Pet And Pals - Admin</h1>
        </div>

        <div>
          <button
            className='w-full px-3 py-1 text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            onClick={() => logout()}
          >
            <i className='fa-solid fa-right-from-bracket'></i>
          </button>
        </div>
      </header>

      <div className='flex flex-col items-center mt-4 px-4'>
        <div className='bg-gray-100 rounded-lg p-1 flex space-x-2'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 font-semibold rounded-lg focus:outline-none transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-blue-500 shadow'
                : 'hover:bg-white'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-4 font-semibold rounded-lg focus:outline-none transition-colors ${
              activeTab === 'categories'
                ? 'bg-white text-blue-500 shadow'
                : 'hover:bg-white'
            }`}
          >
            Categories
          </button>
        </div>

        <div className='mt-6 p-4 bg-gray-50 rounded-lg shadow w-full'>
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
        </div>
      </div>
    </>
  )
}
