# Azure Computer Vision Kurulumu (Ücretsiz)

Azure Computer Vision API, Google Cloud Vision API'nin ücretsiz alternatifi. **5,000 istek/ay ücretsiz** ve **billing gerekmez**!

## 🚀 Hızlı Kurulum (5 Dakika)

### Adım 1: Azure Hesabı Oluşturun

1. **Azure Ücretsiz Hesap**: https://azure.microsoft.com/free/
2. "Start free" butonuna tıklayın
3. Microsoft hesabı ile giriş yapın (ücretsiz)
4. Telefon doğrulaması yapın
5. **Kredi kartı gerekmez!** (Sadece doğrulama için isteyebilir ama ücret alınmaz)

### Adım 2: Computer Vision API Oluşturun

1. **Azure Portal**: https://portal.azure.com/
2. Sol üstten **"Create a resource"** butonuna tıklayın
3. Arama kutusuna **"Computer Vision"** yazın
4. **"Computer Vision"** sonucuna tıklayın
5. **"Create"** butonuna tıklayın

### Adım 3: Formu Doldurun

**Gerekli Bilgiler:**
- **Name**: `scan-good-vision` (veya istediğiniz isim)
- **Subscription**: Ücretsiz subscription seçin
- **Pricing tier**: **F0 (Free)** seçin ⭐ (5,000 istek/ay ücretsiz)
- **Resource group**: **Create new** > `scan-good-rg` (veya istediğiniz isim)
- **Region**: `West Europe` veya size yakın bir bölge
- **Name**: `scan-good-vision` (tekrar)

6. **"Review + create"** butonuna tıklayın
7. **"Create"** butonuna tıklayın
8. Birkaç saniye bekleyin (kaynak oluşturuluyor)

### Adım 4: API Key ve Endpoint Alın

1. Oluşturduğunuz Computer Vision kaynağına gidin
2. Sol menüden **"Keys and Endpoint"** seçin
3. **KEY 1** değerini kopyalayın (örn: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
4. **Endpoint** URL'ini kopyalayın (örn: `https://westeurope.api.cognitive.microsoft.com/`)

### Adım 5: Backend'e Ekleyin

`backend/.env` dosyasını açın ve şu satırları ekleyin:

```env
# Azure Computer Vision (Ücretsiz - 5,000 istek/ay)
AZURE_COMPUTER_VISION_KEY=your-azure-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
```

**Örnek:**
```env
AZURE_COMPUTER_VISION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
AZURE_COMPUTER_VISION_ENDPOINT=https://westeurope.api.cognitive.microsoft.com/
```

**ÖNEMLİ:**
- Endpoint URL'inin sonunda `/` olmalı
- Google Cloud Vision API key'lerini kaldırabilirsiniz (opsiyonel)

### Adım 6: Backend'i Yeniden Başlatın

1. Backend'i durdurun (Ctrl+C)
2. Tekrar başlatın:
   ```bash
   cd backend
   npm start
   ```

Backend başlarken şunu görmelisiniz:
```
✅ Azure Computer Vision initialized (5,000 free requests/month)
🚀 Scan Good Backend API running on http://localhost:3001
```

### Adım 7: Test Edin

1. Telefonda kamera ile bir resim çekin
2. Backend console'unda şunu görmelisiniz:
   ```
   🔍 Calling Azure Computer Vision API for label detection...
   ✅ Azure Vision API returned 5 labels: Water, Bottle, Spring Water, Product, Beverage
   ```

## ✅ Başarılı!

Artık **ücretsiz** Vision API kullanıyorsunuz!

## 💰 Fiyatlandırma

- **İlk 5,000 istek/ay**: **TAMAMEN ÜCRETSİZ**
- **Sonrası**: $1.00 per 1,000 istek
- **Billing gerekmez** (F0 tier için)

## 🔍 Kontrol

API'nin çalışıp çalışmadığını kontrol etmek için:

1. Azure Portal'da Computer Vision kaynağınıza gidin
2. **"Metrics"** bölümüne tıklayın
3. İstek sayısını görebilirsiniz

## 🐛 Sorun Giderme

### Hata: "Invalid subscription key"
- API key'i kontrol edin
- `.env` dosyasında doğru mu?

### Hata: "Resource not found"
- Endpoint URL'ini kontrol edin
- Sonunda `/` var mı?

### Hata: "Rate limit exceeded"
- Aylık 5,000 istek limitini aştınız
- Bir sonraki ay bekleyin veya ücretli tier'a geçin

## 📝 Notlar

- Azure Computer Vision **Google Cloud Vision'dan önce** kontrol edilir
- Eğer Azure key varsa, Google Cloud Vision kullanılmaz
- İkisini birlikte kullanmak isterseniz, Google Cloud Vision key'ini kaldırın

## 🎯 Sonuç

Artık **billing olmadan**, **ücretsiz** Vision API kullanıyorsunuz!

**Avantajlar:**
- ✅ 5,000 istek/ay ücretsiz
- ✅ Billing gerekmez
- ✅ Kredi kartı gerekmez
- ✅ Kolay kurulum
- ✅ Güvenilir (Microsoft)

