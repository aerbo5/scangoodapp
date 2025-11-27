# 🔍 API Key Kontrol Rehberi

## ❌ Sorun: Hiçbir API Çalışmıyor

Loglarınızda şunu görüyorsunuz:
```
⚠️ All Gemini models failed
⚠️ No labels detected
⚠️ No product found
```

Bu, API key'lerinizin eksik veya yanlış olduğu anlamına gelir.

---

## ✅ Çözüm: API Key'leri Kontrol Edin

### 1. Backend `.env` Dosyasını Kontrol Edin

`backend/.env` dosyasını açın ve şu key'lerin olduğundan emin olun:

```env
# Google Vision API (OCR ve Label Detection için)
GOOGLE_CLOUD_VISION_API_KEY=AIzaSy...

# Google Gemini API (AI-powered recognition için - Opsiyonel)
GOOGLE_GEMINI_API_KEY=AIzaSy...

# Google Custom Search API (Ürün linkleri için)
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSy...
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=...

# Port
PORT=3001
```

### 2. API Key'lerin Doğru Olduğunu Kontrol Edin

#### Google Vision API Key Kontrolü:

Backend'i başlattığınızda şunu görmelisiniz:
```
✅ Google Cloud Vision initialized with API key (REST API)
```

Eğer görmüyorsanız, API key yanlış veya eksik.

#### Google Gemini API Key Kontrolü:

Backend'i başlattığınızda şunu görmelisiniz:
```
✅ Google Gemini Vision API initialized (AI-powered product recognition)
```

Eğer görmüyorsanız, API key yanlış veya eksik.

### 3. Test Endpoint'ini Kullanın

Backend çalışırken, bir test resmi gönderin:

```bash
curl -X POST http://localhost:3001/api/test/vision \
  -F "image=@test-image.jpg"
```

Bu size hangi API'lerin çalıştığını gösterecek.

---

## 🔧 Hızlı Düzeltme

### Google Vision API Key Eklemek:

1. **Google Cloud Console**'a gidin: https://console.cloud.google.com/
2. **APIs & Services** → **Library**
3. **"Cloud Vision API"** arayın ve **Enable** edin
4. **APIs & Services** → **Credentials**
5. **Create Credentials** → **API Key**
6. API key'i kopyalayın
7. `backend/.env` dosyasına ekleyin:
   ```env
   GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_HERE
   ```

### Google Gemini API Key Eklemek (Opsiyonel):

1. **Google AI Studio**'ya gidin: https://aistudio.google.com/
2. **Get API Key** → **Create API Key**
3. API key'i kopyalayın
4. `backend/.env` dosyasına ekleyin:
   ```env
   GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

---

## 🧪 Test

API key'leri ekledikten sonra:

1. **Backend'i yeniden başlatın:**
   ```bash
   cd backend
   npm start
   ```

2. **Bir ürün tarayın**

3. **Backend loglarında şunu görmelisiniz:**
   ```
   ✅ Google Cloud Vision initialized with API key (REST API)
   🔍 Step 2b: Trying OCR to extract text from product...
   📝 OCR Text extracted: ...
   ✅ Product name extracted from OCR: ...
   ```

---

## ⚠️ Notlar

- **Google Vision API** olmadan OCR ve Label Detection çalışmaz
- **Google Gemini API** olmadan AI-powered recognition çalışmaz (ama OCR/Vision API yeterli)
- **Google Custom Search API** olmadan ürün linkleri çalışmaz

**Minimum gereksinim:** En azından `GOOGLE_CLOUD_VISION_API_KEY` olmalı.

---

## 🔗 Kaynaklar

- **Google Cloud Console**: https://console.cloud.google.com/
- **Google AI Studio**: https://aistudio.google.com/
- **Vision API Setup**: `backend/ENABLE_VISION_API.md`
- **Gemini Setup**: `backend/GEMINI_VISION_SETUP.md`


