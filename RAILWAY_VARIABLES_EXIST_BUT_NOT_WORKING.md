# 🔍 Environment Variables Ekli Ama Çalışmıyor - Sorun Giderme

Tüm environment variables Railway'da ekli ama loglarda görünmüyorsa, şu kontrolleri yapın:

---

## ✅ Kontrol 1: Deploy Yeniden Başlatıldı mı?

Environment variables ekledikten veya değiştirdikten sonra **MUTLAKA** deploy'u yeniden başlatmanız gerekir!

1. Railway Dashboard'da projenize gidin
2. **"Deployments"** sekmesine tıklayın
3. **"Redeploy"** butonuna tıklayın
4. Deploy'un tamamlanmasını bekleyin (2-5 dakika)

---

## ✅ Kontrol 2: Debug Endpoint'i Test Edin

Tarayıcıda şu URL'yi açın:
```
https://scangoodapp-production.up.railway.app/api/debug/env
```

**Beklenen Response:**
```json
{
  "success": true,
  "environment": {
    "azureVision": {
      "configured": true,  // ← Bu true olmalı!
      "hasKey": true,
      "hasEndpoint": true,
      "endpoint": "https://..."
    },
    "geminiVision": {
      "configured": true,  // ← Bu true olmalı!
      "hasKey": true
    }
  }
}
```

**Eğer `configured: false` görüyorsanız:**
- Environment variables'lar backend'e yüklenmemiş demektir
- Deploy'u yeniden başlatın

---

## ✅ Kontrol 3: API Key'lerin Doğruluğunu Kontrol Edin

### Azure Computer Vision:
1. Azure Portal'a gidin: https://portal.azure.com
2. Computer Vision resource'unuza gidin
3. **"Keys and Endpoint"** sekmesine tıklayın
4. Railway'da `AZURE_COMPUTER_VISION_KEY` değerini kontrol edin
   - Key 1 veya Key 2 ile eşleşiyor mu?
   - Boşluk veya yeni satır var mı?
5. Railway'da `AZURE_COMPUTER_VISION_ENDPOINT` değerini kontrol edin
   - Endpoint URL ile eşleşiyor mu?
   - Sonunda `/` var mı? (Olmalı: `https://your-resource.cognitiveservices.azure.com/`)

### Google Gemini:
1. Google AI Studio'ya gidin: https://makersuite.google.com/app/apikey
2. Railway'da `GOOGLE_GEMINI_API_KEY` değerini kontrol edin
   - API key ile eşleşiyor mu?
   - Boşluk veya yeni satır var mı?

---

## ✅ Kontrol 4: Railway Loglarını Detaylı İnceleyin

1. Railway Dashboard'da projenize gidin
2. **"Deployments"** sekmesine tıklayın
3. Son deployment'ı seçin
4. **"View Logs"** butonuna tıklayın
5. **Tüm logları** aşağıdan yukarıya okuyun

**Aranacak Mesajlar:**
- ✅ `✅ Azure Computer Vision initialized` - Bu görünmeli
- ✅ `✅ Google Gemini Vision API initialized` - Bu görünmeli
- ❌ `⚠️ No Vision API configured` - Bu görünmemeli
- ❌ `⚠️ Failed to initialize` - Bu görünmemeli
- ❌ `Error:` - Hata mesajları var mı?

**Eğer hata mesajları görüyorsanız:**
- Hata mesajını kopyalayın
- Hangi API için hata olduğunu not edin

---

## ✅ Kontrol 5: Environment Variables'ların Formatını Kontrol Edin

Railway'da environment variables eklerken dikkat edilmesi gerekenler:

1. **Büyük/Küçük Harf Duyarlı:**
   - ✅ `AZURE_COMPUTER_VISION_KEY` (doğru)
   - ❌ `azure_computer_vision_key` (yanlış)

2. **Boşluk Olmamalı:**
   - ✅ `https://your-resource.cognitiveservices.azure.com/` (doğru)
   - ❌ ` https://your-resource.cognitiveservices.azure.com/ ` (yanlış - başta/sonda boşluk)

3. **Yeni Satır Olmamalı:**
   - Value kopyalarken yeni satır karakteri kalmamalı

4. **Tırnak İşareti Olmamalı:**
   - ✅ `your-api-key-here` (doğru)
   - ❌ `"your-api-key-here"` (yanlış - tırnak işareti olmamalı)

---

## ✅ Kontrol 6: Backend Başlatma Sırasını Kontrol Edin

Backend başlatılırken `visionService.initializeVision()` fonksiyonu çağrılıyor. Bu fonksiyon:

1. Environment variables'ları okur
2. API'leri initialize eder
3. Console'a log yazar

**Eğer loglarda hiçbir şey görünmüyorsa:**
- Backend başlatılmamış olabilir
- Loglar görünmüyor olabilir
- Environment variables yüklenmemiş olabilir

---

## 🔧 Çözüm Adımları

### Adım 1: Deploy'u Yeniden Başlatın
1. Railway Dashboard → Deployments
2. **"Redeploy"** butonuna tıklayın
3. Deploy'un tamamlanmasını bekleyin

### Adım 2: Debug Endpoint'i Test Edin
```
https://scangoodapp-production.up.railway.app/api/debug/env
```

### Adım 3: Logları Kontrol Edin
- Railway Dashboard → Deployments → View Logs
- `✅ Azure Computer Vision initialized` mesajını arayın

### Adım 4: API Key'leri Yeniden Kontrol Edin
- Azure Portal'dan key'leri tekrar kopyalayın
- Railway'da değerleri güncelleyin
- Deploy'u yeniden başlatın

---

## 🆘 Hala Çalışmıyorsa

1. **Debug endpoint response'unu paylaşın:**
   - `/api/debug/env` endpoint'ini açın
   - Response'u kopyalayın

2. **Railway loglarını paylaşın:**
   - Son 50-100 satır log'u kopyalayın
   - Özellikle başlatma sırasındaki logları

3. **Environment variables'ların değerlerini kontrol edin:**
   - Railway'da her variable'ın değerini gösterin (eye icon'a tıklayın)
   - Değerlerin doğru olduğundan emin olun

Bu bilgilerle sorunu daha hızlı çözebiliriz!

