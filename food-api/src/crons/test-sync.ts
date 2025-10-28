import syncProducts from './products-sync';

// Manual test için sync çalıştır
async function testSync() {
    console.log('🧪 Test senkronizasyonu başlatılıyor...');
    
    try {
        await syncProducts();
        console.log('\n✅ Test başarılı!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test başarısız:', error);
        process.exit(1);
    }
}

testSync();

