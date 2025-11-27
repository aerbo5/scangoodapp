# 🤖 Google Gemini Vision API Kurulumu

## 🎯 Neden Gemini Vision?

- ✅ **AI-Powered**: Ürün tanıma için çok daha iyi sonuçlar
- ✅ **Ücretsiz Tier**: Günde 15 RPM (requests per minute) ücretsiz
- ✅ **Daha Akıllı**: "Maison Perrier", "Coca-Cola" gibi marka isimlerini doğru tespit eder
- ✅ **OCR + AI**: Hem metin okur hem de görsel analiz yapar

---

## 📋 Kurulum Adımları

### 1. Google AI Studio'ya Git

1. **Google AI Studio**'yu açın: https://aistudio.google.com/
2. Google hesabınızla giriş yapın

### 2. API Key Oluştur

1. Sol menüden **"Get API Key"** veya **"API Keys"** seçin
2. **"Create API Key"** butonuna tıklayın
3. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
4. API key'inizi kopyalayın (örnek: `AIzaSy...`)

### 3. Backend'e API Key Ekleyin

1. `backend/.env` dosyasını açın
2. Şu satırı ekleyin:

```env
GOOGLE_GEMINI_API_KEY=AIzaSy...your-api-key-here
```

3. Dosyayı kaydedin

### 4. Backend'i Yeniden Başlatın

```bash
cd backend
npm start
```

---

## ✅ Kontrol

Backend başlatıldığında şunu görmelisiniz:

```
✅ Google Gemini Vision API initialized (AI-powered product recognition)
💡 Gemini Vision provides better product name detection than traditional OCR/Vision APIs
```

---

## 🧪 Test

1. Bir ürün tara (örn: Perrier su şişesi)
2. Backend loglarında şunu göreceksiniz:

```
🔍 Step 2a: Trying AI-powered product recognition (Gemini Vision)...
🤖 Calling Google Gemini Vision API for AI-powered product recognition...
✅ Gemini Vision API response: {"brand": "Perrier", "product": "Sparkling Water", "fullName": "Perrier Sparkling Water"}
✅ AI identified product: Perrier Sparkling Water
   Brand: Perrier
   Product: Sparkling Water
```

---

## 💰 Fiyatlandırma

- **Ücretsiz Tier**: Günde 15 RPM (requests per minute)
- **Ücretli**: $0.075 per 1M tokens (çok ucuz)
- **Daha fazla bilgi**: https://ai.google.dev/pricing

---

## 🆚 Karşılaştırma

| Özellik | OCR + Vision API | Gemini Vision AI |
|--------|------------------|------------------|
| Marka tespiti | ❌ Zayıf | ✅ Çok iyi |
| Ürün adı | ⚠️ Bazen yanlış | ✅ Doğru |
| Ücretsiz tier | ✅ Var | ✅ Var |
| Hız | ✅ Hızlı | ⚠️ Biraz yavaş |
| AI gücü | ❌ Yok | ✅ Var |

---

## ⚠️ Notlar

- Gemini Vision API, OCR ve Vision API'den **daha iyi sonuçlar** verir
- Özellikle marka isimlerini tespit etmede çok başarılı
- "Maison Perrier", "Coca-Cola" gibi isimleri doğru tespit eder
- Eğer Gemini API key yoksa, otomatik olarak OCR ve Vision API'ye düşer

---

## 🔧 Sorun Giderme

### API Key Çalışmıyor

1. API key'in doğru kopyalandığından emin olun
2. `.env` dosyasında `GOOGLE_GEMINI_API_KEY=` ile başladığından emin olun
3. Backend'i yeniden başlatın

### "API key not valid" Hatası

1. Google AI Studio'da API key'in aktif olduğundan emin olun
2. API key'in doğru projeye ait olduğundan emin olun
3. Yeni bir API key oluşturmayı deneyin

---

## 📚 Daha Fazla Bilgi

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing


