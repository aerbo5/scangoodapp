# 📄 Uzun Fatura OCR Optimizasyonu

## 🎯 Problem

Uzun faturalar (çok satırlı, büyük görüntüler) OCR işlemi sırasında timeout olabilir veya tüm metin çıkarılamayabilir.

## ✅ Yapılan Optimizasyonlar

### 1. **Dosya Boyutu Limiti Artırıldı**
- **Önceki**: 10MB
- **Yeni**: 20MB
- **Konum**: `backend/server.js` - multer fileSize limit

### 2. **Azure OCR Polling Süresi Artırıldı**
- **Önceki**: Sabit 20 deneme (20 saniye)
- **Yeni**: Görüntü boyutuna göre dinamik:
  - **Temel**: 30 deneme (30 saniye)
  - **Ek**: Her MB için +10 deneme
  - **Maksimum**: 90 deneme (90 saniye)
- **Örnek**: 
  - 2MB görüntü → 30 + 20 = 50 deneme (50 saniye)
  - 5MB görüntü → 30 + 50 = 80 deneme (80 saniye)
  - 10MB görüntü → 30 + 100 = 90 deneme (90 saniye - maksimum)

### 3. **Request Timeout'ları Artırıldı**
- **Azure OCR İlk Request**: 
  - **Önceki**: 30 saniye
  - **Yeni**: Görüntü boyutuna göre dinamik (max 60 saniye)
- **Azure OCR Polling**: 
  - **Önceki**: 10 saniye
  - **Yeni**: 15 saniye
- **Google Vision API**: 
  - **Önceki**: 30 saniye
  - **Yeni**: Görüntü boyutuna göre dinamik (max 60 saniye)

### 4. **Progress Logging**
- Uzun işlemler için her 10 saniyede bir progress log'u
- Kullanıcı işlemin devam ettiğini görebilir

## 📊 Nasıl Çalışıyor?

### Azure OCR İşlemi:

1. **İlk Request** (Analyze):
   ```
   Görüntü boyutu → Timeout hesaplama
   2MB → 30 + 10 = 40 saniye
   5MB → 30 + 25 = 55 saniye
   10MB → 30 + 50 = 60 saniye (max)
   ```

2. **Polling** (Sonuç Bekleme):
   ```
   Görüntü boyutu → Deneme sayısı
   2MB → 30 + 20 = 50 deneme (50 saniye)
   5MB → 30 + 50 = 80 deneme (80 saniye)
   10MB → 30 + 100 = 90 deneme (90 saniye - max)
   ```

3. **Toplam Süre**:
   - Küçük faturalar (1-2MB): ~30-50 saniye
   - Orta faturalar (3-5MB): ~60-90 saniye
   - Büyük faturalar (6-10MB): ~90-120 saniye

## 🔍 Test Etme

### 1. Küçük Fatura (1-2MB):
```bash
# Normal süre: ~30-40 saniye
curl -X POST http://localhost:3001/api/scan/receipt \
  -F "image=@small_receipt.jpg"
```

### 2. Orta Fatura (3-5MB):
```bash
# Uzun süre: ~60-80 saniye
curl -X POST http://localhost:3001/api/scan/receipt \
  -F "image=@medium_receipt.jpg"
```

### 3. Büyük Fatura (6-10MB):
```bash
# Çok uzun süre: ~90-120 saniye
curl -X POST http://localhost:3001/api/scan/receipt \
  -F "image=@large_receipt.jpg"
```

## 📝 Log Örnekleri

### Küçük Fatura:
```
📊 Image size: 1.5MB, using 37500ms timeout
⏳ Polling Azure OCR results...
📊 Image size: 1.5MB, using 45 polling attempts (max 90 seconds)
✅ Azure OCR extracted text, length: 2500 chars (120 lines)
⏱️  Completed in 12 seconds
```

### Büyük Fatura:
```
📊 Image size: 8.2MB, using 60000ms timeout
⏳ Polling Azure OCR results...
📊 Image size: 8.2MB, using 90 polling attempts (max 90 seconds)
⏳ Still processing... (11/90 seconds)
⏳ Still processing... (21/90 seconds)
⏳ Still processing... (31/90 seconds)
✅ Azure OCR extracted text, length: 15000 chars (450 lines)
⏱️  Completed in 45 seconds
```

## ⚠️ Önemli Notlar

1. **Render.com Timeout**: 
   - Render.com free tier: 30 saniye timeout
   - **Çözüm**: Render.com'da timeout'u artırın veya paid plan kullanın
   - **Alternatif**: Firebase Functions (540 saniye timeout)

2. **Frontend Timeout**:
   - `src/services/apiService.js`'de timeout: 30 saniye
   - Uzun faturalar için artırılmalı

3. **Görüntü Optimizasyonu**:
   - Çok büyük görüntüler (20MB+) için ön işleme yapılabilir
   - Ancak bu metin kalitesini düşürebilir

## 🚀 Daha Fazla Optimizasyon

### 1. Frontend Timeout Artırma:
```javascript
// src/services/apiService.js
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 saniye (2 dakika)
  // ...
});
```

### 2. Render.com Timeout Artırma:
- Render Dashboard → Service Settings → **Request Timeout**: 120 seconds

### 3. Görüntü Ön İşleme (Opsiyonel):
- Çok büyük görüntüler için resize/compress
- Ancak OCR kalitesini düşürebilir

## ✅ Sonuç

Artık sistem uzun faturaları (20MB'a kadar) işleyebilir:
- ✅ Dinamik timeout'lar
- ✅ Uzun polling süreleri
- ✅ Progress logging
- ✅ Büyük dosya desteği (20MB)

