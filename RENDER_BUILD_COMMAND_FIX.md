# 🔧 Render.com Build Command Hatası - Düzeltme

## ❌ Hata

Root Directory `backend` olmasına rağmen hala `expo/AppEntry.js` hatası alıyorsunuz.

## 🔍 Sorun

Render.com bazen Root Directory ayarını build sırasında doğru uygulamıyor. Komutları explicit olarak belirtmek gerekebilir.

## ✅ Çözüm

### Render.com Dashboard → Settings:

**Build Command**'ı şu şekilde değiştirin:
```
cd backend && npm install
```

**Start Command**'ı şu şekilde değiştirin:
```
cd backend && npm start
```

Veya alternatif olarak:

**Build Command**:
```
npm install --prefix backend
```

**Start Command**:
```
npm start --prefix backend
```

---

## 📋 Tam Ayarlar

```
Name: scangood-backend
Root Directory: backend
Environment: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Auto-Deploy: Yes
```

---

## 🔄 Alternatif: Root Directory'yi Boş Bırak

Eğer yukarıdaki çözüm çalışmazsa:

1. **Root Directory**'yi **boş bırakın** (veya silin)
2. **Build Command**: `cd backend && npm install`
3. **Start Command**: `cd backend && npm start`

Bu şekilde komutlar explicit olarak `backend/` klasörüne gidecek.

---

## 🚀 Test

Deploy sonrası logs'da şunları görmelisiniz:

```
✅ cd backend && npm install
✅ Installing dependencies in backend/
✅ cd backend && npm start
✅ node server.js
✅ Scan Good Backend API running on http://0.0.0.0:10000
```

---

## ⚠️ Önemli

- Root Directory `backend` ise ama hala hata alıyorsanız, Build/Start Command'lara `cd backend &&` ekleyin
- Veya Root Directory'yi boş bırakıp komutlarda explicit path kullanın

