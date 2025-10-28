import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center group-hover:bg-primary-dark transition-all duration-300">
              <Icon icon="mdi:shopping" className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold text-text-primary">Uymar Market</span>
              <p className="text-sm text-text-secondary -mt-1">Taze Ürünler</p>
            </div>
          </Link>

          

          {/* Navigation with Icons */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3 py-2 px-2 rounded-2xl text-text-primary hover:bg-grey-50 hover:text-primary transition-all duration-300 group"
            >
              <Icon icon="mdi:home" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base font-medium">Ana Sayfa</span>
            </Link>
            
            <Link 
              to="/all" 
              className="flex items-center space-x-3 py-2 px-2 rounded-2xl text-text-primary hover:bg-grey-50 hover:text-primary transition-all duration-300 group"
            >
              <Icon icon="mdi:view-grid" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base font-medium">Tüm Ürünler</span>
            </Link>

            <Link 
              to="/cart" 
              className="flex items-center space-x-3 py-2 px-2 rounded-2xl text-text-primary hover:bg-grey-50 hover:text-primary transition-all duration-300 group relative"
            >
              <Icon icon="mdi:cart" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base font-medium">Sepet</span>
              {getTotalItems() > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </div>
              )}
            </Link>
            
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center space-x-3">
                <Icon icon="mdi:account" className="w-6 h-6" />
                <span className="text-base font-medium max-w-[140px] truncate">{user?.fullName}</span>
                <button onClick={logout} className="text-sm text-red-600 hover:underline">Çıkış</button>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-3 py-2 px-2 rounded-2xl text-text-primary hover:bg-grey-50 hover:text-primary transition-all duration-300 group"
              >
                <Icon icon="mdi:account" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base font-medium">Giriş / Kayıt</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-primary hover:text-primary focus:outline-none focus:text-primary"
            >
              <Icon 
                icon={isMenuOpen ? "mdi:close" : "mdi:menu"} 
                className="h-6 w-6" 
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-6 pb-8 space-y-4 bg-grey-50 rounded-2xl shadow-xl mx-2 mt-2">
              {/* Mobile Search */}
              <div className="mb-6 px-2">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) { navigate(`/all?search=${encodeURIComponent(query.trim())}`); setIsMenuOpen(false); } }}
                    placeholder="Ürün ara..."
                    className="w-full px-6 py-4 pl-14 pr-4 text-lg text-text-primary bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 shadow"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="mdi:magnify" className="h-7 w-7 text-grey-400" />
                  </div>
                </div>
              </div>
              
              <Link
                to="/"
                className="flex items-center space-x-2 px-6 py-5 text-text-primary hover:bg-white hover:text-primary transition-all duration-300 rounded-2xl text-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon icon="mdi:home" className="w-8 h-8" />
                <span className="font-semibold text-lg md:text-xl">Ana Sayfa</span>
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-6 py-5 text-text-primary hover:bg-white hover:text-primary transition-all duration-300 rounded-2xl text-xl font-semibold relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon icon="mdi:cart" className="w-8 h-8" />
                <span className="font-semibold text-lg md:text-xl">Sepet</span>
                <div className="ml-auto bg-primary text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold shadow">
                  3
                </div>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-6 py-5 text-text-primary hover:bg-white hover:text-primary transition-all duration-300 rounded-2xl text-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon icon="mdi:account" className="w-8 h-8" />
                <span className="font-semibold text-lg md:text-xl">Profil</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;