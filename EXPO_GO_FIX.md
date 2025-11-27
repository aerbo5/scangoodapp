# 🔧 Expo Go "Couldn't Connect to Server" Hatası Çözümü

## 🚨 Sorun
Expo Go'da "couldn't connect to server" hatası alıyorsunuz.

## ✅ Çözüm Adımları

### 1. Backend Çalışıyor mu Kontrol Et

Terminal'de backend klasöründe:
```bash
cd backend
npm start
```

**Kontrol:** Tarayıcıda `http://localhost:3001/api/health` açın
- ✅ `{"status":"ok"}` görüyorsanız → Backend çalışıyor
- ❌ Hata görüyorsanız → Backend'i başlatın

---

### 2. Ngrok Çalışıyor mu Kontrol Et

**Yeni bir terminal açın:**
```bash
ngrok http 3001
```

**Kontrol:** Ngrok size bir URL verecek:
```
Forwarding  https://xxxxx.ngrok-free.app -> http://localhost:3001
```

**ÖNEMLİ:** Bu URL'i kopyalayın! (örn: `https://abc123.ngrok-free.app`)

---

### 3. Frontend'te Ngrok URL'ini Güncelle

`src/services/apiService.js` dosyasını açın:

**Şu satırı bulun:**
```javascript
if (__DEV__) {
  return 'https://diagenetic-berry-pompously.ngrok-free.dev/api';
}
```

**Ngrok URL'iniz ile değiştirin:**
```javascript
if (__DEV__) {
  return 'https://abc123.ngrok-free.app/api';  // Ngrok URL'iniz buraya
}
```

**ÖNEMLİ:** 
- URL'in sonunda `/api` olmalı!
- `https://` ile başlamalı
- `.ngrok-free.app` veya `.ngrok.io` ile bitmeli

---

### 4. Frontend'i Yeniden Başlat

Frontend'i durdurun (Ctrl+C) ve tekrar başlatın:
```bash
npm start
```

---

### 5. Ngrok URL'ini Test Et

Tarayıcıda ngrok URL'inizi test edin:
```
https://abc123.ngrok-free.app/api/health
```

**Beklenen sonuç:**
```json
{"status":"ok","message":"Scan Good API is running"}
```

Eğer hata görüyorsanız:
- Backend çalışmıyor olabilir
- Ngrok yanlış port'a bağlanmış olabilir (3001 olmalı)

---

## 🔍 Sorun Giderme

### Problem 1: "Network request failed"
**Çözüm:**
- Ngrok URL'i doğru mu? → `apiService.js` dosyasını kontrol edin
- Backend çalışıyor mu? → `http://localhost:3001/api/health` test edin
- Ngrok çalışıyor mu? → Ngrok terminalinde URL görünüyor mu?

### Problem 2: "CORS error"
**Çözüm:**
- Backend CORS ayarları ngrok URL'lerini destekliyor mu?
- `backend/server.js` dosyasında şu satırlar olmalı:
  ```javascript
  /\.ngrok-free\.app$/,  // Allow ngrok free URLs
  /\.ngrok\.io$/,        // Allow ngrok.io URLs
  ```
- Backend'i yeniden başlatın

### Problem 3: "404 Not Found"
**Çözüm:**
- URL'in sonunda `/api` var mı? → `https://abc123.ngrok-free.app/api`
- Backend route'ları doğru mu? → `/api/health` test edin

### Problem 4: Ngrok URL değişti
**Çözüm:**
- Her ngrok başlatışında URL değişir
- Yeni URL'i `apiService.js` dosyasına güncelleyin
- Frontend'i yeniden başlatın

---

## ✅ Kontrol Listesi

- [ ] Backend çalışıyor (`http://localhost:3001/api/health`)
- [ ] Ngrok çalışıyor (`ngrok http 3001`)
- [ ] Ngrok URL'i kopyalandı
- [ ] `apiService.js` dosyasında ngrok URL'i güncellendi
- [ ] URL'in sonunda `/api` var
- [ ] Frontend yeniden başlatıldı
- [ ] Ngrok URL'i tarayıcıda test edildi (`/api/health`)

---

## 🎯 Hızlı Test

1. Backend: `http://localhost:3001/api/health` → ✅ Çalışıyor
2. Ngrok: `https://abc123.ngrok-free.app/api/health` → ✅ Çalışıyor
3. Frontend: Expo Go'da uygulama açılıyor → ✅ Bağlanıyor

---

## 📝 Notlar

- **Port:** Backend port 3001'de çalışıyor (3000 değil!)
- **Ngrok Port:** Ngrok'u `ngrok http 3001` ile başlatın
- **URL Format:** `https://xxxxx.ngrok-free.app/api` (sonunda `/api` olmalı)
- **Her Başlatışta:** Ngrok URL'i değişir, güncellemeyi unutmayın!


