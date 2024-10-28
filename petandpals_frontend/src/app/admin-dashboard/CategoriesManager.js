import { useEffect, useState } from 'react'

export default function CategoriesManager() {
  const [isNewCategoryOpen, openCategoryModal] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    (async () => {
      const categoriesResponse = await fetch('http://localhost:8080/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!categoriesResponse.ok) {
        return alert('Something went wrong while fetching categories')
      }

      setCategories(await categoriesResponse.json())
    })()
  }, [])

  async function addNewCategory(name) {
    if (categories.some((category) => category.name === name)) {
      return alert(`There is already a category named: ${name}`)
    }

    const newCategoryResponse = await fetch('http://localhost:8080/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    })

    if (!newCategoryResponse.ok) {
      return alert('Something went wrong while adding category')
    }

    const newCategory = await newCategoryResponse.json()
    setCategories([...categories, newCategory])
    openCategoryModal(false)
  }

  async function deleteCategory(id) {
    const deleteResponse = await fetch(`http://localhost:8080/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!deleteResponse.ok) {
      return alert('Something went wrong while deleting category')
    }

    setCategories(categories.filter(category => category.id !== id))
  }

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Categories</h1>

        <button
          className='px-4 py-1 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          onClick={() => openCategoryModal(true)}
        >
          +
        </button>
      </div>

      {isNewCategoryOpen &&
        <NewCategoryModal
          onSubmit={(name) => addNewCategory(name)}
          onClose={() => openCategoryModal(false) }
        />
      }

      <div className='mt-4 grid grid-cols-4 gap-4'>
        {categories.map(category => (
          <div
            key={category.id}
            className='p-2 px-4 rounded-lg focus:outline-none transition-colors bg-white shadow space-y-4 flex justify-between items-center'
          >
            <p className='font-normal'>{category.name}</p>

            <button
              className='h-8 text-red-500 hover:text-red-600 flex justify-center items-center'
              onClick={() => deleteCategory(category.id)}
            >
              <p className='h-8'>
                <i className='fa-solid fa-trash h-full'></i>
              </p>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

function NewCategoryModal({ onSubmit, onClose }) {
  const [name, setCategoryName] = useState('')

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold'>New Category</h2>

        <form
          className='mt-4 space-y-4'
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(name)
          }}
        >
          <div>
            <p className='font-bold'>Name</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='Category Name'
              required
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className='space-x-4'>
            <button
              onClick={() => onClose()}
              className='px-4 py-2 bg-red-500 text-white rounded-lg'
            >
              Close Modal
            </button>

            <button
              className='px-4 py-2 bg-blue-500 text-white rounded-lg'
              type='submit'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
