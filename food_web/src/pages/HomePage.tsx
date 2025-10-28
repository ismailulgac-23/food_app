import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { CircleSpinner } from 'react-spinners-kit';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanner from '../components/PromoBanner';
import PopularProducts from '../components/PopularProducts';
import NewProducts from '../components/NewProducts';
import { categoryAPI, productAPI } from '../services/api';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse]: any = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll({ page, limit: 500 })
        ]);
        setCategories(categoriesResponse.data.data || []);
        setProducts(productsResponse.data.data || []);
        const pagination = productsResponse.data.pagination;
        if (pagination && pagination.pages) {
          setPages(pagination.pages);
        } else {
          setPages(1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: "Taze Sebze & Meyve",
      subtitle: "Günlük taze ürünler",
      description: "En taze sebze ve meyveleri kapınıza kadar getiriyoruz",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
      buttonText: "Hemen Sipariş Ver",
      buttonLink: "/all"
    },
    {
      id: 2,
      title: "Et & Tavuk",
      subtitle: "Kaliteli protein kaynakları",
      description: "Taze et ve tavuk ürünleri ile sağlıklı beslenin",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
      buttonText: "Ürünleri İncele",
      buttonLink: "/all"
    },
    {
      id: 3,
      title: "Süt & Kahvaltılık",
      subtitle: "Günlük ihtiyaçlarınız",
      description: "Taze süt ürünleri ve kahvaltılık ürünler",
      image: "https://hthayat.haberturk.com/im/2016/07/29/ver1493276661/1036237_620x360.jpg",
      buttonText: "Keşfet",
      buttonLink: "/all"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircleSpinner size={60} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                {heroSlides[currentSlide].subtitle}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={'/all'}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {heroSlides[currentSlide].buttonText}
                </Link>
                <Link to={'/all'} className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                  Kategorileri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-black cursor-pointer p-3 rounded-full transition-all duration-300"
        >
          <Icon icon="mdi:chevron-left" className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-black cursor-pointer p-3 rounded-full transition-all duration-300"
        >
          <Icon icon="mdi:chevron-right" className="w-6 h-6" />
        </button>
      </section>

      {/* Search Bar */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ne Arıyorsunuz?
            </h2>
            <p className="text-lg text-gray-600">
              Binlerce ürün arasından aradığınızı kolayca bulun
            </p>
          </div>
            <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && search.trim()) { navigate(`/category/tumu?search=${encodeURIComponent(search.trim())}`); } }}
              placeholder="Ürün, kategori veya marka ara..."
              className="w-full px-8 py-6 pl-16 pr-20 text-text-primary bg-grey-100 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:bg-white text-lg border-2 border-transparent focus:border-primary transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Icon icon="mdi:magnify" className="h-7 w-7 text-gray-400" />
            </div>
            <button className="absolute inset-y-0 right-0 pr-2 flex items-center" onClick={() => { if (search.trim()) { navigate(`/category/tumu?search=${encodeURIComponent(search.trim())}`); } }}>
              <div className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Icon icon="mdi:magnify" className="h-6 w-6" />
              </div>
            </button>
          </div>

          {/* Quick Search Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Sebze', 'Meyve', 'Et', 'Süt', 'Ekmek', 'İçecek', 'Atıştırmalık'].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-grey-100 hover:bg-primary hover:text-white text-text-secondary rounded-full text-sm font-medium transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-accent-light text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Kategoriler
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Ürün Kategorileri
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              İhtiyacınız olan ürünleri kategorilere göre kolayca bulun ve en iyi fiyatlarla alışveriş yapın
            </p>
          </div>
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="py-5 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-secondary-light text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Öne Çıkan Ürünler
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              En Popüler Ürünler
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Müşterilerimizin en çok tercih ettiği kaliteli ve taze ürünleri keşfedin
            </p>
          </div>
          <FeaturedProducts products={products.slice(0, 8)} loading={loading} />
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Özel Fırsatlar
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Kampanyalar & İndirimler
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Kaçırılmayacak fırsatlar ve özel indirimler sizi bekliyor
            </p>
          </div>
          <PromoBanner />
        </div>
      </section>

      {/* Popular & New Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Products */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-block bg-warning bg-opacity-10 text-warning px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Popüler Ürünler
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  En Çok Satan Ürünler
                </h2>
                <p className="text-lg text-text-secondary">
                  Müşterilerimizin en çok tercih ettiği ürünler
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <PopularProducts products={products.slice(0, 25)} loading={loading} />
              </div>
            </div>

            {/* New Products */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Yeni Ürünler
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Yeni Gelen Ürünler
                </h2>
                <p className="text-lg text-text-secondary">
                  En yeni ürünlerimizi ilk siz keşfedin
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <NewProducts products={products.slice(-4)} loading={loading} />
              </div>
            </div>
          </div>
          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
              >
                Önceki
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">Sayfa {page} / {pages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Özel Fırsatları Kaçırmayın!
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                E-bültenimize abone olun, özel indirimler ve kampanyalardan ilk siz haberdar olun
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  className="flex-1 px-6 py-4 bg-gray-50 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-lg border border-gray-200"
                />
                <button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
                  Abone Ol
                </button>
              </div>
              <p className="text-text-secondary text-sm mt-4">
                * Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hemen Alışverişe Başlayın
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Binlerce ürün arasından seçim yapın, kapınıza kadar getirelim.
              Hızlı, güvenli ve uygun fiyatlı alışveriş deneyimi sizi bekliyor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/category/tumu"
              className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
            >
              <Icon icon="mdi:shopping" className="w-6 h-6" />
              Tüm Ürünleri Gör
            </Link>
            <Link
              to="/cart"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Icon icon="mdi:cart" className="w-6 h-6" />
              Sepete Git
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:lightning-bolt" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
              <p className="text-grey-300">30 dakikada kapınızda</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:check-circle" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kaliteli Ürünler</h3>
              <p className="text-grey-300">Taze ve güvenilir ürünler</p>
            </div>
            <div className="text-center">
              <div className="bg-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:currency-try" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Uygun Fiyatlar</h3>
              <p className="text-grey-300">En iyi fiyat garantisi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
