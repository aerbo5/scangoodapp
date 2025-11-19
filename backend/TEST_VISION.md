# Google Vision API Test Rehberi

## Hızlı Başlangıç

Google Vision API'yi gerçek veri ile test etmek için:

### 1. Google Cloud Console'dan API Key Alın

1. https://console.cloud.google.com/ adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. **"APIs & Services" > "Library"** bölümüne gidin
4. "Cloud Vision API" araması yapın ve **"Enable"** butonuna tıklayın
5. **"APIs & Services" > "Credentials"** bölümüne gidin
6. **"Create Credentials" > "API Key"** seçin
7. API key'i kopyalayın

### 2. Backend'e API Key Ekleyin

`backend` klasöründe `.env` dosyası oluşturun:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_HERE
PORT=3000
```

**Örnek:**
```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### 3. Backend'i Başlatın

```bash
cd backend
npm start
```

Backend başladığında şu mesajı görmelisiniz:
```
✅ Google Cloud Vision initialized with API key (REST API)
```

### 4. Test Endpoint'ini Kullanın

#### cURL ile Test:

```bash
curl -X POST http://localhost:3000/api/test/vision \
  -F "image=@/path/to/your/image.jpg"
```

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/test/vision `
  -F "image=@C:\path\to\your\image.jpg"
```

#### Postman ile Test:

1. Postman'i açın
2. Yeni bir POST request oluşturun
3. URL: `http://localhost:3000/api/test/vision`
4. Body sekmesine gidin
5. **form-data** seçin
6. Key: `image` (tip: File)
7. Value: Bir resim dosyası seçin
8. Send butonuna tıklayın

#### JavaScript/Fetch ile Test:

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/api/test/vision', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### 5. Test Sonuçları

Başarılı bir test sonucu şöyle görünecek:

```json
{
  "success": true,
  "message": "✅ Google Vision API is configured and working!",
  "usingRealAPI": true,
  "results": {
    "imageSize": 123456,
    "imageType": "image/jpeg",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "ocr": {
      "success": true,
      "text": "Detected text from image...",
      "textLength": 150
    },
    "barcode": {
      "success": true,
      "value": "1234567890123"
    },
    "labels": {
      "success": true,
      "count": 5,
      "labels": [
        {
          "description": "Food",
          "score": 0.95
        },
        ...
      ]
    }
  }
}
```

## Test Senaryoları

### 1. Fiş/Receipt OCR Testi
- Bir market fişi fotoğrafı çekin
- `/api/test/vision` endpoint'ine gönderin
- `ocr.text` alanında fişteki metin görünecek

### 2. Barkod Testi
- Bir ürünün barkodunu çekin
- `/api/test/vision` endpoint'ine gönderin
- `barcode.value` alanında barkod numarası görünecek

### 3. Ürün Tanıma Testi
- Bir ürün fotoğrafı çekin (örn: elma, ekmek)
- `/api/test/vision` endpoint'ine gönderin
- `labels.labels` alanında ürün etiketleri görünecek

## Mevcut Endpoint'ler

Tüm endpoint'ler artık gerçek Google Vision API kullanıyor:

- **POST /api/scan/receipt** - Fiş tarama (OCR)
- **POST /api/scan/barcode** - Barkod tarama
- **POST /api/scan/product** - Ürün tanıma (Label Detection)
- **POST /api/test/vision** - Tüm Vision özelliklerini test et

## Sorun Giderme

### "Google Vision API not configured" mesajı görüyorsanız:
- `.env` dosyasının `backend` klasöründe olduğundan emin olun
- API key'in doğru olduğundan emin olun
- Backend'i yeniden başlatın

### "Error in OCR (REST API)" hatası alıyorsanız:
- API key'in geçerli olduğundan emin olun
- Cloud Vision API'nin etkinleştirildiğinden emin olun
- API key'in kısıtlamalarını kontrol edin (IP, referrer, vb.)

### API Key Kısıtlamaları:
- Production'da API key'i kısıtlamak önerilir
- Test için "None" (kısıtlama yok) seçebilirsiniz
- Daha güvenli için Service Account Key kullanın (GOOGLE_VISION_SETUP.md'ye bakın)

## Fiyatlandırma

- **Ücretsiz Tier:** Ayda ilk 1,000 istek ücretsiz
- **Sonrası:** Her 1,000 istek için ~$1.50
- Detaylar: https://cloud.google.com/vision/pricing

## Notlar

- API key'i **GIT'e commit etmeyin!** (`.env` dosyası `.gitignore`'da olmalı)
- Production'da Service Account Key kullanmak daha güvenlidir
- Test için API key yeterlidir

