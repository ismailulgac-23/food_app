import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import MobileBottomBar from './components/MobileBottomBar';


function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/all" element={<AllProductsPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
            {/* Global mobile bottom bar with exclude list */}
            <MobileBottomBar excludePaths={[]} />
          </div>
          <Toaster position="bottom-center" toastOptions={{
            success: { className: 'bg-green-500 text-white' },
            error: { className: 'bg-red-500 text-white' }
          }} />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;