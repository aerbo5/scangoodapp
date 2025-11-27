# Netlify GitHub Deploy Rehberi

## ✅ GitHub'dan Deploy Başlattınız!

Şimdi yapılacaklar:

### 1. Deploy Durumunu Takip Edin

1. **Netlify Dashboard**: https://app.netlify.com
2. Yeni oluşturduğunuz siteyi açın
3. **"Deploys"** sekmesine gidin
4. Deploy durumunu görebilirsiniz:
   - 🟡 **Building** - Build devam ediyor
   - 🟢 **Published** - Deploy başarılı!
   - 🔴 **Failed** - Hata var, logları kontrol edin

### 2. Site URL'ini Bulun

Deploy tamamlandığında:

1. Site sayfasında **site URL'i** görünür
2. Format: `https://[random-name].netlify.app`
3. URL'i kopyalayın

### 3. Build Ayarlarını Kontrol Edin

Eğer build başarısız olursa:

1. **Site settings** > **Build & deploy**
2. Şu ayarları kontrol edin:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
   - **Base directory**: (boş bırakın)

### 4. Environment Variables Ekleyin

**ÖNEMLİ**: Backend URL'ini eklemeyi unutmayın!

1. **Site settings** > **Environment variables**
2. **"Add variable"** tıklayın
3. Şu değişkenleri ekleyin:
   ```
   BACKEND_URL=https://your-backend.railway.app
   NODE_VERSION=18
   ```
   ⚠️ **Not**: Backend'i önce Railway'a deploy edin, sonra URL'ini buraya ekleyin!

### 5. Redeploy Yapın

Environment variables ekledikten sonra:

1. **Deploys** sekmesine gidin
2. **"Trigger deploy"** > **"Deploy site"** tıklayın
3. Yeni deploy başlayacak

## 🔧 Sorun Giderme

### Build Hatası?

**"Build command failed"** hatası alıyorsanız:

1. **Deploy logs**'u kontrol edin
2. Hata mesajını okuyun
3. Genellikle şu sorunlar olur:
   - Dependencies eksik → `package.json` kontrol edin
   - Build command yanlış → `npm run build:web` olmalı
   - Publish directory yanlış → `web-build` olmalı

### Site Açılmıyor?

- Build başarılı mı kontrol edin
- Browser console'da hata var mı bakın
- 404 hatası → Redirect ayarlarını kontrol edin

### API Çalışmıyor?

- Backend deploy edildi mi? (Railway/Render)
- `BACKEND_URL` environment variable eklendi mi?
- Backend URL doğru mu?

## 📝 Önemli Notlar

- **İlk deploy**: 5-10 dakika sürebilir
- **Build sırasında**: Sayfa henüz yayında değil
- **Deploy tamamlandığında**: Site URL'i aktif olur
- **Otomatik deploy**: Her GitHub push'unda otomatik deploy olur

## 🎯 Sonraki Adımlar

1. ✅ GitHub'dan deploy başlattınız
2. ⏳ Deploy tamamlanmasını bekleyin
3. ⏳ Site URL'ini kopyalayın
4. ⏳ Backend'i Railway'a deploy edin
5. ⏳ Environment variables ekleyin
6. ⏳ Siteyi test edin

## 🚀 Başarılar!

Deploy tamamlandığında site canlıda olacak! 🎉


