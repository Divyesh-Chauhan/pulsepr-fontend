import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Public Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import ShippingPolicy from './pages/ShippingPolicy'
import ReturnPolicy from './pages/ReturnPolicy'

// User Pages
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import OrderSuccess from './pages/OrderSuccess'
import CustomDesign from './pages/CustomDesign'

// Admin Pages
import Dashboard from './admin/Dashboard'
import ProductsList from './admin/ProductsList'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import OrdersAdmin from './admin/OrdersAdmin'
import UsersAdmin from './admin/UsersAdmin'
import OffersAdmin from './admin/OffersAdmin'
import AdminLayout from './admin/AdminLayout'

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-brand-black">
            <Routes>
                {/* Admin Routes — no Navbar/Footer */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsList />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="products/edit/:id" element={<EditProduct />} />
                    <Route path="orders" element={<OrdersAdmin />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="offers" element={<OffersAdmin />} />
                </Route>

                {/* Public + User Routes */}
                <Route
                    path="/*"
                    element={
                        <>
                            <Navbar />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/products/:id" element={<ProductDetails />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                                    <Route path="/return-policy" element={<ReturnPolicy />} />
                                    <Route
                                        path="/cart"
                                        element={
                                            <ProtectedRoute>
                                                <Cart />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/checkout"
                                        element={
                                            <ProtectedRoute>
                                                <Checkout />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute>
                                                <Orders />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/custom-design"
                                        element={
                                            <ProtectedRoute>
                                                <CustomDesign />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/order-success"
                                        element={
                                            <ProtectedRoute>
                                                <OrderSuccess />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Routes>
                            </main>
                            <Footer />
                        </>
                    }
                />
            </Routes>
        </div>
    )
}

export default App
