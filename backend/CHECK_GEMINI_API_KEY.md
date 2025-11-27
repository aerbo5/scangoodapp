# 🔍 Gemini API Key Kontrolü

## ❌ Sorun

Tüm Gemini modelleri 404 hatası veriyor:
```
❌ gemini-pro not available
❌ gemini-1.5-flash not available
❌ gemini-1.5-pro not available
❌ gemini-pro-vision not available
```

Bu, API key'inizin bu modellere erişimi olmadığı anlamına gelir.

---

## ✅ Çözüm Adımları

### 1. API Key'inizi Kontrol Edin

1. **Google AI Studio**'ya gidin: https://aistudio.google.com/
2. **API Keys** bölümüne gidin
3. API key'inizin **aktif** olduğundan emin olun

### 2. Yeni API Key Oluşturun

1. Google AI Studio → **Get API Key**
2. **Create API Key** butonuna tıklayın
3. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
4. API key'inizi kopyalayın

### 3. Mevcut Modelleri Listeleyin

API key'inizin hangi modellere erişimi olduğunu kontrol edin:

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
```

veya tarayıcıda:

```
https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY
```

Bu size hangi modellerin mevcut olduğunu gösterecek.

### 4. Backend'e Yeni API Key Ekleyin

`backend/.env` dosyasını açın ve güncelleyin:

```env
GOOGLE_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

### 5. Backend'i Yeniden Başlatın

```bash
cd backend
npm start
```

---

## 🔄 Geçici Çözüm

Eğer Gemini API çalışmıyorsa, uygulama otomatik olarak **OCR ve Vision API**'ye düşer:

1. ✅ **OCR** - Ürün üzerindeki yazıları okur
2. ✅ **Vision API Label Detection** - Görsel analiz yapar

Bu yöntemler de çalışır, sadece AI kadar akıllı değildir.

---

## 💡 Notlar

- **Ücretsiz Tier**: Bazı API key'ler sadece belirli modellere erişim sağlar
- **Bölge Kısıtlamaları**: Bazı modeller belirli bölgelerde kullanılamayabilir
- **API Key İzinleri**: Google AI Studio'da API key'inizin hangi servislere erişimi olduğunu kontrol edin

---

## 🧪 Test

API key'i güncelledikten sonra:

1. Backend'i yeniden başlatın
2. Bir ürün tarayın
3. Backend loglarında şunu görmelisiniz:

```
🤖 Calling Google Gemini Vision API for AI-powered product recognition...
  🔄 Trying gemini-pro (v1)...
  ✅ Successfully using gemini-pro
✅ Product identified by AI: { brand: "...", product: "...", fullName: "..." }
```

---

## 🔗 Kaynaklar

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Available Models**: https://ai.google.dev/models/gemini
- **API Key Help**: https://ai.google.dev/gemini-api/docs/api-key


