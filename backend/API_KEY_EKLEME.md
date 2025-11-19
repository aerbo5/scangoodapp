# API Key Ekleme - Adım Adım

## ✅ .env Dosyası Oluşturuldu!

Şimdi Google Vision API key'i eklemeniz gerekiyor.

## 🔑 Adım 1: Google Cloud Console'da API Key Alın

### 1. Google Cloud Console'a Gidin
https://console.cloud.google.com/

### 2. Proje Oluşturun veya Seçin
- Yeni proje oluşturun: "Scan Good" (veya istediğiniz isim)
- Veya mevcut bir projeyi seçin

### 3. Cloud Vision API'yi Etkinleştirin
1. **"APIs & Services" > "Library"** bölümüne gidin
2. **"Cloud Vision API"** araması yapın
3. **"Cloud Vision API"**'yi seçin
4. **"Enable"** butonuna tıklayın

### 4. API Key Oluşturun
1. **"APIs & Services" > "Credentials"** bölümüne gidin
2. **"Create Credentials" > "API Key"** seçin
3. API key oluşturulacak, **kopyalayın**

## 📝 Adım 2: .env Dosyasına API Key'i Ekleyin

### Windows'ta:

1. `backend/` klasörüne gidin
2. `.env` dosyasını Notepad veya herhangi bir metin editörü ile açın
3. İçeriği şu şekilde değiştirin:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_BURAYA_YAPIŞTIRIN
```

**Örnek:**
```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. Dosyayı kaydedin

### PowerShell ile (Alternatif):

```powershell
cd backend
notepad .env
```

Notepad açılacak, API key'i yapıştırın ve kaydedin.

## 🚀 Adım 3: Backend'i Yeniden Başlatın

1. Backend'i durdurun (Ctrl+C)
2. Tekrar başlatın:

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

## 🔒 Güvenlik İçin API Key'i Kısıtlayın

1. Google Cloud Console'da API key'inize tıklayın
2. **"API restrictions"** bölümünde **"Restrict key"** seçin
3. Sadece **"Cloud Vision API"** seçin
4. **"Save"** tıklayın

## ⚠️ Önemli Notlar

- `.env` dosyası asla GitHub'a commit edilmemeli!
- API key'i güvenli tutun
- Production'da environment variable olarak ekleyin

## 🎯 Sonuç

API key eklendikten sonra:
- ✅ Backend gerçek Google Vision API kullanacak
- ✅ Kamera ile çektiğiniz görüntüler gerçek sonuçlar verecek
- ✅ Dummy data kullanılmayacak!

