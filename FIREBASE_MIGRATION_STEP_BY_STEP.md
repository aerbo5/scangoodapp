# 🔥 Firebase Migration - Adım Adım Rehber

## 📋 Ön Hazırlık

### 1. Firebase Projesi Oluştur

1. **Firebase Console**: https://console.firebase.google.com
2. **"Add project"** tıklayın
3. **Project name**: `scangoodapp` (veya istediğiniz isim)
4. **Google Analytics**: İsteğe bağlı (önerilmez, ekstra yapılandırma)
5. **Create project** → Bekleyin (1-2 dakika)

### 2. Firebase CLI Kurulumu

```bash
npm install -g firebase-tools
firebase login
```

---

## 🚀 Adım 1: Firebase'i Projeye Bağla

### 1.1 Firebase Init

```bash
# Proje root dizininde
firebase init
```

### 1.2 Seçenekler

Aşağıdaki seçenekleri seçin:
- ✅ **Functions**: Configure a Cloud Functions directory
- ✅ **Hosting**: Configure files for Firebase Hosting
- ❌ Firestore: Şimdilik gerekli değil (opsiyonel)

### 1.3 Yapılandırma

**Functions:**
- Language: **JavaScript**
- ESLint: **No** (hızlı başlamak için)
- Install dependencies: **Yes**

**Hosting:**
- Public directory: **web-build**
- Single-page app: **Yes**
- Set up automatic builds: **No** (manuel deploy)

---

## 🔧 Adım 2: Backend'i Cloud Functions'a Taşı

### 2.1 Functions Klasör Yapısı

Firebase init'ten sonra `functions` klasörü oluşacak. Backend'i oraya taşıyalım:

```bash
# Mevcut backend dosyalarını functions'a kopyala
cp -r backend/services functions/
cp backend/server.js functions/index.js
cp backend/package.json functions/package.json.backup
```

### 2.2 Functions/index.js Düzenle

`functions/index.js` dosyasını oluştur/düzenle:

```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Backend kodunuzu buraya kopyalayın
// server.js içeriğini buraya taşıyın
// Ama app.listen() yerine exports kullanın:

const app = express();

// CORS - Firebase Hosting için
app.use(cors({
  origin: true, // Firebase Hosting otomatik CORS
  credentials: true,
}));

// ... (tüm route'larınız)

// Export as Cloud Function
exports.api = functions.https.onRequest(app);
```

### 2.3 Functions/package.json

`functions/package.json` dosyasını düzenle:

```json
{
  "name": "functions",
  "description": "Cloud Functions for Scan Good App",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-functions": "^4.5.0",
    "firebase-admin": "^11.11.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.0",
    "cheerio": "^1.1.2",
    "@google-cloud/vision": "^5.3.4",
    "sharp": "^0.32.6"
  },
  "private": true
}
```

### 2.4 Functions Dependencies Install

```bash
cd functions
npm install
cd ..
```

---

## 🌐 Adım 3: Frontend'i Firebase Hosting'e Hazırla

### 3.1 firebase.json

`firebase.json` dosyasını düzenle:

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": "web-build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      },
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
}
```

### 3.2 Frontend API URL'ini Güncelle

`src/services/apiService.js` dosyasını düzenle:

```javascript
const getApiBaseUrl = () => {
  try {
    // Firebase Hosting + Functions
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      
      // Firebase Hosting'deyse, Functions URL'ini kullan
      if (hostname.includes('web.app') || hostname.includes('firebaseapp.com')) {
        // Firebase Functions otomatik olarak /api route'una yönlendirir
        return '/api';
      }
    }
    
    // Development
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      return 'http://localhost:5001/scangoodapp/us-central1/api';
    }
    
    // Fallback
    return '/api';
  } catch (error) {
    console.error('❌ Error in getApiBaseUrl:', error);
    return '/api';
  }
};
```

---

## 🔐 Adım 4: Environment Variables

### 4.1 Firebase Functions Config

```bash
firebase functions:config:set \
  azure.vision.key="your-azure-key" \
  azure.vision.endpoint="your-azure-endpoint" \
  gemini.api.key="your-gemini-key" \
  google.custom.search.api.key="your-search-key" \
  google.custom.search.engine.id="your-engine-id"
```

### 4.2 Functions'da Environment Variables Kullanımı

`functions/index.js` dosyasında:

```javascript
const functions = require('firebase-functions');

// Environment variables
const config = functions.config();
process.env.AZURE_COMPUTER_VISION_KEY = config.azure?.vision?.key;
process.env.AZURE_COMPUTER_VISION_ENDPOINT = config.azure?.vision?.endpoint;
process.env.GOOGLE_GEMINI_API_KEY = config.gemini?.api?.key;
process.env.GOOGLE_CUSTOM_SEARCH_API_KEY = config.google?.custom?.search?.api?.key;
process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID = config.google?.custom?.search?.engine?.id;
```

---

## 🚀 Adım 5: Deploy

### 5.1 Frontend Build

```bash
npm run build:web
```

### 5.2 Deploy Everything

```bash
firebase deploy
```

Veya sadece Functions:
```bash
firebase deploy --only functions
```

Veya sadece Hosting:
```bash
firebase deploy --only hosting
```

---

## ✅ Adım 6: Test

### 6.1 Firebase URL'lerini Bul

Deploy'dan sonra Firebase size URL'ler verecek:
- **Hosting URL**: `https://scangoodapp.web.app`
- **Functions URL**: `https://us-central1-scangoodapp.cloudfunctions.net/api`

### 6.2 Test Et

1. Hosting URL'ini açın
2. F12 → Console
3. Ürün resmini çekin
4. API isteklerinin `/api` route'una gittiğini kontrol edin

---

## 🔧 Sorun Giderme

### Cold Start
- İlk çağrı yavaş olabilir (1-2 saniye)
- Normal, Cloud Functions soğuk başlatma

### Timeout
- Free tier: 60 saniye
- Paid tier: 540 saniye
- Uzun işlemler için timeout artırın

### CORS
- Firebase Hosting + Functions otomatik CORS
- Ekstra yapılandırma gerekmez

---

## 📝 Checklist

- [ ] Firebase projesi oluşturuldu
- [ ] Firebase CLI kuruldu
- [ ] `firebase init` yapıldı
- [ ] Backend `functions/index.js`'e taşındı
- [ ] `functions/package.json` düzenlendi
- [ ] `functions` dependencies install edildi
- [ ] `firebase.json` yapılandırıldı
- [ ] Frontend API URL'i güncellendi
- [ ] Environment variables ayarlandı
- [ ] Frontend build edildi
- [ ] Deploy yapıldı
- [ ] Test edildi

---

## 🎯 Sonraki Adımlar

1. ✅ Eski servisleri kapatabilirsiniz
2. ✅ Firebase'de custom domain ekleyebilirsiniz
3. ✅ Firestore ekleyebilirsiniz (veritabanı için)

