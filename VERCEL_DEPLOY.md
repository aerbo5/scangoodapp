# 🚀 Vercel Deployment Rehberi

## ✅ Vercel'e Geçiş

Netlify'dan Vercel'e geçiş için adımlar:

## 📋 Adım 1: Vercel Hesabı Oluştur

1. **Vercel'e gidin**: https://vercel.com
2. **"Sign Up"** tıklayın
3. **GitHub ile giriş yapın** (aynı GitHub hesabınızı kullanın)

## 📋 Adım 2: Projeyi Vercel'e Bağla

1. **Vercel Dashboard'da**: https://vercel.com/dashboard
2. **"Add New..."** > **"Project"** tıklayın
3. **GitHub repository'nizi seçin**: `aerbo5/scangoodapp`
4. **"Import"** tıklayın

## 📋 Adım 3: Build Settings Yapılandır

Vercel otomatik olarak `vercel.json` dosyasını kullanacak, ama kontrol edin:

- **Framework Preset**: Other (veya boş bırakın)
- **Root Directory**: (boş bırakın - root'ta)
- **Build Command**: `npm ci && npx expo export --platform web --output-dir web-build`
- **Output Directory**: `web-build`
- **Install Command**: `npm ci`

## 📋 Adım 4: Environment Variables Ekleyin

**Settings** > **Environment Variables** bölümünde şunları ekleyin:

```env
NODE_VERSION=18
EXPO_USE_METRO=true
REACT_APP_API_URL=https://scangoodapp-production.up.railway.app/api
```

⚠️ **ÖNEMLİ**: 
- `REACT_APP_API_URL` değerini Railway backend URL'iniz ile değiştirin
- URL'in sonunda `/api` olmalı!

## 📋 Adım 5: Deploy Başlatın

1. **"Deploy"** butonuna tıklayın
2. ⏳ 5-10 dakika bekleyin (ilk build uzun sürebilir)
3. Deploy tamamlandığında site URL'iniz hazır olacak

## 🔍 Railway Backend URL'ini Bulma

Railway Dashboard'da:
1. Backend service'inize tıklayın
2. **Settings** > **Networking** bölümünde domain URL'ini göreceksiniz
3. Örnek: `https://scangoodapp-production.up.railway.app`
4. Bu URL'in sonuna `/api` ekleyin: `https://scangoodapp-production.up.railway.app/api`

## ✅ Kontrol Listesi

- [ ] Vercel hesabı oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Build settings yapılandırıldı
- [ ] Environment variables eklendi (özellikle `REACT_APP_API_URL`)
- [ ] Backend URL'i doğru kopyalandı (sonunda `/api` var)
- [ ] Deploy başlatıldı
- [ ] Deploy başarılı
- [ ] Site açılıyor
- [ ] API istekleri çalışıyor

## 🧪 Test Etme

Deploy tamamlandıktan sonra:

1. **Site URL'ini açın**: `https://your-site-name.vercel.app`
2. **Browser console'u açın** (F12)
3. **Receipt scan** yapmayı deneyin
4. **Hata var mı kontrol edin**

### Beklenen Sonuç:
- ✅ Site açılıyor
- ✅ Console'da hata yok
- ✅ Receipt scan çalışıyor
- ✅ Backend'e API istekleri gidiyor

## 🔧 Sorun Giderme

### Build Hatası?
- Vercel deploy loglarını kontrol edin
- `npm ci` komutunun çalıştığından emin olun
- `web-build` klasörünün oluştuğundan emin olun

### API Bağlantı Hatası?
- Browser console'da hata mesajını kontrol edin
- `REACT_APP_API_URL` environment variable'ın doğru olduğundan emin olun
- Backend URL'inin sonunda `/api` olduğundan emin olun
- Backend'in çalıştığından emin olun (Railway dashboard'dan kontrol edin)

### CORS Hatası?
- Backend CORS ayarları zaten yapılandırılmış
- Vercel domain'ini backend CORS'a eklemek gerekebilir
- Backend'i yeniden deploy edin

## 🎉 Başarılar!

Deploy tamamlandığında:
- ✅ Frontend: `https://your-site.vercel.app`
- ✅ Backend: `https://your-backend.railway.app`
- ✅ Uygulama canlıda çalışıyor! 🚀

**Sorularınız mı var?** Hata mesajlarını paylaşın, yardımcı olayım!


