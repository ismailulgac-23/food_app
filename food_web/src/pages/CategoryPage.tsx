import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';
import { categoryAPI, productAPI } from '../services/api';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Fetch category and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (searchQuery) {
          const productsResponse: any = await productAPI.getAll({ search: searchQuery, page, limit: 500 });
          setProducts(productsResponse.data.data || []);
          const pagination = productsResponse.data.pagination;
          setPages(pagination?.pages || 1);
          setCategory(null);
        } else {
          // First get all categories to find the one by name
          const categoriesResponse: any = await categoryAPI.getAll();
          const categories = categoriesResponse.data.data;
          // Find category by name (assuming categoryName is the URL-friendly version)
          const foundCategory = categories.find((cat: any) => 
            cat.name.toLowerCase().replace(/\s+/g, '-') === categoryName
          );
          if (!foundCategory) {
            setError('Kategori bulunamadı');
            return;
          }
          setCategory(foundCategory);
          const productsResponse: any = await productAPI.getAll({ categoryId: foundCategory.id, page, limit: 500 });
          setProducts(productsResponse.data.data || []);
          const pagination = productsResponse.data.pagination;
          setPages(pagination?.pages || 1);
        }
        
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Veri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchData();
    }
  }, [categoryName, searchQuery, page]);

  // Static products for fallback
  const staticProducts = [
    {
      id: 1,
      name: 'Organik Domates',
      price: 12.99,
      originalPrice: 15.99,
      discount: 19,
      rating: 4.8,
      reviews: 124,
      image: 'https://static.ticimax.cloud/cdn-cgi/image/width=540,quality=85/60564/uploads/urunresimleri/buyuk/organik-pembe-domates-500-gr-8-4f81.jpg',
      badge: 'Yeni',
      badgeColor: 'bg-green-500',
      inStock: true,
      isFavorite: false
    },
    {
      id: 2,
      name: 'Taze Salatalık',
      price: 8.50,
      originalPrice: 10.00,
      discount: 15,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop',
      badge: 'Popüler',
      badgeColor: 'bg-orange-500',
      inStock: true,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Organik Havuç',
      price: 6.99,
      originalPrice: 8.50,
      discount: 18,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop',
      badge: 'İndirim',
      badgeColor: 'bg-red-500',
      inStock: true,
      isFavorite: false
    },
    {
      id: 4,
      name: 'Taze Soğan',
      price: 4.25,
      rating: 4.5,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop',
      badge: 'En Çok Satan',
      badgeColor: 'bg-blue-500',
      inStock: true,
      isFavorite: false
    }
  ];

  const categories = [
    { name: 'Sebze & Meyve', count: 45 },
    { name: 'Et & Tavuk', count: 23 },
    { name: 'Süt Ürünleri', count: 18 },
    { name: 'Ekmek & Pastane', count: 12 },
    { name: 'İçecekler', count: 34 }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popülerlik' },
    { value: 'price-low', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'price-high', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'rating', label: 'Değerlendirme' },
    { value: 'newest', label: 'En Yeni' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircleSpinner size={60} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Kategori verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
          {categoryName?.replace('-', ' ').toUpperCase()}
        </h1>
              <p className="text-text-secondary mt-2 text-lg font-medium">
                156 ürün bulundu
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6">
              {/* View Mode Toggle */}
              <div className="flex bg-grey-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary' 
                      : 'text-text-secondary hover:text-primary hover:bg-white/50'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary' 
                      : 'text-text-secondary hover:text-primary hover:bg-white/50'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 bg-grey-50 rounded-2xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300 min-w-[200px] font-semibold"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {!searchQuery && (
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Kategoriler</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 text-left text-text-secondary hover:text-primary hover:bg-grey-50 rounded-xl transition-colors duration-200"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm bg-grey-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Fiyat Aralığı</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-1"
                    name="price"
                    className="w-4 h-4 text-primary border-grey-300 focus:ring-primary"
                  />
                  <label htmlFor="price-1" className="ml-3 text-text-secondary">
                    0₺ - 25₺
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-2"
                    name="price"
                    className="w-4 h-4 text-primary border-grey-300 focus:ring-primary"
                  />
                  <label htmlFor="price-2" className="ml-3 text-text-secondary">
                    25₺ - 50₺
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-3"
                    name="price"
                    className="w-4 h-4 text-primary border-grey-300 focus:ring-primary"
                  />
                  <label htmlFor="price-3" className="ml-3 text-text-secondary">
                    50₺ - 100₺
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Değerlendirme</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      className="w-4 h-4 text-primary border-grey-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-3 flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-grey-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-text-secondary">ve üzeri</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Product Listing */}
          <div className="flex-1">
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid grid-cols-1'} gap-6`}>
              {products.map((product) => (
                <div key={product.id} className={`bg-white rounded-2xl border border-gray-200 hover:border-grey-300 transition-all duration-300 hover:scale-[1.02] group ${
                  viewMode === 'list' ? 'flex p-6' : 'p-6'
                }`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 mr-6' : 'aspect-square mb-6'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-xl ${product.badgeColor}`}>
                        {product.badge}
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-xl hover:bg-grey-50 transition-all duration-300 hover:scale-110">
                      <svg
                        className={`w-4 h-4 transition-colors duration-300 ${product.isFavorite ? 'text-red-500 fill-current' : 'text-grey-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-bold text-text-primary mb-3 line-clamp-2 text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-grey-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-text-secondary">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-text-primary">
                          {product.price}₺
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-text-secondary line-through">
                            {product.originalPrice}₺
                          </span>
                        )}
                      </div>
                      {product.discount && product.discount > 0 && (
                        <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-xl">
                          -%{product.discount}
                        </span>
                      )}
                    </div>

                    <button
                      className="w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 bg-primary text-white hover:bg-primary-dark transform hover:scale-105"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;