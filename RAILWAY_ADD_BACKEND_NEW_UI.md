# 🚀 Railway'da Backend Servisi Ekleme (Yeni Arayüz)

Railway'ın yeni arayüzünde backend servisini ekleme adımları:

---

## ⚡ Adım 1: Yeni Servis Ekleme

1. **Railway Dashboard'a gidin**: https://railway.app
2. Projenize tıklayın (`scangoodapp`)
3. **Sağ üst köşede "+ New" butonuna tıklayın**
   - Veya proje sayfasında **"+ New Service"** butonuna tıklayın
4. **"GitHub Repo"** seçeneğini seçin
5. **Aynı repository'yi seçin** (zaten bağlıysa)
6. Servis oluşturulacak ve otomatik deploy başlayacak

---

## ⚙️ Adım 2: Backend Servisini Yapılandırma

Yeni servis oluşturulduktan sonra:

1. **Yeni servise tıklayın** (sol menüde görünecek)
2. **"Settings"** sekmesine tıklayın
3. **"Source"** sekmesine gidin

### Source Sekmesinde:

1. **"Root Directory"** alanını bulun
2. **`backend`** yazın
3. **"Save"** butonuna tıklayın

### Deploy Sekmesinde:

1. **"Deploy"** sekmesine gidin
2. **"Start Command"** alanını kontrol edin
   - `npm start` olmalı (otomatik gelir)
   - Eğer yoksa, `npm start` yazın
3. **"Save"** butonuna tıklayın

---

## 🔄 Adım 3: Deploy'u Yeniden Başlatma

Ayarları değiştirdikten sonra:

1. **"Deployments"** sekmesine gidin
2. **"Redeploy"** butonuna tıklayın
3. Deploy'un tamamlanmasını bekleyin (2-5 dakika)

---

## 🔑 Adım 4: Environment Variables Ekleme

1. Backend servisine tıklayın
2. **"Variables"** sekmesine tıklayın
3. **"+ New Variable"** butonuna tıklayın
4. Aşağıdaki environment variables'ları ekleyin:

#### Azure Computer Vision:
- **Name:** `AZURE_COMPUTER_VISION_KEY`
- **Value:** Azure portal'dan kopyaladığınız API key
- **"Add"** butonuna tıklayın

- **Name:** `AZURE_COMPUTER_VISION_ENDPOINT`
- **Value:** Azure portal'dan kopyaladığınız endpoint URL
- **"Add"** butonuna tıklayın

#### Google Gemini:
- **Name:** `GOOGLE_GEMINI_API_KEY`
- **Value:** Google AI Studio'dan aldığınız API key
- **"Add"** butonuna tıklayın

#### Google Custom Search:
- **Name:** `GOOGLE_CUSTOM_SEARCH_API_KEY`
- **Value:** Google Cloud Console'dan aldığınız API key
- **"Add"** butonuna tıklayın

- **Name:** `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`
- **Value:** Google Custom Search Engine ID'niz
- **"Add"** butonuna tıklayın

---

## 📊 Adım 5: Logları Kontrol Etme

1. Backend servisine tıklayın
2. **"Deployments"** sekmesine gidin
3. Son deployment'ı seçin
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

## 🌐 Adım 6: Backend URL'ini Bulma

1. Backend servisine tıklayın
2. **"Settings"** sekmesine gidin
3. **"Networking"** sekmesine gidin
4. **"Generate Domain"** butonuna tıklayın (eğer yoksa otomatik oluşturulur)
5. Backend URL'ini kopyalayın

Genellikle şöyle görünür:
```
https://scangoodapp-backend-production.up.railway.app
```

---

## 🔗 Adım 7: Frontend'i Backend'e Bağlama

Backend URL'ini bulduktan sonra:

1. **Netlify Dashboard'a gidin**
2. **"Site settings"** > **"Environment variables"**
3. `REACT_APP_API_URL` değişkenini güncelleyin:
   - Yeni değer: `https://scangoodapp-backend-production.up.railway.app/api`
4. **Deploy'u yeniden başlatın**

---

## 📝 Settings Sekmeleri Açıklaması

Railway'ın yeni arayüzünde Settings'te şu sekmeler var:

- **Source:** Repository, branch, root directory ayarları
- **Networking:** Domain, port ayarları
- **Build:** Build command, build directory ayarları
- **Deploy:** Start command, restart policy ayarları
- **Config-as-code:** Railway.json dosyası ayarları
- **Danger:** Servis silme, reset gibi tehlikeli işlemler

**Backend için önemli olanlar:**
- **Source** → Root Directory: `backend`
- **Deploy** → Start Command: `npm start`

---

## ✅ Checklist

- [ ] Railway'da yeni servis ekledim
- [ ] Settings → Source → Root Directory: `backend` ayarladım
- [ ] Settings → Deploy → Start Command: `npm start` kontrol ettim
- [ ] Deploy'u yeniden başlattım
- [ ] Environment variables'ları ekledim
- [ ] Backend loglarında `✅ Azure Computer Vision initialized` mesajını gördüm
- [ ] Backend URL'ini buldum
- [ ] Frontend'i yeni backend URL'ine bağladım

---

## 🆘 Sorun Yaşıyorsanız

1. **Root Directory ayarı kayboluyor:**
   - Settings → Source → Root Directory: `backend` yazın
   - Save butonuna tıklayın
   - Deploy'u yeniden başlatın

2. **Deploy başarısız:**
   - Logları kontrol edin
   - `package.json` dosyasının `backend` klasöründe olduğundan emin olun

3. **Environment variables yüklenmiyor:**
   - Backend servisinin "Variables" sekmesine gidin
   - Tüm değişkenleri eklediğinizden emin olun
   - Deploy'u yeniden başlatın

Bu adımları takip ederek backend servisini ekleyebilirsiniz!

