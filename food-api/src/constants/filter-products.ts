import fs from "fs";
import path from "path";

const OUTPUT_PATH = path.resolve("output.json");

const tobaccoKeywords = [
    "sigara", "tütün", "puro", "nargile", "vape", "nikotin", "tutun", "duhan", "tobacco",
    "heets", "iqos", "glo", "vuse", "vype", "vapor", "hookah",
    "marlboro", "kent", "winston", "camel", "parliament", "pall mall", "pallmall",
    "chesterfield", "gauloises", "superkings", "mayfair", "richmond", "rotman"
].map(k => k.toLowerCase());

// Kategori eşleşmeleri
const categoryMap = [
    { category: "Kozmetik & Parfüm", keywords: ["kolonya", "parfüm", "parfum", "edt", "edp", "eau de parfum", "eau de toilette", "koku"] },
    { category: "Kişisel Bakım", keywords: ["sabun", "şampuan", "duş jeli", "tıraş", "traş", "deodorant", "vücut losyonu", "diş macunu", "diş fırçası", "kulak çubuğu", "krem", "maske"] },
    { category: "Temizlik Ürünleri", keywords: ["çamaşır suyu", "deterjan", "bulaşık", "temizlik", "dezenfektan", "temizleyici", "süpürge", "mop", "mikrofiber", "lavabo"] },
    { category: "Temel Gıda", keywords: ["süt", "yumurta", "peynir", "zeytin", "ekmek", "un", "şeker", "yağ", "pirinç", "makarna", "konserve", "reçel", "bal", "pekmez", "tuz"] },
    { category: "Atıştırmalık & Tatlı", keywords: ["bisküvi", "çikolata", "kraker", "kek", "kuruyemiş", "lokum", "gofret", "kraker", "çerez", "bar"] },
    { category: "İçecekler", keywords: ["su", "cola", "gazlı", "limonata", "soda", "meyve suyu", "ice tea", "çay", "kahve", "enerji içecek"] },
    { category: "Bebek & Çocuk", keywords: ["bebek", "mama", "bebelac", "aptamil", "biberon", "emzik", "bez", "ıslak mendil", "bebek bezi"] },
    { category: "Evcil Hayvan Ürünleri", keywords: ["kedi maması", "köpek maması", "kedi", "köpek", "pet", "kedi maması", "köpek maması", "kafes", "kedi kumu"] },
    { category: "Giyim & Aksesuar", keywords: ["terlik", "ayakkabı", "çorap", "gömlek", "pantolon", "tshirt", "etek", "elbise", "mont", "şapka", "çanta", "kemer"] },
    { category: "Elektronik & Aksesuar", keywords: ["telefon", "usb", "şarj", "kablo", "kulaklık", "powerbank", "laptop", "bilgisayar", "adaptör", "şarj aleti", "iphone", "android"] },
    { category: "Mutfak & Sofra", keywords: ["tencere", "tabak", "kaşık", "çatal", "bıçak", "kupa", "bardak", "tava", "mutfak", "baharatlık", "saklama kabı", "render", "rende"] },
    { category: "Ev Aletleri", keywords: ["fırın", "mikrodalga", "ütü", "süpürge", "aspiratör", "çamaşır makinesi", "buzdolabı", "klima"] },
    { category: "Ev & Dekorasyon", keywords: ["masa", "sandalye", "dolap", "raf", "sehpa", "mobilya", "halı", "perde", "yastık", "battaniye", "nevresim", "saksı"] },
    { category: "Kırtasiye & Ofis", keywords: ["kalem", "defter", "kağıt", "dosya", "yapıştırıcı", "zımba", "ofis", "etiket", "mühür"] },
    { category: "Oto & Araç", keywords: ["araba", "araç", "yağ", "cam suyu", "antifriz", "oto", "lastik", "akü", "oto yedek"] },
    { category: "Oyuncak & Hobi", keywords: ["oyuncak", "lego", "puzzle", "top", "oyun hamuru", "hobi", "model"] },
    { category: "Sağlık & Medikal", keywords: ["ilaç", "vitamin", "takviye", "bandaj", "şurup", "ağrı kesici", "plaster", "medikal"] },
    { category: "Çanta & Seyahat", keywords: ["çanta", "valiz", "bavul", "sırt çantası", "cüzdan"] },
    { category: "Bahçe & Bahçe Ürünleri", keywords: ["çiçek", "tohum", "bitki", "toprak", "bahçe", "saksı", "gübre"] },
    { category: "Aksesuarlar & Küçük Eşyalar", keywords: ["çakmak", "kül tabak", "küllük", "anahtarlık", "kupa"] },
    { category: "Spor & Dış Mekan", keywords: ["bisiklet", "spor", "top", "fitness", "yoga", "koşu"] },
    { category: "Bakım & Onarım (DIY)", keywords: ["vida", "matkap", "alet", "tamir", "hırdavat", "tornavida", "çekiç", "lehim"] },
    { category: "Diğer Ürünler", keywords: [] } // Son çare
];


// 🔍 Tütün kontrolü
function isTobacco(title = "") {
    if (!title) return false;
    const lower = title.toLowerCase();
    // check word-boundary for each tobacco keyword
    for (const kw of tobaccoKeywords) {
        const re = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i");
        if (re.test(lower)) return true;
    }
    // ayrıca "sigara" gibi parçaları içeriyorsa da al
    if (/\bsigara\b|\btütün\b|\bpuro\b|\bnargile\b|\bvape\b|\bnikotin\b/i.test(lower)) return true;
    return false;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function tokenize(title = "") {
    return title
        .toLowerCase()
        .replace(/[\u2000-\u206F\u2E00-\u2E7F'".,()\/\-+&]/g, " ") // noktalama temizle
        .split(/\s+/)
        .filter(Boolean);
}
// 🧩 Kategorize etme
function categorizeTitle(title = "") {
    const tokens = tokenize(title);
    const lower = title.toLowerCase();

    const scores = new Map();
    for (const { category, keywords } of categoryMap) {
        let score = 0;
        for (const kw of keywords) {
            // multi-word keyword match (contains)
            if (lower.includes(kw)) score += 3;
            // token match (exact word)
            if (tokens.includes(kw)) score += 2;
            // partial match (startsWith)
            if (tokens.some(t => t.startsWith(kw) && kw.length > 2)) score += 1;
        }
        scores.set(category, score);
    }

    // ölçü birimi heuristikleri
    if (/\b(ml|lt|l|cl)\b/.test(lower)) {
        scores.set("İçecekler", (scores.get("İçecekler") || 0) + 4);
    }
    if (/\b(gr|g|kg|kg\.)\b/.test(lower)) {
        scores.set("Temel Gıda", (scores.get("Temel Gıda") || 0) + 3);
    }
    if (/\b(adet|pk|pack|package)\b/.test(lower)) {
        // paket ürünü -> mutfak/market veya aksesuar olabilir, küçük artış ver
        scores.set("Mutfak & Sofra", (scores.get("Mutfak & Sofra") || 0) + 1);
        scores.set("Atıştırmalık & Tatlı", (scores.get("Atıştırmalık & Tatlı") || 0) + 1);
    }
    // marka heuristikleri (bazı markalar kategori göstergesi olabilir)
    if (/\bbebelac\b|\baptamil\b|\bbiberon\b/.test(lower)) {
        scores.set("Bebek & Çocuk", (scores.get("Bebek & Çocuk") || 0) + 5);
    }
    if (/\bkolonya\b|\bparfüm\b|\bedp\b|\bedt\b/.test(lower)) {
        scores.set("Kozmetik & Parfüm", (scores.get("Kozmetik & Parfüm") || 0) + 4);
    }

    // seç tıpkı max score
    let bestCategory = "Diğer Ürünler";
    let bestScore = -1;
    for (const [cat, sc] of scores.entries()) {
        if (sc > bestScore) {
            bestScore = sc;
            bestCategory = cat;
        }
    }

    // eğer hiçbir kategori 0'dan büyük değilse — fallback heuristikleri
    if (bestScore <= 0) {
        // örnek: başlıkta 'kolonya' kelimesi olmasa dahi 'ML/LT' varsa İçecek olabilir
        if (/\b(ml|lt|l)\b/.test(lower)) return "İçecekler";
        if (/\b(gr|g|kg)\b/.test(lower)) return "Temel Gıda";
        if (/\b(telefon|usb|şarj|kablo|kulaklık|powerbank)\b/.test(lower)) return "Elektronik & Aksesuar";
        if (/\b(şampuan|sabun|duş)\b/.test(lower)) return "Kişisel Bakım";
        return "Diğer Ürünler";
    }

    return bestCategory;
}


interface ProductData {
    id: number;
    title: string;
    price: number;
    isActive: boolean;
}

interface CategoryData {
    categoryName: string;
    products: ProductData[];
}

export default function filterProducts(products: ProductData[]): CategoryData[] {
    const categories: { [key: string]: ProductData[] } = {};
    const removed: any[] = [];

    for (const item of products) {
        const title = item.title || "";

        if (isTobacco(title)) {
            removed.push({ ...item, removed_reason: "tobacco_detected" });
            continue;
        }

        const cat = categorizeTitle(title);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(item);
    }

    const result: CategoryData[] = Object.entries(categories).map(([categoryName, products]) => ({
        categoryName,
        products: products as ProductData[],
    }));


    return result;

}

