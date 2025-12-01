# 🔍 Railway Production API Debug Guide

Bu rehber, production'da API'lerin çalışmaması sorununu çözmek için adım adım kontrol listesi sağlar.

---

## 🚨 Sorun: Development'ta çalışıyor ama Production'da çalışmıyor

### Adım 1: Railway Backend Loglarını Kontrol Edin

1. **Railway Dashboard'a gidin**: https://railway.app
2. Projenize tıklayın
3. **"Deployments"** sekmesine gidin
4. Son deployment'ı seçin
5. **"View Logs"** butonuna tıklayın

**Kontrol edilecekler:**
- ✅ Backend başarıyla başladı mı? (`✅ Azure Computer Vision initialized` gibi mesajlar görünüyor mu?)
- ❌ Hata mesajları var mı? (Özellikle API key ile ilgili)
- ⚠️ Environment variables yüklenmiş mi?

---

### Adım 2: Environment Variables Kontrolü

1. Railway Dashboard'da projenize gidin
2. **"Variables"** sekmesine tıklayın
3. Aşağıdaki environment variables'ların **TÜMÜNÜN** ekli olduğundan emin olun:

#### ✅ Gerekli Environment Variables:

**OCR için (Receipt Scanning):**
- `AZURE_COMPUTER_VISION_KEY` - Azure Computer Vision API key
- `AZURE_COMPUTER_VISION_ENDPOINT` - Azure Computer Vision endpoint URL
- **VEYA**
- `GOOGLE_CLOUD_VISION_API_KEY` - Google Cloud Vision API key

**Product Recognition için:**
- `GOOGLE_GEMINI_API_KEY` - Google Gemini Vision API key

**Price Comparison için:**
- `GOOGLE_CUSTOM_SEARCH_API_KEY` - Google Custom Search API key
- `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` - Google Custom Search Engine ID

**Server:**
- `PORT` - Railway otomatik ayarlar (genellikle gerekmez)
- `NODE_ENV` - `production` (opsiyonel)

---

### Adım 3: Debug Endpoint ile Kontrol

Backend'inizde debug endpoint'i var. Şu URL'yi açın:

```
https://scangoodapp-production.up.railway.app/api/debug/env
```

**Beklenen Response:**
```json
{
  "success": true,
  "environment": {
    "azureVision": {
      "configured": true,
      "hasKey": true,
      "hasEndpoint": true,
      "endpoint": "https://your-endpoint.cognitiveservices..."
    },
    "googleCloudVision": {
      "configured": false,
      "hasApiKey": false,
      "hasKeyFile": false
    },
    "geminiVision": {
      "configured": true,
      "hasKey": true
    },
    "googleCustomSearch": {
      "configured": true,
      "hasApiKey": true,
      "hasEngineId": true
    },
    "server": {
      "port": 3001,
      "nodeEnv": "production",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Eğer `configured: false` görüyorsanız:**
- İlgili environment variable'ı Railway'a ekleyin
- Deploy'u yeniden başlatın

---

### Adım 4: API Key'lerin Doğruluğunu Kontrol Edin

#### Azure Computer Vision:
1. Azure Portal'a gidin: https://portal.azure.com
2. Computer Vision resource'unuza gidin
3. **"Keys and Endpoint"** sekmesine tıklayın
4. Key 1 veya Key 2'yi kopyalayın
5. Railway'da `AZURE_COMPUTER_VISION_KEY` değerini kontrol edin
6. Endpoint URL'yi kopyalayın (örn: `https://your-resource.cognitiveservices.azure.com/`)
7. Railway'da `AZURE_COMPUTER_VISION_ENDPOINT` değerini kontrol edin

#### Google Gemini:
1. Google AI Studio'ya gidin: https://makersuite.google.com/app/apikey
2. API key'inizi kopyalayın
3. Railway'da `GOOGLE_GEMINI_API_KEY` değerini kontrol edin

#### Google Cloud Vision:
1. Google Cloud Console'a gidin: https://console.cloud.google.com
2. **APIs & Services** > **Credentials**
3. API key'inizi kopyalayın
4. Railway'da `GOOGLE_CLOUD_VISION_API_KEY` değerini kontrol edin

---

### Adım 5: Railway Deploy'u Yeniden Başlatın

Environment variables ekledikten veya değiştirdikten sonra:

1. Railway Dashboard'da projenize gidin
2. **"Deployments"** sekmesine gidin
3. **"Redeploy"** butonuna tıklayın
4. Deploy'un tamamlanmasını bekleyin (2-5 dakika)
5. Logları kontrol edin

---

### Adım 6: Frontend'den Backend'e Bağlantıyı Test Edin

1. Frontend'inizde (Netlify) console'u açın (F12)
2. Receipt veya product taramayı deneyin
3. Network sekmesinde API isteklerini kontrol edin
4. Hata mesajlarını kontrol edin

**Beklenen API URL:**
- Development: `https://diagenetic-berry-pompously.ngrok-free.dev/api`
- Production: `https://scangoodapp-production.up.railway.app/api`

---

## 🔧 Yaygın Sorunlar ve Çözümleri

### Sorun 1: "No Vision API configured"
**Çözüm:** Railway'a `AZURE_COMPUTER_VISION_KEY` ve `AZURE_COMPUTER_VISION_ENDPOINT` ekleyin.

### Sorun 2: "API key is invalid"
**Çözüm:** API key'i yeniden kopyalayın ve Railway'da güncelleyin. Deploy'u yeniden başlatın.

### Sorun 3: "CORS error"
**Çözüm:** Backend'de CORS ayarları doğru. Netlify URL'inizin `.netlify.app` ile bitmesi gerekiyor.

### Sorun 4: "Connection refused"
**Çözüm:** Railway backend'iniz çalışmıyor olabilir. Logları kontrol edin.

### Sorun 5: "Timeout"
**Çözüm:** API key'ler doğru ama rate limit'e takılmış olabilir. Birkaç dakika bekleyin.

---

## 📝 Checklist

- [ ] Railway backend loglarını kontrol ettim
- [ ] Tüm environment variables Railway'da mevcut
- [ ] Debug endpoint'i test ettim (`/api/debug/env`)
- [ ] API key'lerin doğruluğunu kontrol ettim
- [ ] Railway deploy'u yeniden başlattım
- [ ] Frontend'den backend'e bağlantıyı test ettim
- [ ] Network hatalarını kontrol ettim

---

## 🆘 Hala Çalışmıyorsa

1. Railway loglarını paylaşın
2. Debug endpoint response'unu paylaşın (`/api/debug/env`)
3. Frontend console hatalarını paylaşın
4. Network tab'deki API request/response'ları paylaşın

Bu bilgilerle sorunu daha hızlı çözebiliriz!

