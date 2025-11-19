# Barcode Scan 404 Hatası - Çözüm

## 🔍 Sorun
Barcode scan'de 404 hatası alıyorsunuz. Bu, backend endpoint'inin bulunamadığı anlamına geliyor.

## ✅ Çözüm 1: Backend URL'ini Kontrol Edin

### Frontend'teki API URL'i Kontrol Edin

`src/services/apiService.js` dosyasında backend URL'i kontrol edin:

```javascript
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'https://diagenetic-berry-pompously.ngrok-free.dev/api';
  }
  // ...
};
```

### Sorun: Ngrok URL'i Eski Olabilir

Eğer ngrok kullanıyorsanız, URL'in güncel olduğundan emin olun.

## ✅ Çözüm 2: Backend Çalışıyor mu Kontrol Edin

1. Backend çalışıyor mu? → `http://localhost:3000/api/health`
2. Backend endpoint'i doğru mu? → `POST /api/scan/barcode`

## ✅ Çözüm 3: Ngrok Kullanın (Mobil İçin)

Mobilde test ediyorsanız, backend'i dışarıya açmak için ngrok kullanmanız gerekir:

### Adım 1: Ngrok'u Başlatın

Yeni bir terminal açın:

```bash
ngrok http 3000
```

### Adım 2: Ngrok URL'ini Kopyalayın

Ngrok size bir URL verecek (örn: `https://xxxxx.ngrok-free.app`)

### Adım 3: Frontend'te URL'i Güncelleyin

`src/services/apiService.js` dosyasında:

```javascript
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'https://xxxxx.ngrok-free.app/api';  // Ngrok URL'inizi buraya yapıştırın
  }
  // ...
};
```

### Adım 4: Frontend'i Yeniden Başlatın

Frontend'i durdurun (Ctrl+C) ve tekrar başlatın:

```bash
npm start
```

## ✅ Çözüm 4: Localhost Kullanın (Sadece Web İçin)

Eğer sadece web'de test ediyorsanız, localhost kullanabilirsiniz:

`src/services/apiService.js` dosyasında:

```javascript
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3000/api';  // Localhost kullan
  }
  // ...
};
```

**Not:** Bu sadece web'de çalışır, mobilde çalışmaz!

## ✅ Çözüm 5: Backend Endpoint'ini Test Edin

Backend endpoint'inin çalışıp çalışmadığını test edin:

```bash
# Health check
curl http://localhost:3000/api/health

# Barcode endpoint (POST gerekir, bu yüzden 404 normal)
curl -X POST http://localhost:3000/api/scan/barcode
```

## 🔧 Sorun Giderme

### Backend Çalışmıyor
```bash
cd backend
npm start
```

### Ngrok URL'i Eski
Ngrok'u yeniden başlatın ve yeni URL'i frontend'e ekleyin.

### CORS Hatası
Backend'te CORS ayarlarını kontrol edin (`backend/server.js`).

## ✅ Kontrol Listesi

- [ ] Backend çalışıyor mu? (`http://localhost:3000/api/health`)
- [ ] Ngrok çalışıyor mu? (mobil için)
- [ ] Frontend'te API URL doğru mu?
- [ ] Frontend yeniden başlatıldı mı?
- [ ] Backend endpoint'i doğru mu? (`POST /api/scan/barcode`)

## 🎯 Sonuç

404 hatası genellikle:
- Backend URL'i yanlış
- Backend çalışmıyor
- Ngrok URL'i eski (mobil için)

Bu adımları takip ederek sorunu çözebilirsiniz!

