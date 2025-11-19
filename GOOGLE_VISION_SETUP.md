# Google Cloud Vision API Kurulumu

## Durum
Şu anda Google Cloud Vision API yapılandırılmamış, bu yüzden dummy data kullanılıyor. Gerçek scan işlemleri için API'yi yapılandırmanız gerekiyor.

## Adım 1: Google Cloud Console'da Proje Oluşturun

1. https://console.cloud.google.com/ adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. Proje adı: "Scan Good" (veya istediğiniz bir isim)

## Adım 2: Vision API'yi Etkinleştirin

1. Google Cloud Console'da **"APIs & Services" > "Library"** bölümüne gidin
2. "Cloud Vision API" araması yapın
3. **"Cloud Vision API"**'yi seçin ve **"Enable"** butonuna tıklayın

## Adım 3: Service Account Key Oluşturun

### Yöntem 1: Service Account Key (Önerilen)

1. **"APIs & Services" > "Credentials"** bölümüne gidin
2. **"Create Credentials" > "Service Account"** seçin
3. Service account adı verin (örn: "scan-good-vision")
4. **"Create and Continue"** tıklayın
5. Role olarak **"Cloud Vision API User"** seçin
6. **"Done"** tıklayın
7. Oluşturulan service account'a tıklayın
8. **"Keys"** sekmesine gidin
9. **"Add Key" > "Create new key"** seçin
10. **"JSON"** formatını seçin ve **"Create"** tıklayın
11. JSON dosyası indirilecek (örn: `scan-good-vision-xxxxx.json`)

### Yöntem 2: API Key (Daha Basit ama Daha Az Güvenli)

1. **"APIs & Services" > "Credentials"** bölümüne gidin
2. **"Create Credentials" > "API Key"** seçin
3. API key oluşturulacak, kopyalayın

## Adım 4: Backend'e Key'i Ekleyin

### Service Account Key Kullanıyorsanız:

1. İndirdiğiniz JSON dosyasını `backend/` klasörüne kopyalayın
2. Dosya adını `google-vision-key.json` olarak değiştirin (veya istediğiniz bir isim)
3. `.env` dosyası oluşturun:

```bash
cd backend
```

`.env` dosyası oluşturun ve şunu ekleyin:

```env
GOOGLE_CLOUD_VISION_KEY_FILE=./google-vision-key.json
```

### API Key Kullanıyorsanız:

`.env` dosyası oluşturun:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_HERE
```

**Not:** API key ile çalışmak için visionService.js'de REST API kullanımı eklenmesi gerekir. Service account key önerilir.

## Adım 5: .env Dosyasını Oluşturun

Backend klasöründe `.env` dosyası oluşturun:

**Windows PowerShell:**
```powershell
cd backend
New-Item -Path .env -ItemType File
```

**Sonra .env dosyasını açıp şunu ekleyin:**
```
GOOGLE_CLOUD_VISION_KEY_FILE=./google-vision-key.json
```

## Adım 6: Backend'i Yeniden Başlatın

1. Backend terminalinde `Ctrl+C` ile durdurun
2. Yeniden başlatın:
   ```bash
   cd backend
   npm start
   ```

Backend başladığında şu mesajı görmelisiniz:
```
✅ Google Cloud Vision initialized with service account key
```

## Adım 7: Test Edin

1. Uygulamada bir scan işlemi yapın
2. Artık gerçek Google Vision API kullanılacak!

## Sorun Giderme

### "Failed to initialize" hatası?
- JSON dosyasının doğru yolda olduğundan emin olun
- `.env` dosyasındaki path'in doğru olduğundan emin olun
- JSON dosyasının geçerli olduğundan emin olun

### "Permission denied" hatası?
- Service account'a "Cloud Vision API User" rolünün verildiğinden emin olun
- API'nin etkinleştirildiğinden emin olun

### Hala dummy data dönüyor?
- Backend loglarını kontrol edin
- `visionClient` null ise, yapılandırma başarısız olmuş demektir

## Notlar

- **Service Account Key** önerilir çünkü daha güvenlidir
- JSON key dosyasını **GIT'e commit etmeyin!** (zaten .gitignore'da var)
- Ücretsiz tier: Ayda 1000 istek ücretsiz
- Fiyatlandırma: https://cloud.google.com/vision/pricing



