# Deployment Guide - Scan Good App

## Hızlı Test İçin (Geçici)

### 1. Backend'i Dışarıya Açmak (ngrok)

```bash
# ngrok'u yükleyin (https://ngrok.com/download)
# veya npm ile:
npm install -g ngrok

# Backend'i başlatın (port 3000)
cd backend
npm start

# Yeni terminalde ngrok tunnel açın
ngrok http 3000

# ngrok size bir URL verecek, örneğin: https://abc123.ngrok.io
# Bu URL'i kopyalayın
```

### 2. Frontend'de API URL'ini Güncellemek

`src/services/apiService.js` dosyasında `API_BASE_URL`'i ngrok URL'iniz ile değiştirin:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'https://abc123.ngrok.io'  // ngrok URL'inizi buraya yapıştırın
  : 'https://your-production-api.com';
```

### 3. Frontend'i Tunnel ile Açmak (Opsiyonel)

```bash
# Expo tunnel modu ile başlatın
npx expo start --tunnel

# Bu size bir QR kod verecek, Expo Go uygulaması ile tarayabilirsiniz
```

---

## Production Deployment

### Backend Deployment Seçenekleri

#### Option 1: Railway (Önerilen - Ücretsiz Tier)
1. https://railway.app adresine gidin
2. GitHub repo'nuzu bağlayın
3. `backend` klasörünü seçin
4. Environment variables ekleyin:
   - `PORT=3000`
   - `GOOGLE_CLOUD_VISION_API_KEY` (varsa)
   - `GOOGLE_APPLICATION_CREDENTIALS` (varsa)
5. Deploy edin
6. Railway size bir URL verecek: `https://your-app.railway.app`

#### Option 2: Render
1. https://render.com adresine gidin
2. "New Web Service" seçin
3. GitHub repo'nuzu bağlayın
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Environment variables ekleyin
8. Deploy edin

#### Option 3: Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
heroku config:set GOOGLE_CLOUD_VISION_API_KEY=your-key
```

### Frontend Deployment Seçenekleri

#### Option 1: Expo EAS Build (Mobil için)
```bash
# EAS CLI'yi yükleyin
npm install -g eas-cli

# Login olun
eas login

# Build yapılandırması
eas build:configure

# Android build
eas build --platform android

# iOS build (Apple Developer hesabı gerekli)
eas build --platform ios
```

#### Option 2: Web için Vercel/Netlify
```bash
# Build oluşturun
npm run build

# Vercel'e deploy
npm install -g vercel
vercel

# veya Netlify
npm install -g netlify-cli
netlify deploy
```

#### Option 3: Expo Web Hosting
```bash
# Expo'ya publish edin
npx expo publish

# Web URL'i alacaksınız
```

---

## Environment Variables

### Backend (.env)
```
PORT=3000
GOOGLE_CLOUD_VISION_API_KEY=your-api-key
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
NODE_ENV=production
```

### Frontend
`src/services/apiService.js` dosyasında production URL'i güncelleyin:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'
  : 'https://your-production-backend.com';
```

---

## Güvenlik Notları

1. **CORS**: Backend'de CORS ayarlarını production domain'inize göre güncelleyin
2. **API Keys**: Environment variables kullanın, hardcode etmeyin
3. **HTTPS**: Production'da mutlaka HTTPS kullanın
4. **Rate Limiting**: Backend'e rate limiting ekleyin (express-rate-limit)

---

## Hızlı Başlangıç (ngrok ile)

1. Backend'i başlatın: `cd backend && npm start`
2. Yeni terminal: `ngrok http 3000`
3. ngrok URL'ini kopyalayın
4. `src/services/apiService.js`'de API_BASE_URL'i güncelleyin
5. Frontend'i başlatın: `npm start`
6. `npx expo start --tunnel` ile tunnel modunda başlatın

Bu şekilde hem backend hem frontend dışarıdan erişilebilir olacak!



