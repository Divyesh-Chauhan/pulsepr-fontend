import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1a1a1a',
                                color: '#f5f5f5',
                                border: '1px solid #2a2a2a',
                                borderRadius: '0',
                                fontSize: '14px',
                                fontFamily: 'Inter, sans-serif',
                            },
                            success: {
                                iconTheme: { primary: '#d4ff00', secondary: '#0a0a0a' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
                            },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
