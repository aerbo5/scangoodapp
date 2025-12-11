# 🔍 Ürün Tarama Sorunu - Debug Rehberi

## ❌ Sorun
Ürün resmi çekildi ama hiçbir şey olmadı.

## ✅ Adım 1: Browser Console'u Kontrol Edin

1. **Tarayıcıda F12** tuşuna basın (Developer Tools)
2. **Console** sekmesine gidin
3. Ürün resmini tekrar çekin
4. Console'da şu mesajları arayın:

### ✅ Başarılı Durumda Görmeniz Gerekenler:
```
🌐 API Base URL: https://scangoodapp.up.railway.app/api
🌐 API Request: POST https://scangoodapp.up.railway.app/api/scan/product
📸 Processing image, size: XXXXX bytes
✅ API Response: 200 /scan/product
📱 Frontend - Scan Product Response: {...}
```

### ❌ Hata Durumunda Görmeniz Gerekenler:
```
❌ API Response Error: ...
❌ Error scanning product: ...
❌ Backend returned HTML instead of JSON!
❌ Network Error
```

**Console'da ne görüyorsunuz?** Hata mesajını paylaşın.

---

## ✅ Adım 2: Network Tab'ını Kontrol Edin

1. **F12** → **Network** sekmesine gidin
2. Ürün resmini tekrar çekin
3. `/api/scan/product` isteğini bulun
4. İsteğe tıklayın ve şunları kontrol edin:

### Request (İstek):
- **URL**: `https://scangoodapp.up.railway.app/api/scan/product`
- **Method**: `POST`
- **Status**: `200` (başarılı) veya `4xx/5xx` (hata)

### Response (Yanıt):
- **Status Code**: `200` olmalı
- **Response Body**: JSON formatında olmalı
- Eğer HTML dönüyorsa → Backend çalışmıyor demektir

**Network tab'ında ne görüyorsunuz?** Status code ve response'u paylaşın.

---

## ✅ Adım 3: Backend Loglarını Kontrol Edin

1. **Railway Dashboard** → Backend servisi → **Deployments** → **Logs**
2. Ürün resmini tekrar çekin
3. Loglarda şunları arayın:

### ✅ Başarılı Durumda:
```
📸 Processing image, size: XXXXX bytes
🔍 Step 1: Trying barcode detection...
✅ Product found by barcode: ...
VEYA
🔍 Step 2a: Trying AI-powered product recognition (Gemini Vision)...
✅ AI identified product: ...
```

### ❌ Hata Durumunda:
```
Error scanning product: ...
Error: Cannot find module...
Error: Vision API not configured
```

**Railway loglarında ne görüyorsunuz?** Hata mesajını paylaşın.

---

## ✅ Adım 4: Environment Variables Kontrol Edin

Backend'in çalışması için **en az bir Vision API** gerekli:

1. **Railway Dashboard** → Backend servisi → **Variables**

2. Şunlardan **en az birini** ekleyin:

### Azure Computer Vision (Önerilen):
```
AZURE_COMPUTER_VISION_KEY=your-key
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
```

### VEYA Google Cloud Vision:
```
GOOGLE_CLOUD_VISION_API_KEY=your-key
```

### VEYA Google Gemini Vision:
```
GOOGLE_GEMINI_API_KEY=your-key
```

**Environment variables ekli mi?** Kontrol edin.

---

## ✅ Adım 5: CORS Kontrolü

Backend CORS ayarları doğru mu kontrol edin:

1. **Browser Console**'da şu hatayı görüyorsanız:
```
Access to XMLHttpRequest ... has been blocked by CORS policy
```

2. **Çözüm**: Backend'de CORS ayarlarını kontrol edin
   - `backend/server.js` dosyasında CORS origin listesine frontend URL'i eklenmeli

---

## 🔧 Hızlı Test

Backend'in çalıştığını test etmek için:

1. Tarayıcıda şu URL'i açın:
   ```
   https://scangoodapp.up.railway.app/api/health
   ```

2. Beklenen cevap:
   ```json
   {
     "status": "ok",
     "message": "Scan Good API is running"
   }
   ```

3. Eğer HTML veya 502 hatası alıyorsanız → Backend çalışmıyor

---

## 📝 Özet Checklist

- [ ] Browser Console'da hata var mı?
- [ ] Network tab'ında `/api/scan/product` isteği var mı?
- [ ] Network tab'ında status code nedir? (200 olmalı)
- [ ] Railway loglarında hata var mı?
- [ ] Environment variables (Vision API key'leri) ekli mi?
- [ ] `/api/health` endpoint'i çalışıyor mu?

---

## 🆘 Hâlâ Çalışmıyorsa

Lütfen şunları paylaşın:
1. Browser Console'daki hata mesajı
2. Network tab'ındaki request/response detayları
3. Railway loglarındaki hata mesajı
4. Environment variables listesi (key isimleri, değerler değil)

