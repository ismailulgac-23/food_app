import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productAPI } from '../services/api';

const Header: React.FC = () => {

  const { addToCart, getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowDesktopDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 2) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }
      try {
        setSearchLoading(true);
        const res: any = await productAPI.getAll({ limit: 4, search: q });
        setSearchResults(res.data.data || []);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query]);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowDesktopDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (

    <>
      {/* Top bar */}
      <div className="bg-gray-900 text-gray-100 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:headset" className="w-4 h-4" />
            <span>Müşteri Hizmetleri (0850) 811 39 49</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <a className="hover:underline" href="/">Mağazalarımız</a>
            <a className="hover:underline" href="/">Kariyer</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:bg-primary-dark transition-all duration-300">
              <Icon icon="mdi:shopping" className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-lg sm:text-2xl text-text-primary">Uymar Market</div>
          </Link>

          {/* Search */}
          <div className="hidden sm:block flex-1 max-w-xl" ref={searchBoxRef}>
            <div className="relative">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ürün ara..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDesktopDropdown(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) { navigate(`/all?search=${encodeURIComponent(query.trim())}`); setShowDesktopDropdown(false); } }}
                onFocus={() => { if (query.trim().length >= 2) setShowDesktopDropdown(true); }}
              />
              <Icon icon="mdi:magnify" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {showDesktopDropdown && query.trim().length >= 2 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  {searchLoading ? (
                    <div className="p-4 text-sm text-gray-500">Aranıyor...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {searchResults.slice(0, 4).map((p) => (
                        <li key={p.id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3" onMouseDown={() => { setShowDesktopDropdown(false); navigate(`/product/${p.id}`); }}>
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-[10px] text-red-600 font-extrabold">UYMAR</span>}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-800 line-clamp-1">{p.name}</div>
                            <div className="text-xs text-gray-500">₺{Number(p.price).toFixed(2)}</div>
                          </div>
                          <button className="text-xs px-3 py-1 rounded-lg bg-primary text-white" onMouseDown={(e) => { e.stopPropagation(); addToCart(p); }}>Ekle</button>
                        </li>
                      ))}
                      <li>
                           <button className="w-full text-left p-3 text-sm text-primary hover:bg-gray-50 rounded-b-xl" onMouseDown={() => { setShowDesktopDropdown(false); navigate(`/all?search=${encodeURIComponent(query.trim())}`); }}>Tüm sonuçları gör</button>
                      </li>
                    </ul>
                  ) : (
                    <div className="p-4 text-sm text-gray-500">Sonuç bulunamadı</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link to="/all" className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-primary hover:bg-gray-50 hover:text-primary transition group">
              <Icon icon="mdi:view-grid" className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="text-sm font-medium">Ürünler</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-primary hover:bg-gray-50 hover:text-primary transition group relative">
              <Icon icon="mdi:cart" className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="text-sm font-medium">Sepet</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{getTotalItems()}</span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-primary hover:bg-gray-50 hover:text-primary transition group">
                <Icon icon="mdi:account" className="w-5 h-5" />
                <span className="text-sm font-medium max-w-[140px] truncate">{user?.fullName}</span>
                <button onClick={logout} className="text-xs text-red-600 hover:underline">Çıkış</button>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-primary hover:bg-gray-50 hover:text-primary transition group">
                <Icon icon="mdi:account" className="w-5 h-5" />
                <span className="text-sm font-medium">Giriş / Kayıt</span>
              </Link>
            )}
          </nav>

          {/* Mobile: search icon + menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-primary hover:text-primary">
              <Icon icon={isMenuOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl mx-2">
                {/* Mobile Search */}
                <div className="px-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) { navigate(`/all?search=${encodeURIComponent(query.trim())}`); setIsMenuOpen(false); } }}
                      placeholder="Ürün ara..."
                      className="w-full px-5 py-3 pl-11 pr-4 text-sm text-text-primary bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition shadow"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon icon="mdi:magnify" className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <Link to="/all" className="flex items-center gap-2 px-4 py-3 text-text-primary hover:bg-white hover:text-primary transition rounded-xl text-base font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <Icon icon="mdi:view-grid" className="w-6 h-6" /> Ürünler
                </Link>
                <Link to="/cart" className="flex items-center gap-2 px-4 py-3 text-text-primary hover:bg-white hover:text-primary transition rounded-xl text-base font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <Icon icon="mdi:cart" className="w-6 h-6" /> Sepet
                  {getTotalItems() > 0 && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold">{getTotalItems()}</span>
                  )}
                </Link>
                {isAuthenticated ? (
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-text-primary hover:bg-white hover:text-primary transition rounded-xl text-base font-semibold" onClick={() => setIsMenuOpen(false)}>
                    <Icon icon="mdi:account" className="w-6 h-6" /> Profil
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 px-4 py-3 text-text-primary hover:bg-white hover:text-primary transition rounded-xl text-base font-semibold" onClick={() => setIsMenuOpen(false)}>
                    <Icon icon="mdi:account" className="w-6 h-6" /> Giriş / Kayıt
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Header;