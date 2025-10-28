import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { CircleSpinner } from 'react-spinners-kit';
import { authAPI, orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  const location = useLocation();
  useEffect(() => { refreshUser(); }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'orders') setActiveTab('orders');
  }, [location.search]);
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setAddress(user.address || '');
      (async () => {
        try { const response: any = await orderAPI.getMine(); setOrders(response.data.data); }
        catch (err) { setError('Siparişler yüklenirken hata oluştu'); }
        finally { setLoading(false); }
      })();
    } else {
      setLoading(false);
    }
  }, [user]);

  const onSave = async () => {
    await authAPI.updateMe({ fullName, address });
    await refreshUser();
  };

  const formatPhoneTR = (phone?: string) => {
    const digits = (phone || '').replace(/\D/g, '');
    if (!digits.startsWith('90')) return phone || '';
    const rest = digits.slice(2);
    let res = '+90 ';
    if (rest.length > 0) res += '(' + rest.slice(0, 3) + ') ';
    if (rest.length >= 3) res += rest.slice(3, 6) + ' ';
    if (rest.length >= 6) res += rest.slice(6, 10);
    return res.trim();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lütfen giriş yapınız.</p>
        </div>
      </div>
    );
  }

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '15 Mart 2024',
      status: 'Teslim Edildi',
      total: 89.50,
      items: 3,
      products: [
        { name: 'Organik Domates', price: 12.99, quantity: 2, image: 'https://static.ticimax.cloud/cdn-cgi/image/width=540,quality=85/60564/uploads/urunresimleri/buyuk/organik-pembe-domates-500-gr-8-4f81.jpg' },
        { name: 'Taze Salatalık', price: 8.50, quantity: 1, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop' }
      ]
    },
    {
      id: 'ORD-002',
      date: '10 Mart 2024',
      status: 'Kargoda',
      total: 156.75,
      items: 5,
      products: [
        { name: 'Organik Havuç', price: 6.99, quantity: 3, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop' },
        { name: 'Taze Soğan', price: 4.25, quantity: 2, image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop' }
      ]
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: 'mdi:account' },
    { id: 'orders', label: 'Siparişlerim', icon: 'mdi:package-variant' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircleSpinner size={60} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Profil verileri yükleniyor...</p>
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

  const totalSpent = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'PROCESSING':
        return 'İşleniyor';
      case 'SHIPPED':
        return 'Kargoda';
      case 'DELIVERED':
        return 'Teslim Edildi';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profilim</h1>
          <p className="text-text-secondary">Hesap bilgilerinizi yönetin</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-6 py-4 text-left transition-all duration-300 rounded-2xl ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-grey-50 hover:text-text-primary'
                    }`}
                  >
                    <Icon icon={tab.icon} className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white mx-auto mb-6 text-2xl font-bold">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{fullName || 'Kullanıcı'}</h2>
                <p className="text-text-secondary text-sm mb-6">{formatPhoneTR(user?.phone)}</p>
                <div className="flex justify-center space-x-6 text-sm text-text-secondary">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">{orders.length}</p>
                    <p className="font-medium">Sipariş</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">{totalSpent.toFixed(2)}₺</p>
                    <p className="font-medium">Harcama</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-8">Profil Bilgileri</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Ad Soyad</label>
                    <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-4 py-3 bg-grey-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Adres</label>
                    <textarea value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full px-4 py-3 bg-grey-50 border border-gray-200 rounded-2xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={onSave} className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary-dark">Kaydet</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6">Siparişlerim</h2>
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-grey-100 flex items-center justify-center mb-4">
                      <Icon icon="mdi:package-variant" className="w-8 h-8 text-grey-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Henüz siparişiniz yok</h3>
                    <p className="text-text-secondary">İlk siparişinizi vermek için ürünleri keşfedin.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {orders.map((order:any) => (
                    <div key={order.id} className="bg-grey-50 rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="p-4 hover:bg-grey-100 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-3 sm:mb-0">
                            <h3 className="text-lg font-semibold text-text-primary">Sipariş #{order.id.slice(0,8)}</h3>
                            <p className="text-text-secondary text-sm">{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-text-primary">{Number(order.total || 0).toFixed(2)}₺</p>
                              <p className="text-text-secondary text-sm">{order.items.length} ürün</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <button 
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="px-4 py-2 bg-white text-text-secondary rounded-xl hover:bg-grey-50 transition-all duration-300 text-sm font-medium border border-gray-200 flex items-center space-x-2"
                            >
                              <span>Detay</span>
                              <Icon 
                                icon={expandedOrder === order.id ? "mdi:chevron-up" : "mdi:chevron-down"} 
                                className="w-4 h-4" 
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {expandedOrder === order.id && (
                        <div className="border-t border-gray-200 p-4 bg-white">
                          <h4 className="text-sm font-semibold text-text-primary mb-3">Sipariş Detayları</h4>
                          <div className="space-y-3">
                            {order.items.map((it:any) => (
                              <div key={it.id} className="flex items-center space-x-3 p-3 bg-grey-50 rounded-xl">
                                <img
                                  src={it.product?.imageUrl || ''}
                                  alt={it.product?.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-text-primary">{it.product?.name}</h5>
                                  <p className="text-xs text-text-secondary">Miktar: {it.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-text-primary">₺{(it.product?.price||0).toFixed(2)}</p>
                                  <p className="text-xs text-text-secondary">Toplam: ₺{((it.product?.price||0)*it.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;