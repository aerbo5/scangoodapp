# 🚨 Render.com Root Directory Hatası - Hızlı Düzeltme

## ❌ Hata Mesajı

```
Error: Cannot find module '/opt/render/project/src/backend/node_modules/expo/AppEntry.js'
```

## 🔍 Sorun

Render.com root'taki `package.json`'ı (frontend) kullanıyor, `backend/package.json`'ı değil.

## ✅ Hızlı Çözüm (2 Dakika)

### Adım 1: Render Dashboard'a Git

1. https://dashboard.render.com
2. **scangood-backend** service'ine tıkla
3. **Settings** sekmesine git

### Adım 2: Root Directory'yi Ayarla

**Root Directory** alanını bul ve şunu yaz:
```
backend
```

**ÖNEMLİ**: 
- Boş bırakmayın!
- Sadece `backend` yazın (tırnak işareti yok)
- Büyük/küçük harf duyarlı

### Adım 3: Build ve Start Command'ları Kontrol Et

**Build Command**:
```
npm install
```

**Start Command**:
```
npm start
```

**NOT**: Root Directory `backend` olduğunda, bu komutlar otomatik olarak `backend/` klasöründe çalışır.

### Adım 4: Kaydet ve Deploy

1. **Save Changes** tıkla
2. **Manual Deploy** → **Deploy latest commit**
3. Logs'u izle

---

## ✅ Başarı Kontrolü

Logs'da şunları görmelisiniz:

```
✅ Installing dependencies...
✅ npm install completed
✅ Starting server...
✅ Scan Good Backend API running on http://0.0.0.0:10000
```

**Eğer hala `expo` hatası görüyorsanız:**
- Root Directory ayarını tekrar kontrol edin
- Service'i silip yeniden oluşturun

---

## 🔄 Alternatif: Service'i Yeniden Oluştur

Eğer ayarlar çalışmıyorsa:

1. Mevcut service'i **Delete** et
2. **New +** → **Web Service**
3. GitHub repo'yu seç
4. **Root Directory**: `backend` ✅
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Environment variables'ları ekle
8. Deploy

---

## 📝 Doğru Ayarlar Özeti

```
Name: scangood-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Auto-Deploy: Yes
```

**Root Directory MUTLAKA `backend` olmalı!**

