# Hızlı Deployment - ngrok ile

## Adım 1: ngrok Kurulumu

### Windows için:
1. https://ngrok.com/download adresinden ngrok'u indirin
2. ZIP'i açın ve `ngrok.exe` dosyasını `C:\Windows\System32` klasörüne kopyalayın
   VEYA proje klasörüne kopyalayın

### Alternatif (npm ile):
```bash
npm install -g ngrok
```

## Adım 2: Backend'i Başlatın

```bash
cd backend
npm start
```

Backend `http://localhost:3000` adresinde çalışacak.

## Adım 3: ngrok Tunnel Açın

Yeni bir terminal/PowerShell penceresi açın:

```bash
ngrok http 3000
```

ngrok size şöyle bir URL verecek:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Bu URL'i kopyalayın!** (örnek: `https://abc123.ngrok.io`)

## Adım 4: Frontend'de API URL'ini Güncelleyin

`src/services/apiService.js` dosyasını açın ve şu satırı bulun:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';
```

Şunu yapın:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'https://abc123.ngrok.io/api'  // ngrok URL'inizi buraya yapıştırın
  : 'https://your-production-api.com/api';
```

## Adım 5: Frontend'i Tunnel Modunda Başlatın

```bash
# Ana klasörde
npx expo start --tunnel
```

Bu size bir QR kod verecek. Expo Go uygulaması ile tarayarak mobil cihazınızdan test edebilirsiniz.

## Web için:

```bash
npx expo start --web
```

Tarayıcıda `http://localhost:8081` adresinde açılacak.

---

## Önemli Notlar:

1. **ngrok URL'i geçicidir**: Her ngrok'u yeniden başlattığınızda URL değişir
2. **Ücretsiz ngrok**: 8 saat sonra otomatik kapanır
3. **Production için**: Railway, Render veya Heroku gibi servislere deploy edin (DEPLOYMENT_GUIDE.md'ye bakın)

## Sorun Giderme:

- Backend çalışmıyor mu? `cd backend && npm start` ile kontrol edin
- ngrok çalışmıyor mu? `ngrok http 3000` komutunu tekrar çalıştırın
- API bağlantı hatası? `apiService.js`'deki URL'in doğru olduğundan emin olun




