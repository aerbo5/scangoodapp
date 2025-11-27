# Ücretsiz Vision API Alternatifleri

Google Cloud Vision API yerine kullanabileceğiniz ücretsiz alternatifler:

## 🆓 En İyi Ücretsiz Seçenekler

### 1. **Azure Computer Vision** ⭐ (Önerilen)

**Ücretsiz Tier:**
- 5,000 istek/ay ücretsiz
- 20 istek/dakika limit

**Avantajlar:**
- Microsoft'un servisi (güvenilir)
- Kolay entegrasyon
- İyi dokümantasyon
- Ücretsiz tier yeterli

**Kurulum:**
1. Azure hesabı oluşturun (ücretsiz)
2. Computer Vision API'yi etkinleştirin
3. API key alın
4. Backend'e entegre edin

**Fiyatlandırma:**
- İlk 5,000 istek/ay: **ÜCRETSİZ**
- Sonrası: $1.00 per 1,000 istek

**Link:** https://azure.microsoft.com/services/cognitive-services/computer-vision/

---

### 2. **AWS Rekognition**

**Ücretsiz Tier:**
- 5,000 istek/ay ücretsiz (ilk 12 ay)
- Sonrası: $1.00 per 1,000 istek

**Avantajlar:**
- Amazon'un servisi
- Güçlü API
- İyi performans

**Dezavantajlar:**
- Kredi kartı gerekir (ama ücretsiz tier var)
- Biraz daha karmaşık kurulum

**Link:** https://aws.amazon.com/rekognition/

---

### 3. **Clarifai**

**Ücretsiz Tier:**
- 1,000 istek/ay ücretsiz
- Sınırsız model erişimi

**Avantajlar:**
- Kolay kullanım
- İyi dokümantasyon
- Kredi kartı gerekmez

**Dezavantajlar:**
- Daha az istek (1,000/ay)

**Link:** https://www.clarifai.com/

---

### 4. **Imagga**

**Ücretsiz Tier:**
- 500 istek/ay ücretsiz
- Auto-tagging, categorization

**Avantajlar:**
- Kolay entegrasyon
- REST API
- Kredi kartı gerekmez

**Dezavantajlar:**
- En az istek (500/ay)

**Link:** https://imagga.com/

---

### 5. **CloudSight (CamFind)**

**Ücretsiz Tier:**
- 1,000 istek/ay ücretsiz

**Avantajlar:**
- Ürün tanıma odaklı
- İyi sonuçlar

**Link:** https://cloudsight.ai/

---

## 🎯 Öneri: Azure Computer Vision

**Neden Azure?**
- ✅ En fazla ücretsiz istek (5,000/ay)
- ✅ Kredi kartı gerekmez (sadece hesap)
- ✅ Kolay entegrasyon
- ✅ Güvenilir (Microsoft)
- ✅ İyi dokümantasyon

---

## 🔧 Azure Computer Vision Entegrasyonu

### Adım 1: Azure Hesabı Oluşturun

1. https://azure.microsoft.com/free/ adresine gidin
2. "Start free" butonuna tıklayın
3. Microsoft hesabı ile giriş yapın
4. Telefon doğrulaması yapın

### Adım 2: Computer Vision API Oluşturun

1. Azure Portal: https://portal.azure.com/
2. "Create a resource" > "AI + Machine Learning" > "Computer Vision"
3. Formu doldurun:
   - Name: `scan-good-vision`
   - Pricing tier: **F0 (Free)** seçin
   - Resource group: Yeni oluşturun
4. "Create" butonuna tıklayın

### Adım 3: API Key Alın

1. Oluşturduğunuz Computer Vision kaynağına gidin
2. "Keys and Endpoint" bölümüne tıklayın
3. **KEY 1** değerini kopyalayın
4. **Endpoint** URL'ini de kopyalayın

### Adım 4: Backend'e Ekleyin

`.env` dosyasına ekleyin:
```env
AZURE_COMPUTER_VISION_KEY=your-azure-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
```

---

## 📊 Karşılaştırma Tablosu

| Servis | Ücretsiz İstek/Ay | Kredi Kartı | Kolaylık | Öneri |
|--------|------------------|-------------|----------|-------|
| **Azure Computer Vision** | 5,000 | ❌ Hayır | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| AWS Rekognition | 5,000 (12 ay) | ✅ Evet | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Clarifai | 1,000 | ❌ Hayır | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Imagga | 500 | ❌ Hayır | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| CloudSight | 1,000 | ❌ Hayır | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 Yerel Çözüm (Tamamen Ücretsiz)

Eğer hiçbir servis kullanmak istemiyorsanız:

### TensorFlow.js veya ML Kit

- **Tamamen ücretsiz**
- **Sınırsız kullanım**
- **Offline çalışır**
- **Daha az doğruluk** (ama kabul edilebilir)

**Avantajlar:**
- Hiçbir API key gerekmez
- Sınırsız kullanım
- Gizlilik (veriler dışarı gitmez)

**Dezavantajlar:**
- Daha az doğruluk
- Daha yavaş (ilk yükleme)
- Daha fazla kod

---

## 🚀 Hızlı Başlangıç: Azure

1. **Azure hesabı oluşturun** (2 dakika)
2. **Computer Vision API oluşturun** (1 dakika)
3. **API key alın** (30 saniye)
4. **Backend'e ekleyin** (2 dakika)

**Toplam: ~5 dakika**

---

## 📝 Sonuç

**En iyi seçenek: Azure Computer Vision**
- En fazla ücretsiz istek
- Kredi kartı gerekmez
- Kolay entegrasyon
- Güvenilir

**Alternatif: Yerel ML Kit**
- Tamamen ücretsiz
- Sınırsız kullanım
- Ama daha az doğruluk

Hangi servisi kullanmak istersiniz? Azure entegrasyonu için kod hazırlayabilirim!


