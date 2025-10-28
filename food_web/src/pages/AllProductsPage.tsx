import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { CircleSpinner } from 'react-spinners-kit';
import { productAPI } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res: any = await productAPI.getAll({ page, limit: 500, search: searchQuery || undefined });
        setProducts(res.data.data || []);
        setPages(res.data.pagination?.pages || 1);
      } catch (e) {
        setError('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, searchQuery]);

  const handleAdd = (p: any) => {
    addToCart(p);
    toast.success('Sepete eklendi');
    setAddedIds(prev => new Set(prev).add(p.id));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; });
    }, 1500);
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
          <p className="text-text-secondary">Toplam {products.length} ürün</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-red-600 font-extrabold tracking-widest">UYMAR</span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-text-primary line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-text-primary">₺{product.price}</span>
                  <button
                    onClick={() => handleAdd(product)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${addedIds.has(product.id) ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}
                  >
                    {addedIds.has(product.id) ? 'Eklendi' : 'Sepete Ekle'}
                  </button>
                </div>
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


