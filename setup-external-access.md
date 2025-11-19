# Uygulamayı Dışarıdan Açma - Adım Adım

## Adım 1: Backend'i Başlatın

Backend zaten başlatıldı. Eğer çalışmıyorsa:

```bash
cd backend
npm start
```

Backend `http://localhost:3000` adresinde çalışıyor olmalı.

## Adım 2: ngrok Tunnel Açın

**Yeni bir terminal/PowerShell penceresi açın** ve şu komutu çalıştırın:

```bash
ngrok http 3000
```

ngrok size şöyle bir çıktı verecek:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Bu URL'i kopyalayın!** (örnek: `https://abc123.ngrok.io`)

## Adım 3: Frontend'de API URL'ini Güncelleyin

`src/services/apiService.js` dosyasını açın ve şu satırı bulun:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';
```

**ngrok URL'inizi** kullanarak şu şekilde güncelleyin:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'https://abc123.ngrok.io/api'  // ngrok URL'inizi buraya yapıştırın
  : 'https://your-production-api.com/api';
```

**ÖNEMLİ:** URL'in sonunda `/api` olmalı!

## Adım 4: Frontend'i Tunnel Modunda Başlatın

Ana klasörde:

```bash
npx expo start --tunnel
```

Bu size bir QR kod verecek. Expo Go uygulaması ile tarayarak mobil cihazınızdan erişebilirsiniz.

## Adım 5: Web için

Web'de test etmek için:

```bash
npx expo start --web
```

Tarayıcıda `http://localhost:8081` adresinde açılacak.

---

## Hızlı Komutlar

### Backend + ngrok (Ayrı terminallerde):

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
ngrok http 3000
```

**Terminal 3:**
```bash
npx expo start --tunnel
```

---

## Notlar:

1. **ngrok URL'i geçicidir**: Her ngrok'u yeniden başlattığınızda URL değişir
2. **Ücretsiz ngrok**: 8 saat sonra otomatik kapanır
3. **URL değiştiğinde**: `apiService.js` dosyasındaki URL'i tekrar güncelleyin
4. **Production için**: Railway, Render veya Heroku gibi servislere deploy edin

---

## Sorun Giderme:

- **Backend çalışmıyor?** `cd backend && npm start` ile kontrol edin
- **ngrok çalışmıyor?** `ngrok http 3000` komutunu tekrar çalıştırın
- **API bağlantı hatası?** `apiService.js`'deki URL'in doğru olduğundan emin olun (sonunda `/api` olmalı)
- **CORS hatası?** Backend'de CORS ayarlarını kontrol edin (zaten `cors()` middleware var)



