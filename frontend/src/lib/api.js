const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export function getTokens() {
  try { return JSON.parse(localStorage.getItem('cf_tokens')) } catch { return null }
}
export function setTokens(t) { localStorage.setItem('cf_tokens', JSON.stringify(t)) }
export function clearTokens() { localStorage.removeItem('cf_tokens') }

async function refreshAccess() {
  const tokens = getTokens()
  if (!tokens?.refresh) throw new Error('no refresh token')
  const res = await fetch(`${BASE}/users/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: tokens.refresh }),
  })
  if (!res.ok) { clearTokens(); throw new Error('session expired') }
  const data = await res.json()
  setTokens({ ...tokens, access: data.access })
  return data.access
}

async function req(path, opts = {}) {
  const tokens = getTokens()
  const isFormData = opts.body instanceof FormData
  const headers = { ...opts.headers }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (tokens?.access) headers['Authorization'] = `Bearer ${tokens.access}`

  let res = await fetch(`${BASE}${path}`, { ...opts, headers })

  if (res.status === 401 && tokens?.refresh) {
    try {
      const newAccess = await refreshAccess()
      headers['Authorization'] = `Bearer ${newAccess}`
      res = await fetch(`${BASE}${path}`, { ...opts, headers })
    } catch {
      clearTokens()
      window.location.href = '/admin/login'
    }
  }
  return res
}

function withQuery(path, params) {
  if (!params) return path
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value)
  })
  const query = qs.toString()
  return query ? `${path}?${query}` : path
}

export const api = {
  getDashboard:  ()           => req('/dashboard/'),
  sendContactMessage: (data)  => fetch(`${BASE}/contact/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  login:         (u, p)       => fetch(`${BASE}/users/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) }),
  logout:        (refresh)    => req('/users/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  profile:       ()           => req('/users/profile/'),

  getProducts:   (params)     => req(withQuery('/products/', params)),
  getProduct:    (id)         => req(`/products/${id}/`),
  createProduct: (fd)         => req('/products/', { method: 'POST', body: fd }),
  updateProduct: (id, fd)     => req(`/products/${id}/`, { method: 'PATCH', body: fd }),
  deleteProduct: (id)         => req(`/products/${id}/`, { method: 'DELETE' }),

  addProductImages:  (id, fd)         => req(`/products/${id}/images/`, { method: 'POST', body: fd }),
  deleteProductImage:(id, imageId)    => req(`/products/${id}/images/${imageId}/`, { method: 'DELETE' }),
  setPrimaryImage:   (id, imageId)    => req(`/products/${id}/images/${imageId}/`, { method: 'PATCH' }),

  getCategories:    ()           => req('/products/categories/'),
  createCategory:   (data)       => req('/products/categories/', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory:   (id, data)   => req(`/products/categories/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCategory:   (id)         => req(`/products/categories/${id}/`, { method: 'DELETE' }),

  getStaff:      ()                => req('/users/staff/'),
  updateStaff:   (id, data)        => req(`/users/staff/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStaff:   (id)              => req(`/users/staff/${id}/`, { method: 'DELETE' }),

  getInvites:    ()                => req('/users/invite/'),
  sendInvite:    (email, role)     => req('/users/invite/', { method: 'POST', body: JSON.stringify({ email, role }) }),
  revokeInvite:  (id)              => req(`/users/invite/${id}/`, { method: 'DELETE' }),

  acceptInvite:  (token, username, password) => fetch(`${BASE}/users/invite/accept/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, username, password }) }),
  forgotPassword: (email)     => fetch(`${BASE}/users/password-reset/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }),
  resetPassword:  (token, password) => fetch(`${BASE}/users/password-reset/confirm/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) }),
}
