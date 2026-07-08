import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { ProductContext } from './productContextValue'

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ page_size: 100 }),
        api.getCategories(),
      ])
      if (!prodRes.ok) throw new Error('Failed to load products')
      if (!catRes.ok) throw new Error('Failed to load categories')

      const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()])
      setProducts(prodData.products || [])
      setCategories(['All', ...(catData.categories || []).map(c => c.name)])
    } catch (err) {
      setError(err.message || 'Failed to load catalogue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(refreshProducts, 0)
    return () => clearTimeout(id)
  }, [refreshProducts])

  const value = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    refreshProducts,
  }), [products, categories, loading, error, refreshProducts])

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
