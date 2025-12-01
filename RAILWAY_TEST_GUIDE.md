# 🔍 Railway Backend Test Rehberi

## ❌ Sorun: Resim çekince hiçbir şey olmuyor

## ✅ Adım 1: Railway Backend URL'ini Bulun

1. **Railway Dashboard**: https://railway.app
2. Projenize tıklayın
3. Backend service'inize tıklayın
4. **Settings** > **Networking** bölümüne gidin
5. **Domain** URL'ini kopyalayın (örn: `https://scan-good-backend-production.up.railway.app`)

## ✅ Adım 2: Backend'in Çalıştığını Test Edin

### Tarayıcıda Test:

Backend URL'inizi tarayıcıda açın:
```
https://your-backend.railway.app/api/health
```

**Beklenen cevap:**
```json
{
  "status": "ok",
  "message": "Scan Good API is running"
}
```

**Eğer hata alıyorsanız:**
- Backend deploy edilmemiş olabilir
- Railway loglarını kontrol edin

## ✅ Adım 3: Railway Loglarını Kontrol Edin

1. **Railway Dashboard** > Backend service'inize gidin
2. **Deployments** sekmesine tıklayın
3. **En son deploy**'u açın
4. **View Logs** veya **Logs** sekmesine tıklayın

### Kontrol Edilecek Mesajlar:

**Backend başladığında:**
```
🚀 Scan Good Backend API running on http://localhost:3001
```

**Vision API için (en az birini görmelisiniz):**
```
✅ Azure Computer Vision initialized (5,000 free requests/month)
```
VEYA
```
✅ Google Cloud Vision initialized with API key (REST API)
```
VEYA
```
✅ Google Gemini Vision API initialized (AI-powered product recognition)
```

**Eğer şunu görüyorsanız, Vision API çalışmıyor:**
```
ℹ️  No Vision API configured
⚠️  Google Vision API key not configured - OCR will not work
```

## ✅ Adım 4: Frontend'te API URL'ini Kontrol Edin

### Mobile App (Expo) için:

`src/services/apiService.js` dosyasını kontrol edin. Backend URL'i doğru mu?

**Local test için:**
- Eğer local backend kullanıyorsanız, ngrok URL'i güncel olmalı

**Production için:**
- Railway backend URL'i kullanılmalı

### Web App (Netlify) için:

1. **Netlify Dashboard**: https://app.netlify.com
2. Site Settings > **Environment variables** bölümüne gidin
3. `REACT_APP_API_URL` değişkenini kontrol edin
4. Değer şu formatta olmalı:
   ```
   https://your-backend.railway.app/api
   ```
   ⚠️ **ÖNEMLİ:** URL'in sonunda `/api` olmalı!

## ✅ Adım 5: Browser Console'u Kontrol Edin

1. Web uygulamasını açın
2. **F12** tuşuna basın (Developer Tools)
3. **Console** sekmesine gidin
4. **Network** sekmesine gidin
5. Bir resim çekmeyi deneyin
6. Console'da hata var mı kontrol edin
7. Network sekmesinde API isteği görünüyor mu?

### Beklenen:
- API isteği gönderilmeli: `POST /api/scan/receipt` veya `/api/scan/product`
- İstek başarılı olmalı (200 status)
- Response dönmeli

### Sorun Varsa:
- **CORS hatası**: Backend CORS ayarlarını kontrol edin
- **404 hatası**: API URL yanlış olabilir
- **500 hatası**: Backend'de hata var, Railway loglarını kontrol edin
- **Network error**: Backend çalışmıyor olabilir

## ✅ Adım 6: Railway Loglarında API İsteklerini Kontrol Edin

Resim çektikten sonra:

1. **Railway Dashboard** > Backend service > **Logs** sekmesine gidin
2. **Real-time logs** açık olmalı
3. Resim çektiğinizde şu logları görmelisiniz:

**Receipt scan için:**
```
🧾 Receipt scan request received
📸 Extracting text from receipt image...
🔍 Starting OCR extraction...
```

**Product scan için:**
```
📸 Processing image, size: 123456 bytes
🔍 Step 1: Trying barcode detection...
```

**Eğer hiçbir log görünmüyorsa:**
- Frontend backend'e istek göndermiyor
- API URL yanlış olabilir
- CORS hatası olabilir

## 🐛 Sorun Giderme

### Sorun 1: Backend health check çalışmıyor

**Çözüm:**
- Railway'da deploy durumunu kontrol edin
- Deploy başarılı mı?
- Loglarında hata var mı?

### Sorun 2: Vision API initialized mesajı yok

**Çözüm:**
- Railway'da environment variables eklenmiş mi?
- API key'ler doğru mu?
- Deploy yeniden başlatıldı mı?

### Sorun 3: Frontend'ten istek gitmiyor

**Çözüm:**
- Browser console'da hata var mı?
- API URL doğru mu?
- Network sekmesinde istek görünüyor mu?

### Sorun 4: API isteği gidiyor ama hata dönüyor

**Çözüm:**
- Railway loglarında hata var mı?
- API key'ler doğru mu?
- CORS hatası var mı?

## 📋 Kontrol Listesi

- [ ] Railway backend URL'i bulundu
- [ ] Backend health check çalışıyor (`/api/health`)
- [ ] Railway loglarında "Vision API initialized" mesajı var
- [ ] Frontend'te API URL doğru
- [ ] Browser console'da hata yok
- [ ] Network sekmesinde API isteği görünüyor
- [ ] Railway loglarında API istekleri görünüyor
- [ ] Resim çekince sonuç geliyor

## 🎯 Hızlı Test

1. **Backend URL'ini tarayıcıda açın:**
   ```
   https://your-backend.railway.app/api/health
   ```

2. **Railway loglarını açın** (real-time)

3. **Web uygulamasında resim çekin**

4. **Railway loglarında şunu görmelisiniz:**
   ```
   🧾 Receipt scan request received
   📸 Extracting text from receipt image...
   ```

5. **Eğer log görünmüyorsa:**
   - Frontend backend'e bağlanamıyor
   - API URL yanlış olabilir
   - Browser console'u kontrol edin

## 💡 İpucu

Railway loglarını **real-time** olarak izlemek için:
- Railway Dashboard > Backend service > **Logs** sekmesi
- Loglar otomatik olarak güncellenir
- Resim çektiğinizde anında logları görebilirsiniz

