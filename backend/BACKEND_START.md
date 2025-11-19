# Backend Başlatma ve API Key Ekleme

## 🚀 Backend'i Başlatın

### Adım 1: Backend Klasörüne Gidin

```bash
cd backend
```

### Adım 2: Backend'i Başlatın

```bash
npm start
```

Backend şu adreste çalışacak: `http://localhost:3000`

## 🔑 API Key Ekleme

### Adım 1: .env Dosyası Oluşturun

`backend/` klasöründe `.env` dosyası oluşturun (eğer yoksa).

### Adım 2: Google Cloud Console'da API Key Alın

1. **Google Cloud Console**: https://console.cloud.google.com/
2. Proje oluşturun veya mevcut projeyi seçin
3. **"APIs & Services" > "Library"** bölümüne gidin
4. **"Cloud Vision API"** araması yapın
5. **"Enable"** butonuna tıklayın
6. **"APIs & Services" > "Credentials"** bölümüne gidin
7. **"Create Credentials" > "API Key"** seçin
8. API key'i **kopyalayın**

### Adım 3: .env Dosyasına API Key'i Ekleyin

`.env` dosyasını açın ve şunu ekleyin:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_BURAYA
```

**Örnek:**
```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Adım 4: Backend'i Yeniden Başlatın

Backend'i durdurun (Ctrl+C) ve tekrar başlatın:

```bash
npm start
```

Backend başlarken şu mesajı görmelisiniz:
```
✅ Google Cloud Vision initialized with API key (REST API)
```

## ✅ Test

1. Tarayıcıda açın: `http://localhost:3000/api/health`
2. Şu cevabı görmelisiniz:
```json
{
  "status": "ok",
  "message": "Scan Good API is running"
}
```

## 🔧 Sorun Giderme

### Backend Başlamıyor
```bash
cd backend
npm install
npm start
```

### Port 3000 Zaten Kullanılıyor
`server.js` dosyasında PORT'u değiştirin veya başka bir port kullanın.

### API Key Çalışmıyor
- API key doğru mu? (`.env` dosyasında)
- Cloud Vision API etkin mi? (Google Cloud Console'da)
- Backend yeniden başlatıldı mı?

## 📝 Notlar

- `.env` dosyası asla GitHub'a commit edilmemeli!
- API key'i güvenli tutun
- Production'da environment variable olarak ekleyin

