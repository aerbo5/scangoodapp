# ✅ Vercel + Render.com Backend Kontrol Listesi

## 🔍 Kontrol Edilecekler

### 1. Frontend Kodu ✅
`src/services/apiService.js` zaten Render.com URL'ini kullanıyor:
- Vercel'de: `https://scangood-backend.onrender.com/api`
- Netlify'da: `https://scangood-backend.onrender.com/api`
- Development: `http://localhost:3001/api`

### 2. Vercel Environment Variables ⚠️

Vercel Dashboard'da kontrol edin:

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. **`REACT_APP_API_URL`** var mı kontrol edin
3. Eğer varsa ve eski Railway URL'ini gösteriyorsa:
   - **SİLİN** veya
   - **GÜNCELLEYİN**: `https://scangood-backend.onrender.com/api`

**ÖNEMLİ**: `REACT_APP_API_URL` yoksa, frontend otomatik olarak Render.com URL'ini kullanacak (kod zaten hazır).

### 3. Render.com Backend URL'i Doğru mu? ⚠️

Render.com'da service'inizin gerçek URL'ini kontrol edin:

1. Render Dashboard → **scangood-backend** service
2. **Settings** → **Service URL**'i kopyalayın
3. Örnek: `https://scangood-backend.onrender.com` veya `https://scangood-backend-xxxx.onrender.com`

Eğer URL farklıysa, `src/services/apiService.js`'de güncelleyin.

---

## ✅ Yapılacaklar

### Adım 1: Render.com Backend URL'ini Kontrol Et

Render Dashboard → Service URL'ini alın:
```
https://scangood-backend.onrender.com
```

### Adım 2: Vercel Environment Variables Kontrolü

Vercel Dashboard → Environment Variables:
- `REACT_APP_API_URL` var mı?
- Varsa, eski Railway URL'ini gösteriyor mu?
- Eğer öyleyse, **SİLİN** (frontend otomatik Render.com kullanacak)

### Adım 3: Frontend URL'ini Güncelle (Gerekirse)

Eğer Render.com URL'i `scangood-backend.onrender.com` değilse:

`src/services/apiService.js` dosyasında 3 yerde URL'i güncelleyin:
- Satır 23: Vercel için
- Satır 29: Netlify için  
- Satır 50: Fallback için

### Adım 4: Vercel Redeploy

1. Vercel Dashboard → **Deployments**
2. Son deployment'ın yanında **⋯** → **Redeploy**
3. Veya GitHub'a push yapın (auto-deploy)

---

## 🧪 Test

### 1. Backend Health Check:
```bash
curl https://scangood-backend.onrender.com/api/health
```

Beklenen:
```json
{"status":"ok","message":"Scan Good API is running"}
```

### 2. Frontend Test:
1. Vercel URL'ini açın
2. F12 → Console
3. Ürün tarama yapın
4. Console'da şunu görmelisiniz:
   ```
   🌐 Detected Vercel, using Render backend URL
   🌐 API Base URL: https://scangood-backend.onrender.com/api
   ```

---

## 📝 Özet

✅ **Frontend kodu hazır** - Render.com URL'ini kullanıyor
⚠️ **Vercel Environment Variables kontrolü** - `REACT_APP_API_URL` varsa silin
⚠️ **Render.com URL kontrolü** - Gerçek URL'i doğrulayın
✅ **Redeploy** - Vercel'de yeniden deploy edin

---

## 🎯 En Önemli Adım

**Vercel Dashboard → Environment Variables → `REACT_APP_API_URL` varsa SİLİN!**

Frontend zaten otomatik olarak Render.com backend'ini kullanacak.

