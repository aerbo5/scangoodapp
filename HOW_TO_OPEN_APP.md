# Uygulamayı Açma Rehberi

## ✅ Backend Çalışıyor!

Backend başarıyla çalışıyor. Şimdi uygulamayı açalım.

## Yöntem 1: Web'de Açma (En Kolay)

### Adım 1: Frontend'i Başlatın

Terminal'de (backend'in çalıştığı terminalden farklı bir terminal):

```bash
npx expo start --web
```

Bu komut:
- Frontend'i başlatır
- Tarayıcıda otomatik olarak `http://localhost:8081` adresini açar
- Uygulama web'de çalışır

### Adım 2: Tarayıcıda Açın

Eğer otomatik açılmazsa, tarayıcınızda şu adresi açın:
```
http://localhost:8081
```

---

## Yöntem 2: Mobil Cihazda Açma (Expo Go)

### Adım 1: Expo Go Uygulamasını İndirin

- **Android**: Google Play Store'dan "Expo Go" uygulamasını indirin
- **iOS**: App Store'dan "Expo Go" uygulamasını indirin

### Adım 2: Frontend'i Tunnel Modunda Başlatın

```bash
npx expo start --tunnel
```

Bu komut size bir **QR kod** verecek.

### Adım 3: QR Kodu Tarayın

1. Mobil cihazınızda Expo Go uygulamasını açın
2. "Scan QR Code" seçeneğini seçin
3. Terminal'deki QR kodu tarayın
4. Uygulama cihazınızda yüklenecek!

**Not:** Mobil cihaz ve bilgisayar aynı WiFi ağında olmalı (tunnel modu hariç).

---

## Yöntem 3: Dışarıdan Erişim (ngrok ile)

Eğer uygulamayı internet üzerinden başka cihazlardan açmak istiyorsanız:

### Adım 1: ngrok Tunnel Açın

**Yeni bir terminal açın** ve:

```bash
ngrok http 3000
```

ngrok size bir URL verecek, örneğin:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### Adım 2: API URL'ini Güncelleyin

`src/services/apiService.js` dosyasını açın ve 6. satırı şu şekilde güncelleyin:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'https://abc123.ngrok.io/api'  // ngrok URL'inizi buraya yapıştırın
  : 'https://your-production-api.com/api';
```

**ÖNEMLİ:** URL'in sonunda `/api` olmalı!

### Adım 3: Frontend'i Tunnel Modunda Başlatın

```bash
npx expo start --tunnel
```

Artık uygulama internet üzerinden erişilebilir!

---

## Hızlı Başlatma (3 Terminal)

**Terminal 1 - Backend (Zaten çalışıyor ✅):**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npx expo start --web
```

**Terminal 3 - ngrok (Opsiyonel, dışarıdan erişim için):**
```bash
ngrok http 3000
```

---

## Sorun Giderme

### "Cannot connect to Metro bundler" hatası?
- Frontend'i yeniden başlatın: `npx expo start --clear`

### QR kod çalışmıyor?
- Tunnel modunu kullanın: `npx expo start --tunnel`
- Mobil cihaz ve bilgisayar aynı WiFi'de olmalı

### API bağlantı hatası?
- Backend'in çalıştığından emin olun
- `http://localhost:3000/api/health` adresini tarayıcıda test edin

### Web'de açılmıyor?
- Port 8081 kullanımda olabilir, başka bir port deneyin
- Tarayıcı önbelleğini temizleyin

---

## Önerilen: Web'de Başlatma

En kolay yol web'de başlatmaktır:

```bash
npx expo start --web
```

Bu komut uygulamayı tarayıcıda açacak ve test edebilirsiniz!




