# 🔧 Railway Environment Variables Düzeltme

## ❌ Sorun
Railway deploy çalışıyor ama Vision API veya Azure çalışmıyor.

## ✅ Çözüm: Environment Variables Ekleme

### 1. Railway Dashboard'a Gidin
1. **Railway'a gidin**: https://railway.app
2. Projenize tıklayın
3. Backend service'inize tıklayın
4. **Settings** sekmesine gidin
5. **Variables** bölümüne gidin

### 2. Gerekli Environment Variables'ı Ekleyin

Aşağıdaki değişkenleri ekleyin (her biri için **"New Variable"** butonuna tıklayın):

#### Zorunlu (En Az Birini Ekleyin):

**Seçenek A: Azure Computer Vision (Önerilen - Ücretsiz)**
```
AZURE_COMPUTER_VISION_KEY=your-azure-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
```

**Seçenek B: Google Cloud Vision API**
```
GOOGLE_CLOUD_VISION_API_KEY=your-google-vision-api-key-here
```

**Seçenek C: Google Gemini API (AI ürün tanıma için - OCR için yeterli değil)**
```
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
```

#### Zorunlu (Her Zaman):
```
PORT=3001
NODE_ENV=production
```

#### Önerilen (Market araştırması için):
```
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyDKhrokFGquwnyQFyyCCNuqdxw42Q382W8
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=50d1476204abf4cd9
```

### 3. Deploy'u Yeniden Başlatın

Environment variables ekledikten sonra:
1. Railway otomatik olarak deploy'u yeniden başlatır
2. Veya manuel olarak **Deployments** sekmesinden **"Redeploy"** yapabilirsiniz

### 4. Kontrol Edin

Deploy tamamlandıktan sonra Railway loglarını kontrol edin. Şunları görmelisiniz:

**Azure kullanıyorsanız:**
```
✅ Azure Computer Vision initialized (5,000 free requests/month)
```

**Google Vision kullanıyorsanız:**
```
✅ Google Cloud Vision initialized with API key (REST API)
```

**Gemini kullanıyorsanız:**
```
✅ Google Gemini Vision API initialized (AI-powered product recognition)
```

## 🔍 API Key'leri Nereden Alınır?

### Azure Computer Vision (Ücretsiz - Önerilen)
1. **Azure Portal**: https://portal.azure.com/
2. **"Create a resource"** > **"Computer Vision"**
3. **Pricing tier**: **F0 (Free)** seçin (5,000 istek/ay ücretsiz)
4. Oluşturduktan sonra **"Keys and Endpoint"** bölümünden key ve endpoint'i kopyalayın

**Detaylar için:** `backend/AZURE_SETUP.md` dosyasına bakın.

### Google Cloud Vision API
1. **Google Cloud Console**: https://console.cloud.google.com/
2. **"APIs & Services" > "Library"** > **"Cloud Vision API"** > **"Enable"**
3. **"APIs & Services" > "Credentials"** > **"Create Credentials" > "API Key"**

**Detaylar için:** `backend/API_KEY_EKLEME.md` dosyasına bakın.

### Google Gemini API (Opsiyonel)
1. **Google AI Studio**: https://makersuite.google.com/app/apikey
2. **"Create API Key"** butonuna tıklayın
3. API key'i kopyalayın

## ⚠️ Önemli Notlar

1. **Azure Endpoint Formatı:**
   - Doğru: `https://westeurope.api.cognitive.microsoft.com/`
   - Yanlış: `https://westeurope.api.cognitive.microsoft.com` (sonunda `/` olmalı)

2. **Deploy Yeniden Başlatma:**
   - Environment variables ekledikten sonra Railway otomatik olarak yeniden deploy eder
   - Eğer çalışmıyorsa, manuel olarak **"Redeploy"** yapın

3. **API Key Kontrolü:**
   - API key'lerin doğru olduğundan emin olun
   - Local `.env` dosyanızdaki değerleri Railway'a kopyalayın

## 🧪 Test Etme

Deploy tamamlandıktan sonra:

1. **Health Check:**
   ```
   https://your-backend.railway.app/api/health
   ```

2. **Vision API Test:**
   - Backend'e bir resim gönderin
   - Railway loglarında Vision API çağrılarını görmelisiniz

## 🐛 Sorun Giderme

### Hata: "No Vision API configured"
- Railway'da environment variables eklenmiş mi kontrol edin
- Deploy'u yeniden başlatın

### Hata: "Invalid API key"
- API key'in doğru olduğundan emin olun
- Local `.env` dosyasındaki key'i Railway'a kopyaladınız mı?

### Hata: "Azure endpoint not found"
- Endpoint URL'inin sonunda `/` olduğundan emin olun
- Endpoint formatı: `https://your-region.api.cognitive.microsoft.com/`

## ✅ Kontrol Listesi

- [ ] Railway Dashboard'a gidildi
- [ ] Backend service'in Settings > Variables bölümüne gidildi
- [ ] En az bir Vision API key eklendi (Azure, Google Vision, veya Gemini)
- [ ] PORT=3001 eklendi
- [ ] NODE_ENV=production eklendi
- [ ] GOOGLE_CUSTOM_SEARCH_API_KEY eklendi (opsiyonel ama önerilen)
- [ ] Deploy yeniden başlatıldı
- [ ] Railway loglarında Vision API initialized mesajı görüldü
- [ ] Test edildi ve çalışıyor

## 🎯 Sonuç

Environment variables eklendikten ve deploy yeniden başlatıldıktan sonra:
- ✅ Vision API çalışacak
- ✅ Receipt scanning çalışacak
- ✅ Product recognition çalışacak
- ✅ Barcode detection çalışacak

