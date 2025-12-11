# ✅ Render.com Root Directory Doğru Ayarları

## 🔍 Durum

Root Directory **`backend`** olarak ayarlanmış. Bu durumda build command'lar zaten `backend/` klasöründe çalışır.

## ❌ YANLIŞ

Root Directory: `backend` ise:
```
Build Command: cd backend && npm install  ❌ (HATA VERİR!)
Start Command: cd backend && npm start    ❌ (HATA VERİR!)
```

## ✅ DOĞRU

Root Directory: `backend` ise:
```
Build Command: npm install  ✅
Start Command: npm start    ✅
```

**Neden?** Root Directory `backend` olduğunda, Render.com otomatik olarak `backend/` klasörüne gider. Tekrar `cd backend` yapmaya gerek yok!

---

## 📋 Render.com Dashboard Ayarları

### Settings Sekmesi:

```
Name: scangood-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Auto-Deploy: Yes
```

**ÖNEMLİ**: 
- Root Directory: `backend` ✅
- Build Command: `npm install` (cd backend YOK!)
- Start Command: `npm start` (cd backend YOK!)

---

## 🔄 Alternatif: Root Directory Boş

Eğer Root Directory'yi **boş bırakırsanız**:

```
Root Directory: (boş)
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

---

## ✅ Kontrol

Deploy sonrası logs'da şunları görmelisiniz:

```
✅ Running build command 'npm install'...
✅ Installing dependencies...
✅ Running start command 'npm start'...
✅ node server.js
✅ Scan Good Backend API running on http://0.0.0.0:10000
```

---

## 🎯 Özet

**Root Directory = `backend` ise:**
- ✅ Build Command: `npm install`
- ✅ Start Command: `npm start`
- ❌ `cd backend` kullanmayın!

**Root Directory = boş ise:**
- ✅ Build Command: `cd backend && npm install`
- ✅ Start Command: `cd backend && npm start`

