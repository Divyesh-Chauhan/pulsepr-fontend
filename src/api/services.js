import api from './axios'

// ============ AUTH ============
export const registerUser = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login', data)

// ============ PRODUCTS ============
export const getAllProducts = () => api.get('/api/products')
export const getProductById = (id) => api.get(`/api/products/${id}`)
export const searchProducts = (query) => api.get(`/api/products/search?q=${query}`)
export const getProductsByCategory = (category) => api.get(`/api/products/category/${category}`)

// ============ CART ============
export const getCart = () => api.get('/api/cart')
export const addToCart = (data) => api.post('/api/cart', data)
export const updateCartItem = (data) => api.put('/api/cart', data)
export const removeCartItem = (itemId) => api.delete(`/api/cart/${itemId}`)

// ============ PAYMENT ============
export const createOrder = (data) => api.post('/api/payment/create-order', data)
export const verifyPayment = (data) => api.post('/api/payment/verify', data)

// ============ ADMIN — PRODUCTS ============
export const adminGetProducts = () => api.get('/api/admin/products')
export const adminAddProduct = (data) => api.post('/api/admin/product/add', data)
export const adminUpdateProduct = (id, data) => api.put(`/api/admin/product/update/${id}`, data)
export const adminDeleteProduct = (id) => api.delete(`/api/admin/product/delete/${id}`)
export const adminUploadImages = async (formData) => {
    const token = localStorage.getItem('pulsepr_token')
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const response = await fetch(`${baseURL}/api/admin/product/upload-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    const data = await response.json()
    if (!response.ok) {
        throw { response: { data } }
    }
    return { data }
}

// ============ ADMIN — ORDERS ============
export const adminGetOrders = () => api.get('/api/admin/orders')
export const adminUpdateOrderStatus = (id, orderStatus) =>
    api.patch(`/api/admin/order/status/${id}`, { orderStatus })

// ============ ADMIN — USERS ============
export const adminGetUsers = () => api.get('/api/admin/users')

// ============ ADMIN — STATS ============
export const adminGetStats = () => api.get('/api/admin/stats')

// ============ ADMIN — OFFERS ============
export const adminGetOffers = () => api.get('/api/admin/offers')
export const adminCreateOffer = (data) => api.post('/api/admin/offers', data)
export const adminApplyOffer = (data) => api.post('/api/admin/offers/apply', data)

// ============ USER — ORDERS ============
export const getUserOrders = () => api.get('/api/auth/orders')
// ============ USER — DESIGNS ============
export const uploadDesign = async (formData) => {
    const token = localStorage.getItem('pulsepr_token')
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const response = await fetch(`${baseURL}/api/designs/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    const data = await response.json()
    if (!response.ok) {
        throw { response: { data } }
    }
    return { data }
}
export const getMyDesigns = () => api.get('/api/designs/my-designs')
export const getDesignById = (id) => api.get(`/api/designs/${id}`)
export const deleteDesign = (id) => api.delete(`/api/designs/${id}`)
