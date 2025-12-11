# 🔥 Firebase Migration - Adım Adım Script

## 📋 Adım 1: Firebase Projesi Oluştur

1. https://console.firebase.google.com
2. **"Add project"** → `scangoodapp` → **Create**

## 📋 Adım 2: Firebase CLI Kur

```bash
npm install -g firebase-tools
firebase login
```

## 📋 Adım 3: Firebase Init

```bash
firebase init
```

**Seçenekler:**
- ✅ **Functions**: Configure a Cloud Functions directory
- ✅ **Hosting**: Configure files for Firebase Hosting
- ❌ Firestore: Şimdilik gerekli değil

**Ayarlar:**
- Functions language: **JavaScript**
- ESLint: **No**
- Install dependencies: **Yes**
- Hosting public directory: **web-build**
- Single-page app: **Yes**
- Set up automatic builds: **No**

## 📋 Adım 4: Backend Dosyalarını Kopyala

```bash
# Windows PowerShell
Copy-Item -Path "backend\services" -Destination "functions\services" -Recurse

# Veya manuel olarak:
# functions/services/ klasörüne backend/services/ içindeki tüm dosyaları kopyala
```

## 📋 Adım 5: functions/index.js'i Tamamla

`functions/index.js` dosyasına backend/server.js'deki tüm route'ları ekle (zaten başlangıç yapıldı).

## 📋 Adım 6: Environment Variables Ayarla

```bash
firebase functions:config:set \
  azure.vision.key="your-azure-key" \
  azure.vision.endpoint="your-azure-endpoint" \
  gemini.api.key="your-gemini-key" \
  google.custom.search.api.key="your-search-key" \
  google.custom.search.engine.id="your-engine-id"
```

## 📋 Adım 7: Frontend API URL'ini Güncelle

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
    
    // Development - Firebase emulator
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

## 📋 Adım 8: Build ve Deploy

```bash
# Frontend build
npm run build:web

# Deploy everything
firebase deploy
```

---

## ⚠️ ÖNEMLİ: functions/index.js'i Tamamla

`functions/index.js` dosyasına backend/server.js'deki tüm route handler'ları eklemeniz gerekiyor. Şu an sadece başlangıç yapıldı.

**Kolay yol**: `backend/server.js` dosyasındaki tüm `app.get()`, `app.post()` route'larını kopyalayıp `functions/index.js`'e ekleyin (app.listen() hariç).

