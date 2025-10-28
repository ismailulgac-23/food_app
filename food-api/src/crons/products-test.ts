const fs = require('fs');
const path = require('path');

// Test için basit bir products job
module.exports = async () => {
    try {
        console.log('📝 Test ürünleri oluşturuluyor...');
        
        // Test verisi
        const products = [
            { id: 1, title: 'Test Ürün 1', price: 10.50, isActive: true },
            { id: 2, title: 'Test Ürün 2', price: 25.00, isActive: true },
            { id: 3, title: 'Test Ürün 3', price: 15.75, isActive: true }
        ];

        // JSON dosyasına yaz
        const outputPath = path.join(__dirname, '../public/products.json');
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');

        console.log(`✅ ${products.length} test ürün products.json dosyasına yazıldı!`);
        console.log(`📁 Dosya yolu: ${outputPath}`);
        console.log(`📁 Dosya boyutu: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        
    } catch (err) {
        console.error('❌ Hata:', err.message);
    }
}
