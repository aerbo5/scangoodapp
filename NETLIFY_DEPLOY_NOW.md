# 🌐 Netlify Frontend Deploy - Hızlı Rehber

## ✅ Backend Deploy Tamamlandı!
Railway'da backend başarıyla deploy edildi! 🎉

## 🚀 Netlify Frontend Deploy Adımları

### 1. Netlify'a Giriş
1. **Netlify'a gidin**: https://app.netlify.com
2. **"Login"** tıklayın (GitHub ile giriş yapın)
3. **"Add new site"** > **"Import an existing project"** tıklayın

### 2. GitHub Repo'yu Bağlayın
1. **"GitHub"** seçin
2. Repo'nuzu seçin: `aerbo5/scangoodapp`
3. Netlify otomatik olarak repo'yu bağlayacak

### 3. Build Settings Yapılandırın
**Build settings** bölümünde:

- **Base directory**: (boş bırakın)
- **Build command**: `npm ci && npx expo export --platform web --output-dir web-build`
- **Publish directory**: `web-build`

### 4. Environment Variables Ekleyin
**"Show advanced"** tıklayın, sonra **"New variable"** ile şunları ekleyin:

```env
NODE_VERSION=18
EXPO_USE_METRO=true
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

⚠️ **ÖNEMLİ**: 
- `REACT_APP_API_URL` değerini Railway'dan aldığınız backend URL'i ile değiştirin!
- Örnek: `https://scan-good-backend-production.up.railway.app/api`
- URL'in sonunda `/api` olmalı!

### 5. Deploy Başlatın
1. **"Deploy site"** tıklayın
2. ⏳ 5-10 dakika bekleyin (ilk build uzun sürebilir)
3. Deploy tamamlandığında site URL'iniz hazır olacak

---

## 🔍 Railway Backend URL'ini Bulma

Railway Dashboard'da:
1. Backend service'inize tıklayın
2. **Settings** > **Generate Domain** (eğer domain yoksa)
3. **Settings** > **Networking** bölümünde domain URL'ini göreceksiniz
4. Örnek: `https://scan-good-backend-production.up.railway.app`
5. Bu URL'in sonuna `/api` ekleyin: `https://scan-good-backend-production.up.railway.app/api`

---

## ✅ Kontrol Listesi

- [ ] Netlify'a giriş yapıldı
- [ ] GitHub repo bağlandı
- [ ] Build settings yapılandırıldı
- [ ] Environment variables eklendi (özellikle `REACT_APP_API_URL`)
- [ ] Backend URL'i doğru kopyalandı (sonunda `/api` var)
- [ ] Deploy başlatıldı
- [ ] Deploy başarılı
- [ ] Site açılıyor
- [ ] API istekleri çalışıyor

---

## 🧪 Test Etme

Deploy tamamlandıktan sonra:

1. **Site URL'ini açın**: `https://your-site-name.netlify.app`
2. **Browser console'u açın** (F12)
3. **Receipt scan** yapmayı deneyin
4. **Hata var mı kontrol edin**

### Beklenen Sonuç:
- ✅ Site açılıyor
- ✅ Console'da hata yok
- ✅ Receipt scan çalışıyor
- ✅ Backend'e API istekleri gidiyor

---

## 🔧 Sorun Giderme

### Build Hatası?
- Netlify deploy loglarını kontrol edin
- `npm ci` komutunun çalıştığından emin olun
- `web-build` klasörünün oluştuğundan emin olun

### API Bağlantı Hatası?
- Browser console'da hata mesajını kontrol edin
- `REACT_APP_API_URL` environment variable'ın doğru olduğundan emin olun
- Backend URL'inin sonunda `/api` olduğundan emin olun
- Backend'in çalıştığından emin olun (Railway dashboard'dan kontrol edin)

### CORS Hatası?
- Backend CORS ayarları zaten yapılandırılmış
- Netlify domain'ini backend CORS'a eklemek gerekebilir
- Backend'i yeniden deploy edin

---

## 🎉 Başarılar!

Deploy tamamlandığında:
- ✅ Frontend: `https://your-site.netlify.app`
- ✅ Backend: `https://your-backend.railway.app`
- ✅ Uygulama canlıda çalışıyor! 🚀

**Sorularınız mı var?** Hata mesajlarını paylaşın, yardımcı olayım!


