import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { CircleSpinner } from 'react-spinners-kit';
import { useCart } from '../contexts/CartContext';
import { productAPI } from '../services/api';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {

      try {
        setLoading(true);
        setError(null);

        if (productId) {
          const response: any = await productAPI.getById(productId);
          if (response.data.success) {
            setProduct(response.data.data || null);
          } else {
            setError('Ürün bulunamadı');
          }
        }

      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Ürün yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Variant feature removed

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const total = product.price * quantity;
    return total;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircleSpinner size={60} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Ürün detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Ürün bulunamadı'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-text-secondary">
            <li><a href="/" className="hover:text-primary">Ana Sayfa</a></li>
            <li>/</li>
            <li><a href={`/category/${product.category?.name?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">{product.category?.name || 'Kategori'}</a></li>
            <li>/</li>
            <li className="text-text-primary">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden relative flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-red-600 font-extrabold text-2xl tracking-widest">UYMAR</span>
              )}
            </div>

            {/* Eğer birden fazla resim varsa göster */}
            {product.images && product.images.length > 0 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className="w-20 h-20 bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-grey-300 transition-colors duration-200"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-text-secondary">{product.category?.name || 'Kategori'}</span>
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        icon="mdi:star"
                        className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-grey-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-text-secondary">4.5 (24 değerlendirme)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-text-primary">₺{product.price}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Açıklama</h3>
              <p className="text-text-secondary leading-relaxed">
                {product.description || 'Bu ürün hakkında detaylı bilgi yakında eklenecek.'}
              </p>
            </div>

            {/* Variants removed */}

            {/* Options removed */}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-text-primary">Miktar</span>
                <div className="flex items-center bg-grey-100 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer p-2 hover:bg-grey-200 rounded-l-xl transition-colors duration-200"
                  >
                    <Icon icon="mdi:minus" className="w-4 h-4 text-text-secondary" />
                  </button>
                  <span className="px-4 py-2 text-text-primary font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer p-2 hover:bg-grey-200 rounded-r-xl transition-colors duration-200"
                  >
                    <Icon icon="mdi:plus" className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-text-primary">{calculateTotalPrice().toFixed(2)}₺</span>
                  <p className="text-text-secondary text-sm">Toplam fiyat</p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 bg-primary text-white hover:bg-primary-dark transform hover:scale-105 cursor-pointer"
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;