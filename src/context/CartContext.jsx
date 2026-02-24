import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/services'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth()
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) { setCart(null); return }
        try {
            setLoading(true)
            const res = await getCart()
            setCart(res.data.cart)
        } catch {
            setCart(null)
        } finally {
            setLoading(false)
        }
    }, [isAuthenticated])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    const addItem = async (productId, size, quantity = 1) => {
        try {
            await addToCart({ productId, size, quantity })
            toast.success('Added to cart!')
            await fetchCart()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add item')
            throw err
        }
    }

    const updateItem = async (itemId, quantity) => {
        try {
            await updateCartItem({ itemId, quantity })
            await fetchCart()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update cart')
            throw err
        }
    }

    const removeItem = async (itemId) => {
        try {
            await removeCartItem(itemId)
            toast.success('Item removed')
            await fetchCart()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove item')
            throw err
        }
    }

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

    const cartTotal = cart?.items?.reduce((sum, item) => {
        const price = item.product?.discountPrice || item.product?.price || 0
        return sum + price * item.quantity
    }, 0) || 0

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
