# 🚨 URGENT: Railway'a Environment Variables Ekleme

Railway loglarında Azure görünmüyorsa, environment variables eksik demektir. Hemen ekleyin!

---

## ⚡ Hızlı Adımlar

### 1. Railway Dashboard'a Gidin
1. https://railway.app adresine gidin
2. Login olun
3. Projenize tıklayın (scangoodapp-production)

### 2. Variables Sekmesine Gidin
1. Sol menüden **"Variables"** sekmesine tıklayın
2. Veya proje ayarlarından **"Variables"** bölümüne gidin

### 3. Aşağıdaki Environment Variables'ları Ekleyin

Her birini tek tek ekleyin:

#### ✅ Azure Computer Vision (OCR için - ZORUNLU)
1. **"New Variable"** butonuna tıklayın
2. **Name:** `AZURE_COMPUTER_VISION_KEY`
3. **Value:** Azure portal'dan kopyaladığınız API key (Key 1 veya Key 2)
4. **"Add"** butonuna tıklayın

5. Tekrar **"New Variable"** butonuna tıklayın
6. **Name:** `AZURE_COMPUTER_VISION_ENDPOINT`
7. **Value:** Azure portal'dan kopyaladığınız endpoint URL (örn: `https://your-resource.cognitiveservices.azure.com/`)
8. **"Add"** butonuna tıklayın

#### ✅ Google Gemini Vision (Product Recognition için - ZORUNLU)
1. **"New Variable"** butonuna tıklayın
2. **Name:** `GOOGLE_GEMINI_API_KEY`
3. **Value:** Google AI Studio'dan aldığınız API key
4. **"Add"** butonuna tıklayın

#### ✅ Google Custom Search (Price Comparison için - ZORUNLU)
1. **"New Variable"** butonuna tıklayın
2. **Name:** `GOOGLE_CUSTOM_SEARCH_API_KEY`
3. **Value:** Google Cloud Console'dan aldığınız API key
4. **"Add"** butonuna tıklayın

5. Tekrar **"New Variable"** butonuna tıklayın
6. **Name:** `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`
7. **Value:** Google Custom Search Engine ID'niz
8. **"Add"** butonuna tıklayın

---

## 🔑 API Key'leri Nereden Bulabilirim?

### Azure Computer Vision Key ve Endpoint:
1. https://portal.azure.com adresine gidin
2. Azure portal'da **"Computer Vision"** resource'unuzu bulun
3. Sol menüden **"Keys and Endpoint"** sekmesine tıklayın
4. **Key 1** veya **Key 2**'yi kopyalayın → `AZURE_COMPUTER_VISION_KEY`
5. **Endpoint** URL'ini kopyalayın → `AZURE_COMPUTER_VISION_ENDPOINT`
   - Örnek: `https://your-resource.cognitiveservices.azure.com/`

### Google Gemini API Key:
1. https://makersuite.google.com/app/apikey adresine gidin
2. Google hesabınızla login olun
3. **"Create API Key"** butonuna tıklayın
4. API key'i kopyalayın → `GOOGLE_GEMINI_API_KEY`

### Google Custom Search API Key ve Engine ID:
1. **API Key için:**
   - https://console.cloud.google.com adresine gidin
   - **APIs & Services** > **Credentials**
   - **"Create Credentials"** > **"API Key"**
   - API key'i kopyalayın → `GOOGLE_CUSTOM_SEARCH_API_KEY`

2. **Engine ID için:**
   - https://programmablesearchengine.google.com/controlpanel/create adresine gidin
   - Custom Search Engine oluşturun
   - Engine ID'yi kopyalayın → `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`

---

## 🔄 Deploy'u Yeniden Başlatın

Environment variables ekledikten sonra **MUTLAKA** deploy'u yeniden başlatın:

1. Railway Dashboard'da projenize gidin
2. **"Deployments"** sekmesine tıklayın
3. **"Redeploy"** butonuna tıklayın
4. Deploy'un tamamlanmasını bekleyin (2-5 dakika)

---

## ✅ Kontrol Edin

### 1. Debug Endpoint'i Test Edin
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
      "hasEndpoint": true
    },
    "geminiVision": {
      "configured": true,  // ← Bu true olmalı!
      "hasKey": true
    },
    "googleCustomSearch": {
      "configured": true,  // ← Bu true olmalı!
      "hasApiKey": true,
      "hasEngineId": true
    }
  }
}
```

### 2. Logları Kontrol Edin
1. Railway Dashboard'da projenize gidin
2. **"Deployments"** sekmesine tıklayın
3. Son deployment'ı seçin
4. **"View Logs"** butonuna tıklayın

**Beklenen Log Mesajları:**
```
✅ Azure Computer Vision initialized (5,000 free requests/month)
✅ Google Gemini Vision API initialized (AI-powered product recognition)
```

Eğer bu mesajları görüyorsanız, environment variables başarıyla eklendi demektir!

---

## ❌ Hala Çalışmıyorsa

1. **Environment variables'ları tekrar kontrol edin:**
   - Railway'da **"Variables"** sekmesine gidin
   - Tüm değişkenlerin doğru yazıldığından emin olun (büyük/küçük harf duyarlı!)
   - Değerlerin doğru kopyalandığından emin olun (boşluk, yeni satır olmamalı)

2. **Deploy'u yeniden başlatın:**
   - Railway'da **"Redeploy"** butonuna tıklayın

3. **Logları kontrol edin:**
   - Hata mesajları var mı?
   - Environment variables yüklenmiş mi?

4. **Debug endpoint'i tekrar test edin:**
   - `/api/debug/env` endpoint'ini açın
   - Hangi API'lerin `configured: false` olduğunu kontrol edin

---

## 📝 Checklist

- [ ] Railway'a `AZURE_COMPUTER_VISION_KEY` ekledim
- [ ] Railway'a `AZURE_COMPUTER_VISION_ENDPOINT` ekledim
- [ ] Railway'a `GOOGLE_GEMINI_API_KEY` ekledim
- [ ] Railway'a `GOOGLE_CUSTOM_SEARCH_API_KEY` ekledim
- [ ] Railway'a `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` ekledim
- [ ] Deploy'u yeniden başlattım
- [ ] Debug endpoint'i test ettim (`/api/debug/env`)
- [ ] Logları kontrol ettim (Azure ve Gemini mesajları görünüyor)

---

## 🆘 Yardım Gerekirse

Eğer hala sorun yaşıyorsanız:
1. Debug endpoint response'unu paylaşın
2. Railway loglarının bir ekran görüntüsünü paylaşın
3. Hangi adımda takıldığınızı belirtin

Bu bilgilerle sorunu daha hızlı çözebiliriz!

