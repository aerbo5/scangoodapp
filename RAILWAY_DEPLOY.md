# 🚂 Railway Backend Deploy Rehberi

## ✅ Hazırlık Tamamlandı
- ✅ `Procfile` eklendi (Railway için)
- ✅ GitHub'a push edildi

## 🚀 Railway Deploy Adımları

### 1. Railway'a Giriş
1. **Railway'a gidin**: https://railway.app
2. **"Login"** tıklayın (GitHub ile giriş yapın)
3. **"New Project"** tıklayın

### 2. GitHub Repo'yu Bağlayın
1. **"Deploy from GitHub repo"** seçin
2. Repo'nuzu seçin: `aerbo5/scangoodapp`
3. Railway otomatik olarak repo'yu bağlayacak

### 3. Backend Service Oluşturun
1. **"Add Service"** > **"GitHub Repo"** tıklayın
2. **Root Directory**: `backend` yazın
3. Railway otomatik olarak `backend` klasörünü deploy edecek

### 4. Environment Variables Ekleyin
**Settings** > **Variables** bölümüne gidin ve şunları ekleyin:

```env
PORT=3001
NODE_ENV=production

# Azure Computer Vision (OCR için - ÖNEMLİ!)
AZURE_COMPUTER_VISION_KEY=your-azure-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/

# Google Custom Search API (Market araştırması için - ÖNEMLİ!)
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyDKhrokFGquwnyQFyyCCNuqdxw42Q382W8
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=50d1476204abf4cd9

# Google Gemini API (Opsiyonel - AI ürün tanıma için)
GOOGLE_GEMINI_API_KEY=your-gemini-key-here
```

⚠️ **ÖNEMLİ**: `.env` dosyanızdaki değerleri buraya kopyalayın!

### 5. Domain Oluşturun
1. **Settings** > **Generate Domain** tıklayın
2. Railway size bir URL verecek (örn: `https://scan-good-backend-production.up.railway.app`)
3. **Bu URL'i kopyalayın!** (Frontend deploy için gerekli)

### 6. Deploy
1. Railway otomatik olarak deploy başlatacak
2. **Deployments** sekmesinde durumu izleyin
3. Deploy tamamlandığında backend çalışıyor olacak

### 7. Test Edin
Backend URL'ini tarayıcıda açın:
```
https://your-backend.railway.app/api/health
```

Şu cevabı görmelisiniz:
```json
{
  "status": "ok",
  "message": "Scan Good API is running"
}
```

---

## 🔧 Sorun Giderme

### Build Hatası?
- Railway artık `Procfile` kullanacak, `npm run build` çalıştırmayacak
- Eğer hala hata varsa, Railway loglarını kontrol edin

### Port Hatası?
- Railway otomatik olarak PORT environment variable'ını set eder
- Backend `process.env.PORT || 3001` kullanıyor, sorun olmamalı

### Environment Variables Çalışmıyor?
- Railway dashboard'da Variables bölümünü kontrol edin
- Deploy'u yeniden başlatın (Variables değiştiğinde otomatik restart olur)

### CORS Hatası?
- Backend CORS ayarları zaten yapılandırılmış
- Netlify domain'ini CORS'a eklemek gerekebilir (frontend deploy edildikten sonra)

---

## ✅ Kontrol Listesi

- [x] Railway'a giriş yapıldı
- [x] GitHub repo bağlandı
- [x] Backend service oluşturuldu (Root Directory: `backend`)
- [x] Environment variables eklendi
- [x] Domain oluşturuldu
- [x] Deploy başarılı
- [ ] Health check çalışıyor (`/api/health`) - Test edilmeli

---

## 🎯 Sonraki Adım

Backend deploy tamamlandıktan sonra:
1. Backend URL'ini kopyalayın
2. Netlify'a frontend deploy edin
3. Netlify environment variables'a backend URL'ini ekleyin

**Detaylar için:** `DEPLOY_STEPS.md` dosyasına bakın.


