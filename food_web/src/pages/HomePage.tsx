import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { categoryAPI, productAPI, getImageUrl } from '../services/api';

type Category = { id: string; name: string; imageUrl?: string };
const shuffle = <T,>(arr: T[]): T[] => arr.map(v => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [catRes, prodRes]: any = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll({ page: 1, limit:20 })
        ]);
        const cats = catRes.data.data || [];
        const prods = prodRes.data.data || [];
        setCategories(cats);
        setAllProducts(prods);
        const shuffled = shuffle(prods);
        setDeals(shuffled.slice(0, 10));
        setPopular(shuffled.slice(10, 20));
      } catch (e) {
        setError('Veriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wrapper for Intro and Categories with responsive ordering */}
      <div className="flex flex-col">
        {/* Kategoriler Section - Mobilde önce, masaüstünde sonra */}
        {categories.length > 0 && (
          <section className="bg-white order-1 lg:order-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="mb-6">
                <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">Kategoriler</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Alışveriş Kategorileri</h2>
                <p className="text-gray-600 text-sm sm:text-base">İhtiyacınız olan her şey bir kategori uzağınızda</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/all?categoryId=${encodeURIComponent(cat.id)}`)}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition cursor-pointer p-4 flex flex-col items-center gap-3"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      {cat.imageUrl ? (
                        <img
                          src={getImageUrl(cat.imageUrl)}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-red-600 font-extrabold tracking-widest text-xs">UYMAR</span>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Intro / Hero - Mobilde sonra, masaüstünde önce */}
        <section className="relative bg-white order-2 lg:order-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4">Uymar Market</div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Taze, Hızlı ve Güvenilir Market Alışverişi
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mb-6">
                Bölgenize özel fiyatlarla binlerce ürünü dakikalar içinde kapınıza getiriyoruz. Güvenli ödeme, anında destek ve uygun fiyat garantisi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/all" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base">Alışverişe Başla</Link>
              </div>
            </div>
            <div className="order-first lg:order-0">
              <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src="https://media.istockphoto.com/id/1406885804/tr/foto%C4%9Fraf/a-shopping-cart-by-a-store-shelf-in-a-supermarket.jpg?s=612x612&w=0&k=20&c=N4Qei7JN0nph0NwSY-idqJw088QJHOkCliQOjK42b-w="
                  alt="Market rafları ve ürünler"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Delivery fee banner */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/all')}
            className="w-full text-left mt-4 mb-6 bg-orange-500 hover:bg-orange-600 transition-colors rounded-2xl px-5 sm:px-8 py-5 sm:py-6 shadow-sm"
          >
            <div className="flex items-start gap-3 sm:gap-4 text-white">
              <span className="text-2xl sm:text-3xl">🚚</span>
              <div>
                <div className="text-lg sm:text-2xl font-extrabold leading-snug">
                  Mahallenize göre teslimat ücretini öğrenmek için tıklayınız.
                </div>
                <p className="mt-2 underline italic text-white/95 text-sm sm:text-base">
                  Siparişinizin teslimat bedeli, bulunduğunuz bölgeye göre değişiklik gösterebilir.
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Mobile bottom bar moved to shared component */}

      {/* Features: 3 columns */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Icon icon="mdi:truck-fast" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Hızlı Teslimat</div>
                <div className="text-gray-600 text-sm">Seçili bölgelerde aynı gün, kapınıza kadar teslim.</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:shield-check" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Güvenli Alışveriş</div>
                <div className="text-gray-600 text-sm">Şifreli ödeme altyapısı ve veri güvenliği standartları.</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Icon icon="mdi:tag" className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Uygun Fiyat</div>
                <div className="text-gray-600 text-sm">Bölgenize özel kampanyalar ve şeffaf fiyatlandırma.</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Deals and Popular Sections */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
          {/* Fırsatları Kaçırma */}
          <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">Fırsatlar</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Fırsatları Kaçırma</h2>
                <p className="text-gray-600 text-sm sm:text-base">Seçili ürünlerde sınırlı süre indirimler</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {deals.map((p) => (
                <div key={`${p.id}`} className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition p-3 flex flex-col">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-red-600 font-extrabold tracking-widest">UYMAR</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium line-clamp-2 text-sm sm:text-base cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>{p.name}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <div className="text-primary font-bold text-base sm:text-lg">₺{Number(p.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                    className="mt-3 bg-primary cursor-pointer hover:bg-primary-dark text-white w-full py-2 rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:cart" className="w-5 h-5" /> Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* En Popüler Ürünler */}
          <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">Popüler</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">En Popüler Ürünler</h2>
                <p className="text-gray-600 text-sm sm:text-base">Müşterilerimizin en çok tercih ettiği ürünler</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {popular.map((p) => (
                <div key={`${p.id}-pop`} className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition p-3 flex flex-col">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-red-600 font-extrabold tracking-widest">UYMAR</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium line-clamp-2 text-sm sm:text-base cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>{p.name}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <div className="text-primary font-bold text-base sm:text-lg">₺{Number(p.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                    className="mt-3 bg-primary cursor-pointer hover:bg-primary-dark text-white w-full py-2 rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:cart" className="w-5 h-5" /> Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <aside className="bg-white rounded-2xl border border-gray-200 p-4 h-max">
          <div className="font-semibold mb-3">Hızlı Erişim</div>
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 text-sm sm:text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg p-2 cursor-pointer transition" onClick={() => navigate(`/all?categoryId=${encodeURIComponent(c.id)}`)}>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                  {c.imageUrl ? (
                    <img
                      src={getImageUrl(c.imageUrl)}
                      alt={c.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-red-600 font-extrabold tracking-widest text-[8px]">UYMAR</span>
                  )}
                </div>
                <span className="flex-1">{c.name}</span>
                <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <section className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {allProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition p-3 flex flex-col">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-red-600 font-extrabold tracking-widest">UYMAR</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-gray-800 font-medium line-clamp-2 text-sm sm:text-base cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>{p.name}</div>
                  <div className="mt-2 flex items-end gap-2">
                    <div className="text-primary font-bold text-base sm:text-lg">₺{p.price.toFixed(2)}</div>
                    <div className="text-gray-400 line-through text-xs sm:text-sm">₺{(p.price+9.99).toFixed(2) || 0}</div>
                  </div>
                </div>
                <button
                  onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                  className="mt-3 bg-primary cursor-pointer hover:bg-primary-dark text-white w-full py-2 rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:cart" className="w-5 h-5" /> Sepete Ekle
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;


