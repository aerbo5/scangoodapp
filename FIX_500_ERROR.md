# 🔧 Backend 500 Hatası Çözümü

## ❌ Sorun
```
POST https://scangoodapp-production.up.railway.app/api/scan/product 
net::ERR_FAILED 500 (Internal Server Error)
```

## ✅ Adım 1: Railway Loglarını Kontrol Edin

1. **Railway Dashboard** → Backend servisi → **Deployments** → **Logs**
2. Ürün resmini tekrar çekin
3. Loglarda şu hataları arayın:

### Olası Hatalar:

#### 1. Vision API Key Eksik:
```
Error: Vision API not configured
⚠️ Google Vision API key not configured - OCR will not work
```

**Çözüm**: Railway → Backend servisi → **Variables** → Vision API key'lerinden birini ekleyin:
- `AZURE_COMPUTER_VISION_KEY` + `AZURE_COMPUTER_VISION_ENDPOINT`
- VEYA `GOOGLE_CLOUD_VISION_API_KEY`
- VEYA `GOOGLE_GEMINI_API_KEY`

#### 2. Image Processing Hatası:
```
Error: Cannot read property 'buffer' of undefined
Error: Invalid image format
```

**Çözüm**: Image upload formatını kontrol edin.

#### 3. Module Not Found:
```
Error: Cannot find module 'xxx'
```

**Çözüm**: `npm install` çalıştırın veya Railway'da redeploy yapın.

#### 4. API Rate Limit:
```
Error: API quota exceeded
Error: 429 Too Many Requests
```

**Çözüm**: API limit'ini kontrol edin veya başka bir API key kullanın.

---

## ✅ Adım 2: Environment Variables Kontrol Edin

Railway → Backend servisi → **Variables** sekmesinde şunlar olmalı:

### Minimum Gerekli (Backend başlaması için):
```
PORT=3001 (veya Railway otomatik set eder)
NODE_ENV=production
```

### Vision API (En az birini ekleyin):

**Azure Computer Vision:**
```
AZURE_COMPUTER_VISION_KEY=your-key
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
```

**VEYA Google Cloud Vision:**
```
GOOGLE_CLOUD_VISION_API_KEY=your-key
```

**VEYA Google Gemini:**
```
GOOGLE_GEMINI_API_KEY=your-key
```

### Product Search (Opsiyonel ama önerilen):
```
GOOGLE_CUSTOM_SEARCH_API_KEY=your-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-engine-id
```

---

## ✅ Adım 3: Frontend Cache'i Temizleyin

Frontend hala eski URL'i (`scangoodapp-production`) kullanıyor. Çözüm:

### Vercel'de:
1. **Vercel Dashboard** → Projeniz → **Deployments**
2. **Redeploy** yapın (en son commit'i yeniden deploy edin)

### Local'de:
1. Browser cache'i temizleyin (Ctrl+Shift+Delete)
2. Hard refresh yapın (Ctrl+Shift+R)
3. Veya Incognito/Private mode'da test edin

---

## ✅ Adım 4: Backend'i Test Edin

1. Tarayıcıda test edin:
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

3. Environment variables kontrolü:
   ```
   https://scangoodapp.up.railway.app/api/debug/env
   ```

4. Beklenen cevap:
   ```json
   {
     "success": true,
     "environment": {
       "azureVision": { "configured": true/false },
       "googleCloudVision": { "configured": true/false },
       "geminiVision": { "configured": true/false },
       ...
     }
   }
   ```

**En az bir Vision API `configured: true` olmalı!**

---

## 🔍 Debug Endpoint'i Kullanın

Backend'e debug endpoint'i ekledim. Railway loglarında şunları göreceksiniz:

```
❌ Error scanning product: ...
❌ Error stack: ...
❌ Error details: { message: ..., name: ..., code: ... }
```

Bu loglar hatanın tam nedenini gösterecek.

---

## 📝 Özet Checklist

- [ ] Railway loglarında hata mesajı var mı?
- [ ] Environment variables (Vision API key'leri) ekli mi?
- [ ] `/api/health` endpoint'i çalışıyor mu?
- [ ] `/api/debug/env` endpoint'inde en az bir Vision API `configured: true` mu?
- [ ] Frontend cache temizlendi mi veya redeploy edildi mi?
- [ ] Frontend doğru URL'i kullanıyor mu? (`scangoodapp.up.railway.app`)

---

## 🆘 Hâlâ Çalışmıyorsa

Lütfen şunları paylaşın:
1. Railway loglarındaki tam hata mesajı (error stack dahil)
2. `/api/debug/env` endpoint'inin cevabı
3. Environment variables listesi (key isimleri, değerler değil)

