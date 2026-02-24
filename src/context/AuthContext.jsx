import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // Restore session on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('pulsepr_token')
        const storedUser = localStorage.getItem('pulsepr_user')
        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem('pulsepr_token')
                localStorage.removeItem('pulsepr_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await loginUser({ email, password })
        const { token: jwt, user: userData } = res.data
        localStorage.setItem('pulsepr_token', jwt)
        localStorage.setItem('pulsepr_user', JSON.stringify(userData))
        setToken(jwt)
        setUser(userData)
        return userData
    }

    const register = async (name, email, password, role = 'USER') => {
        const res = await registerUser({ name, email, password, role })
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('pulsepr_token')
        localStorage.removeItem('pulsepr_user')
        setToken(null)
        setUser(null)
        toast.success('Logged out successfully')
    }

    const isAdmin = user?.role === 'ADMIN'
    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
