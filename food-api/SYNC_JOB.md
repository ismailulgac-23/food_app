# Ürün Senkronizasyon Sistemi

## Genel Bakış

Bu sistem, SQL Server'dan ürünleri çekerek, filtreleyerek, kategorize ederek ve PostgreSQL veritabanına senkronize eden otomatik bir cron job sistemidir.

## Özellikler

### 1. Ürün Çekme (products-sync.ts)
- SQL Server'dan aktif ürünleri çeker
- Fiyatlı (hem alış hem satış fiyatı olan) ürünleri filtreler
- Yaklaşık 6K ürün çeker

### 2. Filtreleme ve Kategorileştirme
- Tütün ve yasaklı ürünleri filtreler
- Ürünleri otomatik olarak kategorilere ayırır:
  - Kozmetik & Parfüm
  - Kişisel Bakım
  - Temizlik Ürünleri
  - Gıda & Market
  - İçecek & Dondurma
  - Giyim & Aksesuar
  - Elektronik & Aksesuar
  - Mutfak & Ev Eşyası
  - Evcil Hayvan Ürünleri
  - Sofra & Porselen
  - Aksesuarlar
  - Uncategorized

### 3. Veritabanı Senkronizasyonu
- **Kategoriler**: Eğer kategori yoksa otomatik oluşturur
- **Ürünler**: 
  - Ürün varsa: Fiyat ve isim günceller
  - Ürün yoksa: Yeni ürün oluşturur
  - Resim yoksa: Google'dan resim çeker ve ekler

### 4. Resim İndirme
- Ürünler için eksik resimleri Google'dan arar
- İlk bulduğu resmi ekler
- Resim bulunamazsa null olarak kaydeder

## Kullanım

### Otomatik Cron Job
Sistem her gün gece yarısı otomatik olarak çalışır:
```bash
# Cron pattern: 0 0 * * * (her gün gece yarısı)
```

### Manuel Test
Test için sync fonksiyonunu manuel olarak çalıştırabilirsiniz:
```bash
npm run test:sync
```

### Geliştirme Modunda
Tüm cron job'ları çalıştırmak için:
```bash
npm run dev
```

## Dosya Yapısı

```
food-api/src/
├── crons/
│   ├── index.ts              # Cron job yönetimi
│   ├── products-sync.ts       # Ana sync fonksiyonu
│   └── test-sync.ts          # Test scripti
├── constants/
│   └── filter-products.ts    # Filtreleme ve kategorileştirme
└── public/
    └── products.json         # Yedekleme dosyası
```

## Veri Akışı

1. **SQL Server'dan Çekme**: Aktif ürünleri çeker
2. **Filtreleme**: Tütün ve yasaklı ürünleri kaldırır
3. **Kategorize Etme**: Ürünleri kategorilere ayırır
4. **Database Kontrolü**: Kategorileri ve ürünleri kontrol eder
5. **Güncelleme/Oluşturma**: Eksikleri ekler, var olanları günceller
6. **Resim Ekleme**: Eksik resimleri Google'dan indirir
7. **Yedekleme**: JSON dosyasına kaydeder

## Ayarlar

### SQL Server Bağlantı Bilgileri
`src/crons/products-sync.ts` dosyasında bulunur:
```typescript
const config = {
    user: "UYMAR",
    password: "uymar_2424",
    server: "88.247.153.121",
    port: 51433,
    database: "ERP12",
    ...
};
```

### Yasaklı Kelimeler
`src/constants/filter-products.ts` dosyasında tanımlıdır:
- sigara, tütün, puro, nargile, vape, nikotin, vb.

## Performans

- **Ortalama Süre**: Sistem ~6000 ürünü işler
- **Resim İndirme**: Her ürün için ~1-2 saniye
- **Toplam Süre**: Yaklaşık 1-2 saat (ilk çalıştırma)
- **Güncelleme**: Var olan ürünler için daha hızlı

## Loglama

Sistem detaylı loglar üretir:
- ✅ Başarılı işlemler
- ❌ Hatalar
- 📊 İlerleme bilgisi
- 📦 Kategori bilgisi
- 🔍 Resim arama durumu

## Notlar

- Sistem ilk çalıştırmada tüm ürünleri indirir
- Sonraki çalışmalarda sadece güncellemeler yapar
- Resimler Google'dan çekildiği için bazı resimler eksik olabilir
- JSON yedek dosyası `src/public/products.json` adresinde tutulur

