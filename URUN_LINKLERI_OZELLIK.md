# Ürün Linklerini Bulma Özelliği - Kullanım Kılavuzu

## 🎯 Özellik
Kamera ile ürün resmi çekip, internetten direkt ürün linklerini bulma (Amazon, Target, Walmart, Google Shopping).

## ✅ Nasıl Çalışır?

1. **Kamera ile Ürün Çekin**: Avokado, Coca Cola kutusu, vb.
2. **Google Vision API**: Ürünü tanır (ör: "Avocado", "Coca Cola")
3. **Google Custom Search API**: Internetten ürün linklerini bulur
4. **Sonuçlar**: Amazon, Target, Walmart, Google Shopping linkleri

## 📱 Kullanım

### Frontend'te:
```javascript
// Ürün resmi çek
const response = await scanProduct(imageUri);

// Sonuçlar:
{
  success: true,
  product: {
    name: "Avocado",
    stores: [...]
  },
  labelsDetected: ["Avocado", "Food", "Produce"],
  productLinks: [
    {
      title: "Avocado - Target",
      link: "https://www.target.com/p/avocado/-/A-123456",
      snippet: "Fresh avocado, each",
      source: "Target"
    },
    {
      title: "Avocado - Amazon Fresh",
      link: "https://www.amazon.com/avocado/dp/B08XXXXXXX",
      snippet: "Organic avocado, 1 each",
      source: "Amazon"
    }
  ]
}
```

## 🔧 Kurulum

### 1. Google Custom Search API Key Alın

Detaylı kurulum için: `backend/GOOGLE_SEARCH_SETUP.md` dosyasına bakın.

**Hızlı Özet:**
1. Google Cloud Console'da **Custom Search API**'yi etkinleştirin
2. https://programmablesearchengine.google.com/ adresinde search engine oluşturun
3. API key ve Search Engine ID'yi alın

### 2. Backend'e Ekleyin

`backend/.env` dosyasına:
```env
GOOGLE_CUSTOM_SEARCH_API_KEY=YOUR_API_KEY
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=YOUR_SEARCH_ENGINE_ID
```

### 3. Backend'i Yeniden Başlatın

```bash
cd backend
npm start
```

## 🎯 Örnekler

### Avokado Çektiğinizde:
- ✅ Google Vision API: "Avocado" tanır
- ✅ Google Custom Search: Amazon, Target, Walmart linklerini bulur
- ✅ Kullanıcı direkt ürün sayfalarına gidebilir

### Coca Cola Kutusu Çektiğinizde:
- ✅ Google Vision API: "Coca Cola", "Soft Drink" tanır
- ✅ Google Custom Search: Online satış linklerini bulur
- ✅ Kullanıcı direkt satın alabilir

## 📝 Notlar

- **Ücretsiz Plan**: Günlük 100 sorgu (Google Custom Search API)
- **Fallback**: API yapılandırılmamışsa dummy linkler döner
- **Sonuçlar**: Amazon, Target, Walmart, Google Shopping linkleri

## 🚀 Sonuç

Artık:
- ✅ Kamera ile ürün çekebilirsiniz
- ✅ Internetten ürün linklerini bulabilirsiniz
- ✅ Kullanıcılar direkt satın alabilir!


