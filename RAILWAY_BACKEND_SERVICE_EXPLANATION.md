# 🤔 Railway'da Backend Servisi Neden Yok?

## 📚 Açıklama

Railway'da **monorepo** (hem frontend hem backend içeren proje) kullanıyorsanız, **her biri için ayrı servis** oluşturmanız gerekir:

1. **Frontend Servisi** → Root directory: `/` (veya boş)
2. **Backend Servisi** → Root directory: `/backend`

Şu anda Railway'da sadece **frontend servisi** var. Backend servisini **manuel olarak eklemeniz** gerekiyor.

---

## 🎯 Neden İki Ayrı Servis?

- **Farklı başlatma komutları:**
  - Frontend: `expo start` veya `npm start` (Expo için)
  - Backend: `npm start` (Node.js server için)

- **Farklı portlar:**
  - Frontend: Port 8081 (Expo)
  - Backend: Port 3001 (Express server)

- **Farklı environment variables:**
  - Frontend: `REACT_APP_API_URL` (Netlify için)
  - Backend: `AZURE_COMPUTER_VISION_KEY`, `GOOGLE_GEMINI_API_KEY`, vb.

- **Farklı bağımlılıklar:**
  - Frontend: React Native, Expo
  - Backend: Express, Vision APIs

---

## ✅ Çözüm: Backend Servisini Ekleyin

### Adım 1: Railway Dashboard'da Yeni Servis Ekleme

1. **Railway Dashboard'a gidin**: https://railway.app
2. Projenize tıklayın (`scangoodapp`)
3. **Sağ üst köşede "+ New" butonuna tıklayın**
   - Veya proje sayfasında **"+ New Service"** butonuna tıklayın
4. **"GitHub Repo"** seçeneğini seçin
5. **Aynı repository'yi seçin** (zaten bağlıysa)

### Adım 2: Backend Servisini Yapılandırma

**"Configure Service"** ekranında:

1. **Root Directory:** 
   - `backend` yazın (önemli!)

2. **Start Command:**
   - `npm start` (otomatik gelir, doğru)

3. **Build Command:**
   - Boş bırakın veya `npm install`

4. **"Deploy"** butonuna tıklayın

### Adım 3: Environment Variables Ekleme

Backend servisi oluşturulduktan sonra:

1. **Backend servisine tıklayın** (artık sol menüde 2 servis görünecek)
2. **"Variables"** sekmesine tıklayın
3. Aşağıdaki environment variables'ları ekleyin:

```
AZURE_COMPUTER_VISION_KEY=your-azure-key
AZURE_COMPUTER_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
GOOGLE_GEMINI_API_KEY=your-gemini-key
GOOGLE_CUSTOM_SEARCH_API_KEY=your-search-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-engine-id
```

### Adım 4: Deploy'u Bekleyin ve Logları Kontrol Edin

1. Backend servisi deploy olmaya başlayacak
2. **"Deployments"** sekmesine gidin
3. Deploy'un tamamlanmasını bekleyin (2-5 dakika)
4. **"View Logs"** butonuna tıklayın

**Beklenen Loglar:**
```
Starting Container
> scan-good-backend@1.0.0 start
> node server.js
✅ Azure Computer Vision initialized (5,000 free requests/month)
✅ Google Gemini Vision API initialized (AI-powered product recognition)
Server is running on port 3001
```

---

## 🔍 Railway'da Servisleri Görme

Backend servisini ekledikten sonra:

1. Railway Dashboard'da projenize gidin
2. **Sol menüde 2 servis görünecek:**
   - `scangoodapp` (frontend - Expo)
   - `scangoodapp-backend` veya benzeri (backend - Node.js)

3. Her servisin kendi:
   - Deployments'ı var
   - Variables'ı var
   - Logs'u var
   - URL'i var

---

## 🌐 Backend URL'ini Bulma

Backend servisi deploy olduktan sonra:

1. Backend servisine tıklayın
2. **"Settings"** sekmesine gidin
3. **"Generate Domain"** butonuna tıklayın (eğer yoksa otomatik oluşturulur)
4. Backend URL'ini kopyalayın

Genellikle şöyle görünür:
```
https://scangoodapp-backend-production.up.railway.app
```

Veya:
```
https://backend-production-xxxx.up.railway.app
```

---

## 🔗 Frontend'i Backend'e Bağlama

Backend URL'ini bulduktan sonra:

1. **Netlify Dashboard'a gidin**
2. **"Site settings"** > **"Environment variables"**
3. `REACT_APP_API_URL` değişkenini güncelleyin:
   - Yeni değer: `https://scangoodapp-backend-production.up.railway.app/api`
4. **Deploy'u yeniden başlatın**

---

## 📝 Özet

**Sorun:** Railway'da sadece frontend servisi var, backend servisi yok.

**Çözüm:** 
1. Railway'da "+ New Service" ile backend servisi ekleyin
2. Root Directory: `backend` ayarlayın
3. Environment variables'ları ekleyin
4. Deploy'u bekleyin
5. Backend URL'ini bulun
6. Frontend'i yeni backend URL'ine bağlayın

---

## 🆘 Hala Sorun Varsa

1. Railway Dashboard'da kaç servis görüyorsunuz?
2. Backend servisi ekledikten sonra loglarda ne görüyorsunuz?
3. Backend URL'ini test ettiniz mi? (`/api/health`)

Bu bilgilerle daha fazla yardımcı olabilirim!

