# ⚡ Render.com Quick Start - Hızlı Başlangıç

## 🎯 5 Adımda Render.com'a Geçiş

### 1️⃣ Render.com Hesabı Oluştur (2 dakika)

1. https://render.com
2. **Sign Up** → GitHub ile giriş yap
3. Email doğrulaması yap

### 2️⃣ Yeni Web Service Oluştur (3 dakika)

1. Dashboard → **New +** → **Web Service**
2. GitHub repo'yu seç
3. Ayarlar:
   - **Name**: `scangood-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### 3️⃣ Environment Variables Ekle (2 dakika)

**Environment** sekmesine git ve ekle:

```
AZURE_COMPUTER_VISION_KEY=your-key
AZURE_COMPUTER_VISION_ENDPOINT=your-endpoint
GOOGLE_GEMINI_API_KEY=your-key
GOOGLE_CLOUD_VISION_API_KEY=your-key
GOOGLE_CUSTOM_SEARCH_API_KEY=your-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-id
```

### 4️⃣ Deploy (5 dakika)

1. **Manual Deploy** → **Deploy latest commit**
2. Build loglarını izle
3. URL'yi al: `https://scangood-backend.onrender.com`

### 5️⃣ Frontend'i Güncelle (1 dakika)

✅ Zaten güncellendi! `src/services/apiService.js` dosyası Render.com URL'ini kullanıyor.

---

## ✅ Tamamlandı!

Artık backend Render.com'da çalışıyor.

---

## 🔍 Test

1. Health check: `https://scangood-backend.onrender.com/api/health`
2. Frontend'den ürün tarama yap
3. Console'da API URL'ini kontrol et

---

## 📝 Notlar

- **Free Tier**: 750 saat/ay ücretsiz
- **Auto-Deploy**: GitHub push'ta otomatik deploy
- **HTTPS**: Otomatik SSL sertifikası
- **Logs**: Gerçek zamanlı log görüntüleme

