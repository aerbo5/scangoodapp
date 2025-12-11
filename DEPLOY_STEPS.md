# 🚀 Deploy Adımları - Hızlı Rehber

## ✅ Adım 1: GitHub Push Tamamlandı
- Tüm değişiklikler GitHub'a push edildi
- Repo: `https://github.com/aerbo5/scangoodapp.git`

---

## 🔧 Adım 2: Backend Deploy (Railway)

### Railway'a Giriş
1. **Railway'a gidin**: https://railway.app
2. **"Login"** tıklayın (GitHub ile giriş yapın)
3. **"New Project"** tıklayın
4. **"Deploy from GitHub repo"** seçin
5. Repo'nuzu seçin: `aerbo5/scangoodapp`

### Backend Service Oluşturma
1. **"Add Service"** > **"GitHub Repo"** tıklayın
2. **Root Directory**: `backend` yazın
3. **Settings** > **Generate Domain** tıklayın (backend URL'i almak için)

### Environment Variables Ekleme
**Settings** > **Variables** bölümüne gidin ve şunları ekleyin:

```env
PORT=3001
NODE_ENV=production

# Azure Computer Vision (OCR için)
AZURE_COMPUTER_VISION_KEY=your-azure-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/

# Google Custom Search API (Market araştırması için)
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyDKhrokFGquwnyQFyyCCNuqdxw42Q382W8
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=50d1476204abf4cd9

# Google Gemini API (Opsiyonel - AI ürün tanıma için)
GOOGLE_GEMINI_API_KEY=your-gemini-key-here
```

⚠️ **ÖNEMLİ**: `.env` dosyanızdaki değerleri buraya kopyalayın!

### Deploy
1. Railway otomatik olarak deploy başlatacak
2. **Deployments** sekmesinde durumu izleyin
3. Deploy tamamlandığında **Domain** URL'ini kopyalayın
   - Örnek: `https://scan-good-backend-production.up.railway.app`

---

## 🌐 Adım 3: Frontend Deploy (Netlify)

### Netlify'a Giriş
1. **Netlify'a gidin**: https://app.netlify.com
2. **"Add new site"** > **"Import an existing project"** tıklayın
3. **"GitHub"** seçin ve repo'nuzu seçin: `aerbo5/scangoodapp`

### Build Settings
**Build settings** bölümünde:
- **Base directory**: (boş bırakın)
- **Build command**: `npm ci && npx expo export --platform web --output-dir web-build`
- **Publish directory**: `web-build`

### Environment Variables
**Site settings** > **Environment variables** bölümüne gidin:

```env
NODE_VERSION=18
EXPO_USE_METRO=true
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

⚠️ **ÖNEMLİ**: `REACT_APP_API_URL` değerini Railway'dan aldığınız backend URL'i ile değiştirin!

### Deploy
1. **"Deploy site"** tıklayın
2. ⏳ 5-10 dakika bekleyin (ilk build uzun sürebilir)
3. Deploy tamamlandığında site URL'iniz hazır olacak
   - Örnek: `https://scan-good-app.netlify.app`

---

## ✅ Adım 4: Kontrol ve Test

### Backend Kontrolü
1. Railway dashboard'da backend'in **Running** durumunda olduğunu kontrol edin
2. Backend URL'ini tarayıcıda açın: `https://your-backend.railway.app/api/health`
3. Şu cevabı görmelisiniz:
   ```json
   {
     "status": "ok",
     "message": "Scan Good API is running"
   }
   ```

### Frontend Kontrolü
1. Netlify dashboard'da deploy'un **Published** durumunda olduğunu kontrol edin
2. Site URL'ini tarayıcıda açın
3. Browser console'u açın (F12) ve hata olup olmadığını kontrol edin
4. Receipt scan yapmayı deneyin

---

## 🔧 Sorun Giderme

### Backend Çalışmıyor?
- Railway loglarını kontrol edin: **Deployments** > **View Logs**
- Environment variables'ın doğru olduğundan emin olun
- Port'un `3001` olduğundan emin olun

### Frontend Build Hatası?
- Netlify deploy loglarını kontrol edin
- `npm ci` komutunun çalıştığından emin olun
- `web-build` klasörünün oluştuğundan emin olun

### API Bağlantı Hatası?
- Browser console'da hata mesajını kontrol edin
- `REACT_APP_API_URL` environment variable'ın doğru olduğundan emin olun
- Backend CORS ayarlarını kontrol edin (zaten yapılandırılmış)

### CORS Hatası?
- Backend `server.js`'de CORS ayarları zaten var
- Backend'i yeniden deploy edin

---

## 📝 Önemli Notlar

1. **Environment Variables**: `.env` dosyasındaki tüm key'leri Railway ve Netlify'a eklemeyi unutmayın
2. **Backend URL**: Frontend deploy edildikten sonra backend URL'ini güncellemeyi unutmayın
3. **Otomatik Deploy**: Her GitHub push'unda otomatik deploy olacak
4. **İlk Deploy**: 10-15 dakika sürebilir
5. **Sonraki Deploy'lar**: 2-3 dakika sürer

---

## 🎉 Başarılar!

Deploy tamamlandığında:
- ✅ Backend: `https://your-backend.railway.app`
- ✅ Frontend: `https://your-site.netlify.app`
- ✅ Uygulama canlıda çalışıyor!

**Sorularınız mı var?** Logları kontrol edin veya hata mesajlarını paylaşın.




