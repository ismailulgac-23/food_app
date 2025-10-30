import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { productAPI } from '../services/api';

interface MobileBottomBarProps {
  excludePaths?: string[]; // paths to hide the bar on
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ excludePaths = [] }) => {
  const { getTotalItems, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const shouldHide = excludePaths.some((p) => location.pathname.startsWith(p));

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
        const res: any = await productAPI.getAll({ limit: 10, search: q });
        setSearchResults(res.data.data || []);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query]);

  if (shouldHide) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 md:hidden z-40">
        <div className="mx-auto max-w-7xl px-2 pb-safe">
          <div className="bg-white border-t border-gray-200 rounded-t-2xl shadow-lg mx-auto">
            <div className="grid grid-cols-4 text-xs">
              <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center justify-center py-3 text-gray-700">
                <Icon icon="mdi:magnify" className="w-6 h-6" />
                <span className="mt-1">Ara</span>
              </button>
              <button onClick={() => navigate('/all')} className="flex flex-col items-center justify-center py-3 text-gray-700">
                <Icon icon="mdi:view-grid" className="w-6 h-6" />
                <span className="mt-1">Ürünler</span>
              </button>
              <button onClick={() => navigate('/cart')} className="relative flex flex-col items-center justify-center py-3 text-gray-700">
                <Icon icon="mdi:cart" className="w-6 h-6" />
                <span className="mt-1">Sepet</span>
                {getTotalItems() > 0 && (
                  <span className="absolute top-1.5 right-5 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              {isAuthenticated ? (
                <button onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center py-3 text-gray-700">
                  <Icon icon="mdi:account" className="w-6 h-6" />
                  <span className="mt-1">Profil</span>
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="flex flex-col items-center justify-center py-3 text-gray-700">
                  <Icon icon="mdi:account" className="w-6 h-6" />
                  <span className="mt-1">Giriş</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen search modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="absolute inset-0 bg-white p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-semibold text-gray-900">Arama</div>
                <button onClick={() => setIsSearchOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <Icon icon="mdi:close" className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full px-5 py-3 pl-11 pr-24 text-base text-text-primary bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) { navigate(`/all?search=${encodeURIComponent(query.trim())}`); setIsSearchOpen(false); } }}
                />
                <Icon icon="mdi:magnify" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="mt-4 h-[calc(100vh-160px)] overflow-auto -mx-1 px-1">
                {searchLoading ? (
                  <div className="p-3 text-sm text-gray-500">Aranıyor...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map((p) => (
                      <li key={p.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-xl hover:bg-gray-50" onClick={() => { navigate(`/product/${p.id}`); setIsSearchOpen(false); }}>
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-[10px] text-red-600 font-extrabold">UYMAR</span>}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-500">₺{Number(p.price).toFixed(2)}</div>
                        </div>
                        <button className="text-xs px-3 py-1 rounded-lg bg-primary text-white" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Ekle</button>
                      </li>
                    ))}
                  </ul>
                ) : query.trim().length >= 2 ? (
                  <div className="p-3 text-sm text-gray-500">Sonuç bulunamadı</div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileBottomBar;


