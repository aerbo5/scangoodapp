# Google Custom Search API Kurulumu - Ürün Linklerini Bulma

## 🎯 Amaç
Kamera ile ürün resmi çekip, internetten direkt ürün linklerini bulmak (Amazon, Target, Walmart, Google Shopping).

## ✅ Adım 1: Google Custom Search API Key Alın

### 1. Google Cloud Console'a Gidin
https://console.cloud.google.com/

### 2. Proje Oluşturun veya Seçin
- Mevcut projeyi kullanabilirsiniz (Vision API için kullandığınız proje)

### 3. Custom Search API'yi Etkinleştirin
1. **"APIs & Services" > "Library"** bölümüne gidin
2. **"Custom Search API"** araması yapın
3. **"Custom Search API"**'yi seçin
4. **"Enable"** butonuna tıklayın

### 4. Custom Search Engine Oluşturun
1. https://programmablesearchengine.google.com/ adresine gidin
2. **"Add"** butonuna tıklayın
3. **Search engine name**: "Scan Good Product Search"
4. **Sites to search**: Boş bırakın (tüm web'i aramak için)
5. **"Create"** tıklayın
6. **"Control Panel"** tıklayın
7. **"Setup"** sekmesine gidin
8. **"Search the entire web"** seçeneğini işaretleyin
9. **"Save"** tıklayın

### 5. API Key ve Search Engine ID Alın

#### API Key:
1. Google Cloud Console'da **"APIs & Services" > "Credentials"** bölümüne gidin
2. Mevcut API key'inizi kullanabilirsiniz (Vision API için kullandığınız)
3. Veya yeni bir API key oluşturun

#### Search Engine ID:
1. https://programmablesearchengine.google.com/ adresine gidin
2. Oluşturduğunuz search engine'e tıklayın
3. **"Setup"** sekmesinde **"Search engine ID"** görünecek
4. Bu ID'yi kopyalayın (örn: `012345678901234567890:abcdefghijk`)

## ✅ Adım 2: Backend'e API Key ve Search Engine ID Ekleyin

`backend/.env` dosyasına ekleyin:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_VISION_API_KEY
GOOGLE_CUSTOM_SEARCH_API_KEY=YOUR_CUSTOM_SEARCH_API_KEY
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=YOUR_SEARCH_ENGINE_ID
```

**Örnek:**
```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=012345678901234567890:abcdefghijk
```

## ✅ Adım 3: Backend'i Yeniden Başlatın

```bash
cd backend
npm start
```

## 🎯 Kullanım

### API Endpoint:
```
POST /api/scan/product
```

### Request:
- `image`: Ürün resmi (multipart/form-data)

### Response:
```json
{
  "success": true,
  "product": {
    "name": "Avocado",
    "size": "1 Each",
    "stores": [...]
  },
  "labelsDetected": ["Avocado", "Food", "Produce"],
  "productLinks": [
    {
      "title": "Avocado - Target",
      "link": "https://www.target.com/p/avocado/-/A-123456",
      "snippet": "Fresh avocado, each",
      "source": "Target"
    },
    {
      "title": "Avocado - Amazon Fresh",
      "link": "https://www.amazon.com/avocado/dp/B08XXXXXXX",
      "snippet": "Organic avocado, 1 each",
      "source": "Amazon"
    }
  ]
}
```

## 🔧 Sorun Giderme

### API Key Çalışmıyor
- API key doğru mu? (`.env` dosyasında)
- Custom Search API etkin mi? (Google Cloud Console'da)
- Search Engine ID doğru mu?

### Sonuç Bulunamıyor
- Search engine "Search the entire web" modunda mı?
- API quota aşıldı mı? (Günlük 100 sorgu ücretsiz)

## 📝 Notlar

- **Ücretsiz Plan**: Günlük 100 sorgu
- **Ücretli Plan**: Daha fazla sorgu için ödeme yapabilirsiniz
- **Fallback**: API yapılandırılmamışsa dummy linkler döner

## 🎯 Sonuç

Artık:
- ✅ Kamera ile ürün resmi çekebilirsiniz
- ✅ Google Vision API ile ürünü tanıyabilirsiniz
- ✅ Internetten ürün linklerini bulabilirsiniz (Amazon, Target, Walmart, Google Shopping)
- ✅ Kullanıcılar direkt ürün sayfalarına gidebilir!

