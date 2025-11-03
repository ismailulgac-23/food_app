import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { CircleSpinner } from 'react-spinners-kit';
import { categoryAPI, productAPI, getImageUrl } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; imageUrl?: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const categoryId = new URLSearchParams(location.search).get('categoryId') || '';

  useEffect(() => {
    // load categories once
    (async () => {
      try {
        const res: any = await categoryAPI.getAll();
        setCategories(res.data.data || []);
      } catch { }
    })();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const effectiveCategoryId = selectedCategory || categoryId || undefined;
        const res: any = await productAPI.getAll({ page, limit: 20, search: searchQuery || undefined, categoryId: effectiveCategoryId });
        const list = res.data.data || [];
        setProducts(list);
        setDisplayProducts(list);
        setPages(res.data.pagination?.pages || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        setError('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, searchQuery, categoryId, selectedCategory]);

  const toggleCategory = (id: string) => {
    setSelectedCategory(prev => prev === id ? null : id);
  };

  const clearCategories = () => setSelectedCategory(null);

  const handleAdd = (p: any) => {
    addToCart(p);
    setAddedIds(prev => new Set(prev).add(p.id));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; });
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircleSpinner size={60} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">Tekrar Dene</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Tüm Ürünler</h1>
          <p className="text-text-secondary">Toplam {displayProducts.length} ürün</p>
        </div>

        {/* Category filter chips/cards */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Kategoriler</h2>
              {selectedCategory && (
                <button
                  onClick={clearCategories}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 transition"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                  <span className="text-sm font-medium">Filtreyi Temizle</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${selectedCategory === c.id
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${selectedCategory === c.id ? 'bg-white/20' : 'bg-gray-50'
                    }`}>
                    {c.imageUrl ? (
                      <img
                        src={getImageUrl(c.imageUrl)}
                        alt={c.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-red-600 font-extrabold tracking-widest text-[10px]">UYMAR</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-center line-clamp-2">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer" onClick={() => window.location.assign(`/product/${product.id}`)}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-red-600 font-extrabold tracking-widest">
                    UYMAR
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-col flex-1">
                <h3 className="font-semibold text-text-primary line-clamp-2 min-h-[48px] cursor-pointer" onClick={() => window.location.assign(`/product/${product.id}`)}>{product.name}</h3>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-5">
                  <div className="flex items-baseline gap-2">
                    {/* Fake old price for a bit more dramatic effect */}
                    <span className="text-gray-400 line-through font-bold text-base select-none">
                      ₺{(parseFloat(product.price) + 9.99).toFixed(2)}
                    </span>
                    <span className="text-lg font-extrabold text-red-600 drop-shadow-md bg-red-100 px-2 py-1 rounded-lg">
                      ₺{parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className={`mt-4 cursor-pointer w-full md:w-auto px-4 py-2 rounded-xl font-semibold text-sm transition ${addedIds.has(product.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                >
                  {addedIds.has(product.id) ? 'Eklendi' : 'Sepete Ekle'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50">Önceki</button>
            <span className="px-3 py-2 text-sm text-gray-600">Sayfa {page} / {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50">Sonraki</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;


