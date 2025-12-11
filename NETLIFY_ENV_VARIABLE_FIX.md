# 🔧 Netlify Environment Variable Düzeltme

## ❌ Sorun
Frontend Netlify'da ama `http://localhost:3001` adresine istek gönderiyor.

## ✅ Çözüm: Netlify'da Environment Variable Ekleyin

### Adım 1: Netlify Dashboard'a Gidin

1. **Netlify Dashboard**: https://app.netlify.com
2. Site'inize tıklayın
3. **Site settings** > **Environment variables** bölümüne gidin

### Adım 2: Environment Variable Ekleyin

**"Add a variable"** butonuna tıklayın ve şunu ekleyin:

**Variable name:**
```
REACT_APP_API_URL
```

**Value:**
```
https://scangoodapp-production.up.railway.app/api
```

⚠️ **ÖNEMLİ:** 
- URL'in sonunda `/api` olmalı!
- Railway backend URL'iniz: `https://scangoodapp-production.up.railway.app`
- Tam URL: `https://scangoodapp-production.up.railway.app/api`

### Adım 3: Deploy'u Yeniden Başlatın

Environment variable ekledikten sonra:

1. **Deploys** sekmesine gidin
2. **"Trigger deploy"** > **"Deploy site"** tıklayın
3. ⏳ 5-10 dakika bekleyin (build sürebilir)

### Adım 4: Test Edin

Deploy tamamlandıktan sonra:

1. Site URL'inizi açın
2. Browser console'u açın (F12)
3. Resim çekmeyi deneyin
4. Console'da artık Railway URL'ine istek gönderildiğini görmelisiniz:
   ```
   🌐 API Request: POST https://scangoodapp-production.up.railway.app/api/scan/receipt
   ```

## 🔍 Kontrol

### Environment Variable Doğru mu?

Netlify Dashboard'da:
- **Site settings** > **Environment variables**
- `REACT_APP_API_URL` değişkeni var mı?
- Değeri: `https://scangoodapp-production.up.railway.app/api` mi?

### Deploy Yeniden Başlatıldı mı?

- **Deploys** sekmesinde yeni bir deploy var mı?
- Deploy başarılı mı? (Published durumunda mı?)

## 🐛 Sorun Giderme

### Hata: "REACT_APP_API_URL is not defined"

**Çözüm:**
- Netlify'da environment variable eklenmiş mi kontrol edin
- Deploy yeniden başlatıldı mı?
- Variable name doğru mu? (`REACT_APP_API_URL` - tam olarak böyle)

### Hata: "Network Error" veya "Connection Refused"

**Çözüm:**
- Railway backend çalışıyor mu? (`https://scangoodapp-production.up.railway.app/api/health`)
- URL'in sonunda `/api` var mı?
- CORS hatası var mı? (Browser console'da kontrol edin)

### Hala localhost'a istek gidiyor

**Çözüm:**
- Deploy yeniden başlatıldı mı?
- Browser cache'i temizleyin (Ctrl+Shift+R)
- Hard refresh yapın

## 📋 Kontrol Listesi

- [ ] Netlify Dashboard'a gidildi
- [ ] Site settings > Environment variables açıldı
- [ ] `REACT_APP_API_URL` değişkeni eklendi
- [ ] Değer: `https://scangoodapp-production.up.railway.app/api`
- [ ] Deploy yeniden başlatıldı
- [ ] Deploy başarılı
- [ ] Browser console'da Railway URL'ine istek gidiyor
- [ ] API istekleri çalışıyor

## 🎯 Sonuç

Environment variable eklendikten ve deploy yeniden başlatıldıktan sonra:
- ✅ Frontend Railway backend'e bağlanacak
- ✅ `http://localhost:3001` yerine Railway URL'i kullanılacak
- ✅ API istekleri çalışacak



