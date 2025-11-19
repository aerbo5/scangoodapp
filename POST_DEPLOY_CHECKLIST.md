# ✅ Post-Deploy Kontrol Listesi

## 🎉 Netlify Deploy Tamamlandı!

Şimdi yapılacaklar:

### 1. Backend Deploy (Railway/Render)

Backend henüz deploy edilmediyse:

#### Railway ile (Önerilen):
1. https://railway.app adresine gidin
2. "New Project" > "Deploy from GitHub repo"
3. Repo'nuzu seçin: `aerbo5/pricecheck-`
4. "Add Service" > Root Directory: `backend`
5. Environment Variables ekleyin:
   ```
   PORT=3000
   GOOGLE_CLOUD_VISION_API_KEY=your-key (varsa)
   ```
6. Deploy edin
7. Backend URL'ini kopyalayın (örn: `https://xxx.railway.app`)

#### Render ile:
1. https://render.com adresine gidin
2. "New Web Service"
3. GitHub repo'yu bağlayın
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Environment variables ekleyin
8. Deploy edin

### 2. Netlify Environment Variables Güncelle

Backend URL'ini Netlify'a ekleyin:

1. Netlify Dashboard'a gidin: https://app.netlify.com
2. Site Settings > Environment variables
3. `BACKEND_URL` değişkenini ekleyin/güncelleyin:
   ```
   BACKEND_URL=https://your-backend.railway.app
   ```
4. **Redeploy** yapın (Deploys > Trigger deploy)

### 3. Site Kontrolleri

Deploy sonrası kontrol edin:

- [ ] Site açılıyor mu? (https://your-site.netlify.app)
- [ ] API istekleri çalışıyor mu?
- [ ] Browser console'da hata var mı?
- [ ] Mobile responsive çalışıyor mu?

### 4. API Test

Site açıldıktan sonra:

1. Browser console'u açın (F12)
2. Network tab'ına gidin
3. Bir API isteği yapın (örn: scan receipt)
4. İstek başarılı mı kontrol edin

### 5. CORS Kontrolü

Eğer CORS hatası alıyorsanız:

1. Backend'in çalıştığından emin olun
2. Backend CORS ayarlarını kontrol edin (`backend/server.js`)
3. Netlify domain'inin CORS'da olduğundan emin olun

## 🔧 Sorun Giderme

### API Çalışmıyor?
- Backend URL doğru mu? (Netlify environment variables)
- Backend çalışıyor mu? (Railway/Render dashboard)
- CORS hatası var mı? (Browser console)

### Sayfa Açılmıyor?
- Build başarılı mı? (Netlify deploy logs)
- JavaScript hatası var mı? (Browser console)
- 404 hatası? (netlify.toml redirect ayarları)

### Build Hatası?
- `npm run build:web` local'de çalışıyor mu?
- Dependencies eksik mi? (`npm install`)

## 📝 Notlar

- **İlk deploy**: 5-10 dakika sürebilir
- **Sonraki deploy'lar**: 2-3 dakika
- **Otomatik deploy**: GitHub push'unda otomatik deploy olur
- **Preview URL**: Her PR için preview URL oluşturulur

## 🎯 Sonraki Adımlar

1. ✅ Netlify deploy tamamlandı
2. ⏳ Backend deploy (Railway/Render)
3. ⏳ Environment variables güncelle
4. ⏳ Site test et
5. ⏳ Custom domain ekle (opsiyonel)

## 🚀 Başarılar!

Uygulamanız canlıda! 🎉

