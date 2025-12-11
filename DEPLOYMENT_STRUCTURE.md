# 🏗️ Deployment Yapısı - Basit Açıklama

## 📍 Mevcut Durum

### ✅ Render.com'da:
- **Backend** (Node.js API) → `https://scangood-backend.onrender.com`

### ✅ Vercel'de:
- **Frontend** (React/Expo Web) → `https://your-app.vercel.app`

---

## 🎯 Hangi URL'leri Kullanmalıyız?

### Backend URL (Render.com):
```
https://scangood-backend.onrender.com/api
```

### Frontend URL (Vercel):
```
https://your-app.vercel.app
```

---

## ✅ Doğru Yapılandırma

### 1. Render.com Backend:
- **URL**: `https://scangood-backend.onrender.com`
- **Port**: 10000 (Render.com otomatik set ediyor)
- **Root Directory**: `backend`
- **Environment Variables**: Vision API key'leri ekli olmalı

### 2. Vercel Frontend:
- **URL**: `https://your-app.vercel.app`
- **Backend URL'i**: Otomatik algılanıyor (Render.com kullanıyor)
- **Redeploy**: Gerekirse yapılmalı (cache temizlemek için)

---

## 🔍 Kontrol Listesi

### Render.com Backend Kontrolü:
1. Render Dashboard → Backend servisi
2. **Settings** → **Root Directory**: `backend` olmalı
3. **Environment** → En az bir Vision API key'i ekli olmalı
4. **Logs** → Backend çalışıyor mu?

**Test**: `https://scangood-backend.onrender.com/api/health` → JSON dönmeli

### Vercel Frontend Kontrolü:
1. Vercel Dashboard → Projeniz
2. **Deployments** → En son deployment başarılı mı?
3. **Settings** → **Environment Variables** → `REACT_APP_API_URL` kontrol edin (opsiyonel, yoksa otomatik algılanır)

**Test**: Frontend açıldığında Console'da `🌐 API Base URL: https://scangood-backend.onrender.com/api` görünmeli

---

## 🎯 Özet

**Backend**: Render.com'da → `https://scangood-backend.onrender.com/api`
**Frontend**: Vercel'de → `https://your-app.vercel.app`

**Frontend, Backend'e otomatik olarak bağlanıyor** (Render.com URL'i kullanıyor)

---

## 🔧 Şu Anda Yapılacaklar

1. **Render.com Backend Kontrolü**:
   - Root Directory: `backend` olmalı
   - Vision API key'leri ekli olmalı
   - `/api/health` çalışmalı

2. **Vercel Frontend Kontrolü**:
   - Redeploy yapın (cache temizlemek için)
   - Console'da doğru URL görünmeli
