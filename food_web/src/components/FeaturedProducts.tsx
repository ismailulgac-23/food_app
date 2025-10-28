import React from 'react';
import { Link } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';
import { useCart } from '../contexts/CartContext';

interface FeaturedProductsProps {
  products: any[];
  loading?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, loading = false }) => {
  const { addToCart } = useCart();
  // Static products for fallback
  const staticProducts = [
    {
      id: 1,
      name: 'Organik Domates',
      price: '₺15',
      originalPrice: '₺19',
      image: 'https://static.ticimax.cloud/cdn-cgi/image/width=540,quality=85/60564/uploads/urunresimleri/buyuk/organik-pembe-domates-500-gr-8-4f81.jpg',
      discount: '%20 İndirim',
      category: 'Meyve & Sebze'
    },
    {
      id: 2,
      name: 'Taze Tavuk Göğsü',
      price: '₺75',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLbHkIgKQKIsSDzu36d0SGdkXfrTCuudNbrA&s',
      category: 'Et & Tavuk'
    },
    {
      id: 3,
      name: 'Kaşar Peyniri',
      price: '₺60',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ46fyjBQ689WECODkp0WLS7BaLk_rgZrQ4Iw&s',
      category: 'Süt & Kahvaltılık'
    },
    {
      id: 4,
      name: 'Zeytinyağı 1L',
      price: '₺120',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPHjW9IQO1KKqlrksYf_VNp01bDC5AyFllrg&s',
      category: 'Temel Gıda'
    },
    {
      id: 5,
      name: 'Taze Süt 1L',
      price: '₺25',
      image: 'https://prod-cdn-r2.sutas.market/638555368715085319.jpg',
      category: 'Süt & Kahvaltılık'
    },
    {
      id: 6,
      name: 'Kırmızı Elma',
      price: '₺12',
      image: 'https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/8016/uploads/urunresimleri/buyuk/malus-domestica-ici-disi-kirmizi-elma--6-f25e.jpg',
      category: 'Meyve & Sebze'
    }
  ];

  const displayProducts = products.length > 0 ? products : staticProducts;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <CircleSpinner size={50} color="#3B82F6" />
          <p className="mt-3 text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {displayProducts.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        >
          <div className={`relative w-full flex items-center justify-center bg-gray-50 ${product.image || product.imageUrl ? 'md:h-48' : 'h-48'}`}>
            {product.image || product.imageUrl ? (
              <img
                src={product.image || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-red-600 font-extrabold text-lg tracking-widest">UYMAR MARKET</span>
              </div>
            )}
            {product.discount && (
              <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                {product.discount}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              {product.category?.name || 'Kategori'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  ₺{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-grey-500 line-through">
                    ₺{product.originalPrice}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedProducts;
