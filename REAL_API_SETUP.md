# Gerçek Google Vision API Kurulumu

## 🔍 Sorun
Uygulama çalışıyor ama kamera ile çektiğiniz görüntülerin sonuçları gerçek değil (dummy data kullanılıyor).

## ✅ Çözüm: Google Vision API'yi Yapılandırın

### Adım 1: Backend'in Çalıştığından Emin Olun

Backend çalışıyor mu kontrol edin:

```bash
cd backend
npm start
```

Backend şu adreste çalışmalı: `http://localhost:3000` (veya ngrok URL'i)

### Adım 2: Google Cloud Console'da API Key Oluşturun

1. **Google Cloud Console**: https://console.cloud.google.com/
2. Proje oluşturun veya mevcut projeyi seçin
3. **"APIs & Services" > "Library"** bölümüne gidin
4. **"Cloud Vision API"** araması yapın
5. **"Enable"** butonuna tıklayın

### Adım 3: API Key Oluşturun

1. **"APIs & Services" > "Credentials"** bölümüne gidin
2. **"Create Credentials" > "API Key"** seçin
3. API key oluşturulacak, **kopyalayın**

### Adım 4: Backend'e API Key'i Ekleyin

1. `backend/` klasörüne gidin
2. `.env` dosyası oluşturun (eğer yoksa):

```bash
cd backend
```

3. `.env` dosyasına şunu ekleyin:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_BURAYA
```

**Örnek:**
```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Adım 5: Backend'i Yeniden Başlatın

```bash
cd backend
npm start
```

Backend başlarken şu mesajı görmelisiniz:
```
✅ Google Cloud Vision initialized with API key (REST API)
```

### Adım 6: API Key'i Kısıtlayın (Güvenlik İçin)

1. Google Cloud Console'da API key'inize tıklayın
2. **"API restrictions"** bölümünde **"Restrict key"** seçin
3. Sadece **"Cloud Vision API"** seçin
4. **"Save"** tıklayın

## ✅ Test

1. Backend çalışıyor mu? (`http://localhost:3000/api/health`)
2. Frontend backend'e bağlanıyor mu?
3. Kamera ile görüntü çekin
4. Sonuçlar gerçek mi? (Artık dummy data değil!)

## 🔧 Sorun Giderme

### Backend Çalışmıyor
```bash
cd backend
npm install
npm start
```

### API Key Çalışmıyor
- API key doğru mu? (`.env` dosyasında)
- Cloud Vision API etkin mi? (Google Cloud Console'da)
- Backend yeniden başlatıldı mı?

### Frontend Backend'e Bağlanamıyor
- Backend URL'i doğru mu? (`src/services/apiService.js` dosyasında)
- CORS ayarları doğru mu? (`backend/server.js` dosyasında)

## 📝 Notlar

- **Local Development**: Backend `http://localhost:3000` adresinde çalışmalı
- **Production**: Backend Railway/Render'da deploy edilmeli
- **API Key**: Asla GitHub'a commit etmeyin! (`.env` dosyası `.gitignore`'da olmalı)

## 🎯 Sonuç

Google Vision API yapılandırıldıktan sonra:
- ✅ OCR (metin okuma) çalışacak
- ✅ Barcode detection çalışacak
- ✅ Product label detection çalışacak
- ✅ Gerçek sonuçlar alacaksınız!


