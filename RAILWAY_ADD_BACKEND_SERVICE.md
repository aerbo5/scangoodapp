# 🚀 Railway'a Backend Servisi Ekleme

Railway'da sadece frontend servisi var. Backend servisini eklemeniz gerekiyor.

---

## ⚡ Hızlı Adımlar

### 1. Railway Dashboard'da Yeni Servis Ekleme

1. **Railway Dashboard'a gidin**: https://railway.app
2. Projenize tıklayın (`scangoodapp`)
3. **Sağ üst köşede "+ New" butonuna tıklayın**
4. **"GitHub Repo"** seçeneğini seçin
5. Repository'nizi seçin (zaten bağlıysa aynı repo'yu seçin)

### 2. Backend Servisini Yapılandırma

1. **"Configure Service"** ekranında:
   - **Root Directory:** `backend` yazın
   - **Start Command:** `npm start` (otomatik gelir)
   - **Build Command:** Boş bırakın veya `npm install`

2. **"Deploy"** butonuna tıklayın

### 3. Environment Variables Ekleme

Backend servisi oluşturulduktan sonra:

1. **Backend servisine tıklayın** (sol menüde görünecek)
2. **"Variables"** sekmesine tıklayın
3. Aşağıdaki environment variables'ları ekleyin:

#### ✅ Zorunlu Environment Variables:

**Azure Computer Vision:**
- `AZURE_COMPUTER_VISION_KEY` - Azure portal'dan API key
- `AZURE_COMPUTER_VISION_ENDPOINT` - Azure portal'dan endpoint URL

**Google Gemini:**
- `GOOGLE_GEMINI_API_KEY` - Google AI Studio'dan API key

**Google Custom Search:**
- `GOOGLE_CUSTOM_SEARCH_API_KEY` - Google Cloud Console'dan API key
- `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` - Google Custom Search Engine ID

**Server:**
- `PORT` - Railway otomatik ayarlar (genellikle gerekmez)
- `NODE_ENV` - `production` (opsiyonel)

### 4. Deploy'u Bekleyin

1. Backend servisi deploy olmaya başlayacak
2. **"Deployments"** sekmesine gidin
3. Deploy'un tamamlanmasını bekleyin (2-5 dakika)
4. **"View Logs"** butonuna tıklayın

### 5. Logları Kontrol Edin

Backend loglarında şunları görmelisiniz:

```
Starting Container
> scan-good-backend@1.0.0 start
> node server.js
✅ Azure Computer Vision initialized (5,000 free requests/month)
✅ Google Gemini Vision API initialized (AI-powered product recognition)
Server is running on port 3001
```

---

## 📋 Alternatif: Mevcut Servisi Backend Olarak Yapılandırma

Eğer ayrı servis eklemek istemiyorsanız:

1. Mevcut servise tıklayın
2. **"Settings"** sekmesine gidin
3. **"Root Directory"** ayarını `backend` olarak değiştirin
4. **"Start Command"** ayarını `npm start` olarak değiştirin
5. **"Save"** butonuna tıklayın
6. Deploy'u yeniden başlatın

**⚠️ Not:** Bu durumda frontend çalışmayacak. Frontend için Netlify kullanıyorsunuz, bu yüzden sorun değil.

---

## ✅ Kontrol

### 1. Backend URL'ini Test Edin

Backend servisi deploy olduktan sonra:

1. Backend servisine tıklayın
2. **"Settings"** sekmesine gidin
3. **"Generate Domain"** butonuna tıklayın (eğer yoksa)
4. Backend URL'ini kopyalayın

Veya Railway otomatik olarak bir URL oluşturur. Genellikle:
```
https://scangoodapp-backend-production.up.railway.app
```

### 2. Health Check

Tarayıcıda şu URL'yi açın:
```
https://scangoodapp-backend-production.up.railway.app/api/health
```

Beklenen: `{"status":"ok","message":"Scan Good API is running"}`

### 3. Debug Endpoint

```
https://scangoodapp-backend-production.up.railway.app/api/debug/env
```

Bu endpoint environment variables durumunu gösterir.

---

## 🔧 Frontend'i Backend URL'ine Bağlama

Backend URL'i değiştiyse, frontend'i güncellemeniz gerekebilir:

1. Netlify Dashboard'a gidin
2. **"Site settings"** > **"Environment variables"**
3. `REACT_APP_API_URL` değişkenini güncelleyin:
   - Yeni değer: `https://scangoodapp-backend-production.up.railway.app/api`
4. Deploy'u yeniden başlatın

---

## 📝 Checklist

- [ ] Railway'da yeni servis ekledim (backend)
- [ ] Root Directory: `backend` ayarladım
- [ ] Start Command: `npm start` ayarladım
- [ ] Environment variables'ları ekledim
- [ ] Deploy'un tamamlanmasını bekledim
- [ ] Backend loglarında `✅ Azure Computer Vision initialized` mesajını gördüm
- [ ] Backend URL'ini test ettim (`/api/health`)
- [ ] Frontend'i yeni backend URL'ine bağladım (gerekirse)

---

## 🆘 Sorun Yaşıyorsanız

1. **Backend servisi görünmüyor:**
   - Railway Dashboard'da "+ New" butonuna tıklayın
   - GitHub Repo seçin
   - Root Directory: `backend` yazın

2. **Deploy başarısız:**
   - Logları kontrol edin
   - `package.json` dosyasının `backend` klasöründe olduğundan emin olun

3. **Environment variables yüklenmiyor:**
   - Backend servisinin "Variables" sekmesine gidin
   - Tüm değişkenleri eklediğinizden emin olun
   - Deploy'u yeniden başlatın

Bu adımları takip ederek backend servisini ekleyebilirsiniz!

