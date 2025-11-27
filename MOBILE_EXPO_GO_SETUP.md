# 📱 Expo Go ile Mobilde Çalıştırma Rehberi

## 🎯 Adım 1: Expo Go Uygulamasını İndir

### iOS (iPhone/iPad)
1. App Store'u aç
2. "Expo Go" ara
3. İndir ve yükle

### Android
1. Google Play Store'u aç
2. "Expo Go" ara
3. İndir ve yükle

---

## 🚀 Adım 2: Backend'i Başlat

### Terminal 1: Backend
```bash
cd backend
npm start
```

Backend şu adreste çalışacak: `http://localhost:3001`

---

## 🌐 Adım 3: Ngrok ile Backend'i Dışarıya Aç

### Ngrok Kurulumu
1. https://ngrok.com/ adresine git
2. Ücretsiz hesap oluştur
3. Ngrok'u indir ve kur
4. Auth token'ı al: https://dashboard.ngrok.com/get-started/your-authtoken

### Ngrok'u Başlat
```bash
# Terminal 2: Ngrok
ngrok http 3001
```

**Önemli:** Ngrok size bir URL verecek, örneğin:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3001
```

Bu URL'yi kopyala! (örn: `https://abc123.ngrok-free.app`)

---

## ⚙️ Adım 4: Frontend API URL'ini Güncelle

### `src/services/apiService.js` dosyasını aç

Şu satırı bul:
```javascript
if (__DEV__) {
  return 'https://diagenetic-berry-pompously.ngrok-free.app/api';
}
```

Ngrok URL'in ile değiştir (sonuna `/api` ekle):
```javascript
if (__DEV__) {
  return 'https://abc123.ngrok-free.app/api';  // Ngrok URL'in buraya
}
```

---

## 📱 Adım 5: Frontend'i Başlat

### Terminal 3: Frontend
```bash
# Proje root dizininde
npm start
```

Expo CLI başladığında QR kod göreceksin.

---

## 📲 Adım 6: Telefonda Aç

### iOS (iPhone)
1. Camera uygulamasını aç
2. QR kodu tara
3. "Open in Expo Go" seçeneğine tıkla

### Android
1. Expo Go uygulamasını aç
2. "Scan QR code" butonuna tıkla
3. QR kodu tara

---

## ✅ Kontrol Listesi

- [ ] Expo Go uygulaması telefonda yüklü
- [ ] Backend çalışıyor (`http://localhost:3001`)
- [ ] Ngrok çalışıyor ve URL aldın
- [ ] `apiService.js`'de ngrok URL'i güncellendi
- [ ] Frontend başlatıldı (`npm start`)
- [ ] QR kod taranıp uygulama açıldı

---

## 🔧 Sorun Giderme

### Problem: "Network request failed"
**Çözüm:** 
- Ngrok URL'inin doğru olduğundan emin ol
- `apiService.js`'de URL'in sonunda `/api` olduğundan emin ol
- Backend'in çalıştığından emin ol

### Problem: "Cannot connect to server"
**Çözüm:**
- Ngrok'un çalıştığından emin ol
- Ngrok URL'ini tarayıcıda test et: `https://abc123.ngrok-free.app/api/health`
- Backend loglarını kontrol et

### Problem: QR kod görünmüyor
**Çözüm:**
- Terminal penceresini büyüt
- `npm start` komutunu tekrar çalıştır
- Expo CLI'nin güncel olduğundan emin ol: `npm install -g expo-cli`

### Problem: "Metro bundler" hatası
**Çözüm:**
- Cache'i temizle: `npx expo start -c`
- `node_modules` sil ve yeniden yükle: `rm -rf node_modules && npm install`

---

## 📝 Notlar

- **Ngrok URL değişir:** Her ngrok başlatıldığında URL değişir (ücretsiz plan)
- **Aynı WiFi:** Telefon ve bilgisayar aynı WiFi ağında olmalı (QR kod için)
- **Port:** Backend port 3001'de çalışıyor (değiştirmediysen)
- **API Key:** Google Vision API key'lerin `.env` dosyasında olmalı

---

## 🎉 Başarılı!

Artık uygulaman telefonda çalışıyor! Kamera ile ürün tarayabilirsin.


