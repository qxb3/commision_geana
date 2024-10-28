import { useEffect, useState } from 'react'

export default function ProductsManager() {
  const [isNewProductOpen, openNewProductModal] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [isEditProductOpen, openEditProductModal] = useState(false)
  const [selectedEditProduct, setSelectedEditProduct] = useState()

  useEffect(() => {
    (async () => {
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

      setProducts(await productsResponse.json())
      setCategories(await categoriesResponse.json())
    })()
  }, [])

  async function addNewProduct(product) {
    const newProductResponse = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })

    const newProduct = await newProductResponse.json()

    if (!newProductResponse.ok) {
      if (newProduct.error === 'Conflict') {
        return alert(`There is already a product named ${product.name}`)
      }

      return alert('Something went wrong while adding product')
    }

    setProducts([...products, newProduct])
    openNewProductModal(false)
  }

  async function editProduct(product) {
    console.log(product)
    const editProductResponse = await fetch(`http://localhost:8080/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })

    if (!editProductResponse.ok) {
      return alert('Something went wrong while editing a product')
    }

    const editedProduct = await editProductResponse.json()
    setProducts(products.map(v => {
      if (v.id === product.id) v = editedProduct
      return v
    }))
    openEditProductModal(false)
  }

  async function deleteProduct(id) {
    const deleteProductResponse = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!deleteProductResponse.ok) {
      return alert('Something went wrong while deleting a product')
    }

    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <>
      {isNewProductOpen &&
        <NewProductModal
          categories={categories}
          onSubmit={(product) => addNewProduct(product)}
          onClose={() => openNewProductModal(false)}
        />
      }

      {isEditProductOpen &&
        <EditProductModal
          categories={categories}
          product={selectedEditProduct}
          onSubmit={(product) => editProduct(product)}
          onClose={() => openEditProductModal(false)}
        />
      }

      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Products</h1>

        <button
          className='px-4 py-1 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          onClick={() => openNewProductModal(true)}
        >
          +
        </button>
      </div>

      <div className='mt-4 grid grid-cols-4 gap-4'>
        {products.map(product => (
          <div
            key={product.id}
            className='p-4 font-semibold rounded-lg focus:outline-none transition-colors bg-white shadow space-y-4'
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
              <div className='text-sm text-white flex items-center gap-2 mt-2'>
                {product.categories.map(category => (
                  <div key={category.id} className='bg-blue-500 rounded-lg px-2'>
                    {category.name}
                  </div>
                ))}
              </div>

              <div className='flex justify-between items-center mt-6'>
                <p className='font-bold text-xl text-red-500'>₱ {product.price}</p>
                <p className='font-light text-sm text-gray-500'>x{product.stockQuantity}</p>
              </div>

              <div className='flex justify-between items-center gap-4 mt-4'>
                <button
                  className='uppercase w-full px-4 py-1 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  onClick={() => {
                    setSelectedEditProduct(product)
                    openEditProductModal(true)
                  }}
                >
                  Edit
                </button>

                <button
                  className='uppercase w-full px-4 py-1 text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function EditProductModal({ categories, product, onSubmit, onClose }) {
  const [name, setProductName] = useState(product.name)
  const [description, setProductDescription] = useState(product.description)
  const [price, setProductPrice] = useState(product.price)
  const [stockQuantity, setProductStock] = useState(product.stockQuantity)
  const [currentCategory, setCurrentCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(product.categories)
  const [image, setProductImage] = useState(product.image)

  function addSelectedCategories() {
    if (currentCategory.length <= 0) {
      return alert('Please select a category')
    }

    if (selectedCategories.find(category => category.id === currentCategory)) {
      return alert('You already added this category')
    }

    const category = categories.find(category => category.id === currentCategory)

    setSelectedCategories([...selectedCategories, category])
  }

  function removeSelectedCategories() {
    if (currentCategory.length <= 0) {
      return alert('Please select a category')
    }

    setSelectedCategories(selectedCategories.filter(category => category.id !== currentCategory))
  }

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold'>Edit {product.name}</h2>

        <form
          className='mt-8 space-y-4'
          onSubmit={(e) => {
            e.preventDefault()

            if (selectedCategories.length <= 0) {
              return alert('Please add a category')
            }

            onSubmit({
              id: product.id,
              name,
              description,
              price,
              stockQuantity,
              categories: selectedCategories.map(category => ({ id: category.id })),
              image
            })
          }}
        >
          <div>
            <p className='font-bold'>Name</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='Product Name'
              required
              value={name}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Description</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='Product Description'
              required
              value={description}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Price</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='number'
              placeholder='99.9'
              step={0.1}
              required
              value={price}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Stock</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='number'
              placeholder='99'
              step={1}
              required
              value={stockQuantity}
              onChange={(e) => setProductStock(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <p className='font-bold'>Categories</p>

              <div className='space-x-2'>
                <select
                  id='options'
                  className='p-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:border-blue-500 focus:ring-blue-500 text-sm'
                  onChange={(e) => setCurrentCategory(e.target.value)}
                >
                  <option value=''>Select</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <button
                  className='px-4 py-1 text-sm text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  type='button'
                  onClick={() => addSelectedCategories()}
                >
                  +
                </button>

                <button
                  className='px-4 py-1 text-sm text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  type='button'
                  onClick={() => removeSelectedCategories()}
                >
                  -
                </button>
              </div>
            </div>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='category1, category2'
              required
              readOnly
              disabled
              value={
                selectedCategories.map(category => category.name)
                  .join(', ')
              }
            />
          </div>

          <div>
            <p className='font-bold'>Image</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='/products/filename.(png/jpg)'
              required
              value={image}
              onChange={(e) => setProductImage(e.target.value)}
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

function NewProductModal({ categories, onSubmit, onClose }) {
  const [name, setProductName] = useState('')
  const [description, setProductDescription] = useState('')
  const [price, setProductPrice] = useState(0)
  const [stockQuantity, setProductStock] = useState(0)
  const [currentCategory, setCurrentCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [image, setProductImage] = useState('/products/default.png')

  function addSelectedCategories() {
    if (currentCategory.length <= 0) {
      return alert('Please select a category')
    }

    if (selectedCategories.find(category => category.id === currentCategory)) {
      return alert('You already added this category')
    }

    const category = categories.find(category => category.id === currentCategory)
    setSelectedCategories([...selectedCategories, category])
  }

  function removeSelectedCategories() {
    if (currentCategory.length <= 0) {
      return alert('Please select a category')
    }

    setSelectedCategories(selectedCategories.filter(category => category.id !== currentCategory))
  }

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 '>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold'>New Product</h2>

        <form
          className='mt-8 space-y-4'
          onSubmit={(e) => {
            e.preventDefault()

            if (selectedCategories.length <= 0) {
              return alert('Please add a category')
            }

            onSubmit({
              name,
              description,
              price,
              stockQuantity,
              categories: selectedCategories.map(category => ({ id: category.id })),
              image
            })
          }}
        >
          <div>
            <p className='font-bold'>Name</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='Product Name'
              required
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Description</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='Product Description'
              required
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Price</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='number'
              placeholder='99.9'
              step={0.1}
              required
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>

          <div>
            <p className='font-bold'>Stock</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='number'
              placeholder='99'
              step={1}
              required
              onChange={(e) => setProductStock(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <p className='font-bold'>Categories</p>

              <div className='space-x-2'>
                <select
                  id='options'
                  className='p-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:border-blue-500 focus:ring-blue-500 text-sm'
                  onChange={(e) => setCurrentCategory(e.target.value)}
                >
                  <option value=''>Select</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <button
                  className='px-4 py-1 text-sm text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  type='button'
                  onClick={() => addSelectedCategories()}
                >
                  +
                </button>

                <button
                  className='px-4 py-1 text-sm text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  type='button'
                  onClick={() => removeSelectedCategories()}
                >
                  -
                </button>
              </div>
            </div>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='category1, category2'
              required
              readOnly
              disabled
              value={
                selectedCategories.map(category => category.name)
                  .join(', ')
              }
            />
          </div>

          <div>
            <p className='font-bold'>Image</p>

            <input
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type='text'
              placeholder='/products/filename.(png/jpg)'
              required
              onChange={(e) => setProductImage(e.target.value)}
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
