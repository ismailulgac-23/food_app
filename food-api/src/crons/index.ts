const cron = require('node-cron');

// Import sync function
import syncProducts from './products-sync';

// Her gün gece yarısı çalışacak cron job
cron.schedule('0 0 * * *', async () => {
    console.log('🕐 Cron job başlatılıyor - Products sync...');
    console.log('⏰ Zaman:', new Date().toLocaleString('tr-TR'));
    
    try {
        await syncProducts();
        console.log('✅ Products sync tamamlandı!');
    } catch (error) {
        console.error('❌ Cron job hatası:', error);
    }
    
    console.log('⏰ Sonraki çalışma zamanı:', new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('tr-TR'));
    console.log('---');
});

console.log('🚀 Cron job başlatıldı - Her gün gece yarısı products sync çalışacak');
console.log('📅 Cron pattern: 0 0 * * * (her gün gece yarısı)');
console.log('⏰ İlk çalışma zamanı:', new Date().toLocaleString('tr-TR'));
