# 🚀 Render.com Backend Deployment Rehberi

## 📋 Adım 1: Render.com Hesabı Oluştur

1. https://render.com adresine gidin
2. **Sign Up** → GitHub hesabınızla giriş yapın
3. Email doğrulaması yapın

---

## 📋 Adım 2: Yeni Web Service Oluştur

1. Render Dashboard → **New +** → **Web Service**
2. GitHub repository'nizi bağlayın
3. Ayarları yapılandırın:

### Temel Ayarlar:
- **Name**: `scangood-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` veya size yakın bölge
- **Branch**: `main` (veya default branch)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Advanced Settings:
- **Auto-Deploy**: `Yes` (GitHub push'ta otomatik deploy)
- **Health Check Path**: `/api/health`

---

## 📋 Adım 3: Environment Variables Ekle

Render Dashboard → **Environment** sekmesine gidin ve şunları ekleyin:

```
AZURE_COMPUTER_VISION_KEY=your-azure-key
AZURE_COMPUTER_VISION_ENDPOINT=your-azure-endpoint
GOOGLE_GEMINI_API_KEY=your-gemini-key
GOOGLE_CLOUD_VISION_API_KEY=your-vision-key
GOOGLE_CUSTOM_SEARCH_API_KEY=your-search-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-engine-id
NODE_ENV=production
PORT=10000
```

**Not**: Render.com otomatik olarak PORT'u ayarlar, ama backend/server.js'de `process.env.PORT || 3001` kullanıyoruz, bu yeterli.

---

## 📋 Adım 4: Backend Port Ayarları

Render.com otomatik olarak PORT environment variable'ını set eder. Backend kodunuz zaten bunu kullanıyor:

```javascript
const PORT = process.env.PORT || 3001;
```

Bu yeterli! Render.com PORT'u otomatik set edecek.

---

## 📋 Adım 5: CORS Ayarları

`backend/server.js` dosyasında CORS ayarlarını güncelleyin:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
    /\.netlify\.app$/,  // Allow all Netlify subdomains
    /\.vercel\.app$/,   // Allow all Vercel subdomains
    /\.render\.com$/,   // Allow Render deployments ✅
    /\.ngrok-free\.app$/,  // Allow ngrok free URLs
    /\.ngrok\.io$/,        // Allow ngrok.io URLs
    /\.ngrok\.app$/,       // Allow ngrok.app URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

---

## 📋 Adım 6: Frontend API URL'ini Güncelle

`src/services/apiService.js` dosyasını güncelleyin:

```javascript
const getApiBaseUrl = () => {
  try {
    // Priority 1: Environment variable (if set)
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    // Priority 2: Check if we're on Vercel or Netlify (production)
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const hostname = window.location.hostname;
      
      // If on Vercel, use Render backend
      if (hostname.includes('vercel.app')) {
        console.log('🌐 Detected Vercel, using Render backend URL');
        return 'https://scangood-backend.onrender.com/api';
      }
      
      // If on Netlify, use Render backend
      if (hostname.includes('netlify.app')) {
        console.log('🌐 Detected Netlify, using Render backend URL');
        return 'https://scangood-backend.onrender.com/api';
      }
    }

    // Priority 3: Development mode - ALWAYS use local backend
    const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;
    const isLocalhost = typeof window !== 'undefined' &&
                       (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '');

    if (isDevelopment || isLocalhost) {
      console.log('🌐 Development/Local detected, using local backend');
      return 'http://localhost:3001/api';
    }

    // Fallback: Render backend URL (production)
    console.log('🌐 Using fallback Render backend URL');
    return 'https://scangood-backend.onrender.com/api';
  } catch (error) {
    console.error('❌ Error in getApiBaseUrl:', error);
    return 'http://localhost:3001/api'; // Safe fallback
  }
};
```

**Not**: `scangood-backend.onrender.com` yerine Render.com'da oluşturduğunuz service'in URL'ini kullanın.

---

## 📋 Adım 7: Deploy

1. Render Dashboard → **Manual Deploy** → **Deploy latest commit**
2. Build loglarını izleyin
3. Deploy tamamlandığında URL'yi alın: `https://scangood-backend.onrender.com`

---

## 📋 Adım 8: Test

1. Health check: `https://scangood-backend.onrender.com/api/health`
2. Frontend'den test edin
3. Console'da API URL'ini kontrol edin

---

## ✅ Render.com Avantajları

- ✅ **Free Tier**: 750 saat/ay ücretsiz
- ✅ **Otomatik HTTPS/SSL**: Ücretsiz SSL sertifikası
- ✅ **Auto-Deploy**: GitHub push'ta otomatik deploy
- ✅ **Environment Variables**: Kolay yönetim
- ✅ **Logs**: Gerçek zamanlı log görüntüleme
- ✅ **Custom Domain**: Ücretsiz custom domain desteği
- ✅ **Daha az sorun**: Daha stabil deployment

---

## 🔧 Sorun Giderme

### Backend çalışmıyor
- Render Dashboard → **Logs** sekmesine bakın
- Environment variables'ları kontrol edin
- Build loglarını inceleyin

### CORS hatası
- `backend/server.js`'de Render.com domain'ini eklediğinizden emin olun
- Frontend URL'ini CORS origin listesine ekleyin

### Port hatası
- Render.com otomatik PORT set eder, backend kodunuz `process.env.PORT` kullanıyor mu kontrol edin

---

## 📝 Checklist

- [ ] Render.com hesabı oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Web Service oluşturuldu
- [ ] Root Directory: `backend` ayarlandı
- [ ] Build Command: `npm install` ayarlandı
- [ ] Start Command: `npm start` ayarlandı
- [ ] Environment variables eklendi
- [ ] CORS ayarları güncellendi
- [ ] Frontend API URL'i güncellendi
- [ ] Deploy yapıldı
- [ ] Health check test edildi
- [ ] Frontend'den test edildi

---

## 🎯 Sonraki Adımlar

1. Custom domain ekleyebilirsiniz (Render.com'da ücretsiz)
2. Monitoring ekleyebilirsiniz
3. Environment variables'ları kontrol edin

