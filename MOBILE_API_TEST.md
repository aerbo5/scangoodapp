# 📱 Telefonda Google Vision API ve Custom Search API Test Rehberi

Bu rehber, Google Vision API ve Google Custom Search API'yi telefonda test etmek için adım adım talimatlar içerir.

## ✅ Ön Gereksinimler

1. **Google Vision API Key** (varsa)
2. **Google Custom Search API Key** (varsa)
3. **Google Custom Search Engine ID** (varsa)
4. **Ngrok** kurulu olmalı

---

## 📋 Adım 1: Backend'de API Key'leri Ayarlayın

### 1.1 Backend klasöründe `.env` dosyası oluşturun

`backend` klasöründe `.env` dosyası oluşturun (eğer yoksa):

```bash
cd backend
```

### 1.2 `.env` dosyasına API key'leri ekleyin

`backend/.env` dosyasını açın ve şu satırları ekleyin:

```env
# Google Vision API
GOOGLE_CLOUD_VISION_API_KEY=your-vision-api-key-here

# Google Custom Search API
GOOGLE_CUSTOM_SEARCH_API_KEY=your-custom-search-api-key-here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-search-engine-id-here

# Server Port
PORT=3000
```

**Not:** API key'leriniz yoksa, dummy data kullanılacak (gerçek sonuçlar yerine test verileri).

---

## 📋 Adım 2: Backend'i Başlatın

Yeni bir terminal/PowerShell penceresi açın:

```bash
cd backend
npm start
```

Backend `http://localhost:3000` adresinde çalışacak.

**Kontrol:** Tarayıcıda `http://localhost:3000/api/health` adresine gidin, `{"status":"ok"}` görmelisiniz.

---

## 📋 Adım 3: Ngrok ile Backend'i Dışarıya Açın

### 3.1 Ngrok'u başlatın

**Yeni bir terminal/PowerShell penceresi açın** (backend çalışırken):

```bash
ngrok http 3000
```

### 3.2 Ngrok URL'ini kopyalayın

Ngrok size şöyle bir çıktı verecek:

```
Forwarding  https://xxxxx.ngrok-free.app -> http://localhost:3000
```

**`https://xxxxx.ngrok-free.app`** URL'ini kopyalayın (örnek: `https://abc123.ngrok-free.app`)

**ÖNEMLİ:** Bu URL'i not edin, frontend'te kullanacağız!

---

## 📋 Adım 4: Backend CORS Ayarlarını Güncelleyin

Ngrok URL'ini backend'e eklemek için `backend/server.js` dosyasını güncelleyin:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
    /\.netlify\.app$/,
    /\.railway\.app$/,
    /\.render\.com$/,
    /\.ngrok-free\.app$/,  // Ngrok URL'leri için
    /\.ngrok\.io$/,        // Eski ngrok formatı için
  ],
  // ...
}));
```

**Not:** Bu değişiklik zaten yapılmış olabilir, kontrol edin.

---

## 📋 Adım 5: Frontend'te Ngrok URL'ini Güncelleyin

`src/services/apiService.js` dosyasını açın ve ngrok URL'inizi ekleyin:

```javascript
const getApiBaseUrl = () => {
  // Development mode
  if (__DEV__) {
    return 'https://xxxxx.ngrok-free.app/api';  // Ngrok URL'inizi buraya yapıştırın
  }
  // ...
};
```

**Örnek:**
```javascript
if (__DEV__) {
  return 'https://abc123.ngrok-free.app/api';  // Sizin ngrok URL'iniz
}
```

**ÖNEMLİ:** URL'in sonunda `/api` olmalı!

---

## 📋 Adım 6: Frontend'i Başlatın

Ana klasörde (backend ve ngrok çalışırken):

```bash
# Ana klasörde
npx expo start --tunnel
```

Bu size bir QR kod verecek.

---

## 📋 Adım 7: Telefonda Test Edin

### 7.1 Expo Go ile QR kodu tarayın

1. Telefonunuzda **Expo Go** uygulamasını açın
2. QR kodu tarayın
3. Uygulama yüklenecek

### 7.2 Kamera ile test edin

1. Uygulamada **kamera** ekranına gidin
2. Bir ürün resmi çekin (örn: avokado, coca cola)
3. **Continue** butonuna basın
4. Backend resmi analiz edecek:
   - Google Vision API ile ürün etiketleri tespit edilecek
   - Google Custom Search API ile ürün linkleri bulunacak

### 7.3 Sonuçları kontrol edin

- Ürün detayları görünmeli
- Ürün linkleri (Amazon, Target, Walmart) görünmeli
- Eğer API key'ler yoksa, dummy data gösterilecek

---

## 🔍 API Key'lerin Çalışıp Çalışmadığını Kontrol Edin

### Backend loglarını kontrol edin

Backend terminalinde şu mesajları görmelisiniz:

**Vision API için:**
- ✅ `Google Cloud Vision initialized with API key (REST API)` → API çalışıyor
- ⚠️ `Google Cloud Vision not configured - using dummy data` → API key yok, dummy data kullanılıyor

**Custom Search API için:**
- ✅ Sonuçlar geliyorsa → API çalışıyor
- ⚠️ `Google Custom Search API not configured` → API key yok, dummy data kullanılıyor

---

## 🐛 Sorun Giderme

### Sorun 1: Backend'e bağlanamıyorum

**Çözüm:**
- Backend çalışıyor mu? → `http://localhost:3000/api/health` kontrol edin
- Ngrok çalışıyor mu? → Ngrok terminalinde URL görünüyor mu?
- Frontend'te URL doğru mu? → `apiService.js` dosyasını kontrol edin

### Sorun 2: API key'ler çalışmıyor

**Çözüm:**
- `.env` dosyası `backend` klasöründe mi?
- API key'ler doğru mu? → Google Cloud Console'dan kontrol edin
- Backend'i yeniden başlattınız mı? → `.env` değişiklikleri için restart gerekir

### Sorun 3: CORS hatası alıyorum

**Çözüm:**
- `backend/server.js` dosyasında ngrok URL pattern'i var mı?
- Backend'i yeniden başlattınız mı?

### Sorun 4: Ngrok URL'i değişti

**Çözüm:**
- Her ngrok başlatışında URL değişir
- Yeni URL'i `apiService.js` dosyasına güncelleyin
- Frontend'i yeniden başlatın

---

## ✅ Kontrol Listesi

- [ ] Backend `.env` dosyası oluşturuldu
- [ ] API key'ler `.env` dosyasına eklendi
- [ ] Backend başlatıldı (`npm start`)
- [ ] Backend çalışıyor (`http://localhost:3000/api/health`)
- [ ] Ngrok başlatıldı (`ngrok http 3000`)
- [ ] Ngrok URL'i kopyalandı
- [ ] Frontend'te ngrok URL'i güncellendi
- [ ] Frontend başlatıldı (`npx expo start --tunnel`)
- [ ] Telefonda QR kod tarandı
- [ ] Kamera ile resim çekildi
- [ ] Sonuçlar görüntülendi

---

## 🎯 Sonuç

Başarılı olursanız:
- ✅ Google Vision API çalışıyor → Gerçek ürün etiketleri
- ✅ Google Custom Search API çalışıyor → Gerçek ürün linkleri
- ✅ Telefonda test edebiliyorsunuz

API key'ler yoksa:
- ⚠️ Dummy data kullanılıyor → Test verileri gösterilecek

---

## 📝 Notlar

1. **Ngrok URL'i geçicidir**: Her ngrok başlatışında URL değişir
2. **Ücretsiz ngrok**: 8 saat sonra otomatik kapanır
3. **API key'ler**: Google Cloud Console'dan alabilirsiniz
4. **Production için**: Railway, Render veya Heroku'ya deploy edin

---

## 🔗 İlgili Dosyalar

- `backend/server.js` - Backend server
- `backend/services/visionService.js` - Vision API servisi
- `backend/services/productSearchService.js` - Custom Search servisi
- `src/services/apiService.js` - Frontend API servisi
- `NGROK_SETUP.md` - Ngrok kurulum rehberi
- `backend/GOOGLE_SEARCH_SETUP.md` - Google Search API kurulumu


