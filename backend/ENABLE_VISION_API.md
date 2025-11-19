# Google Cloud Vision API'yi Etkinleştirme

## 🔍 Sorun

Backend loglarında şu hatayı görüyorsunuz:
```
Cloud Vision API has not been used in project 693337154262 before or it is disabled.
PERMISSION_DENIED
```

Bu, Google Cloud Vision API'nin projenizde etkinleştirilmediği anlamına gelir.

## ✅ Çözüm: API'yi Etkinleştirin

### Adım 1: Google Cloud Console'a Gidin

1. **Google Cloud Console**'a gidin: https://console.cloud.google.com/
2. Projenizi seçin (Project ID: `693337154262`)

### Adım 2: Cloud Vision API'yi Etkinleştirin

**Yöntem 1: Direkt Link (Hızlı)**
1. Bu linke tıklayın: https://console.developers.google.com/apis/api/vision.googleapis.com/overview?project=693337154262
2. **"Enable"** (Etkinleştir) butonuna tıklayın
3. Birkaç saniye bekleyin

**Yöntem 2: Manuel (Adım Adım)**
1. Sol menüden **"APIs & Services" > "Library"** seçin
2. Arama kutusuna **"Cloud Vision API"** yazın
3. **"Cloud Vision API"** sonucuna tıklayın
4. **"Enable"** (Etkinleştir) butonuna tıklayın

### Adım 3: API Key'in Doğru Projede Olduğundan Emin Olun

1. **"APIs & Services" > "Credentials"** bölümüne gidin
2. API key'inize tıklayın
3. **"API restrictions"** bölümünde:
   - **"Restrict key"** seçiliyse, **"Cloud Vision API"** listede olmalı
   - Veya **"Don't restrict key"** seçili olabilir (test için)

### Adım 4: Backend'i Yeniden Başlatın

API etkinleştirildikten sonra:

1. Backend'i durdurun (Ctrl+C)
2. Tekrar başlatın:
   ```bash
   cd backend
   npm start
   ```

### Adım 5: Test Edin

1. Telefonda kamera ile bir resim çekin
2. Backend console'unda şunu görmelisiniz:
   ```
   ✅ Vision API returned X labels: ...
   ```

## ⏱️ Bekleme Süresi

API'yi etkinleştirdikten sonra:
- Genellikle **1-2 dakika** içinde aktif olur
- Bazen **5-10 dakika** sürebilir
- Hala çalışmıyorsa, birkaç dakika bekleyip tekrar deneyin

## 🔍 Kontrol

API'nin etkin olup olmadığını kontrol etmek için:

1. Google Cloud Console'da **"APIs & Services" > "Enabled APIs"** bölümüne gidin
2. **"Cloud Vision API"** listede görünmeli
3. Durumu **"Enabled"** olmalı

## ✅ Başarılı Durum

API etkinleştirildikten sonra backend loglarında şunu göreceksiniz:
```
🔍 Calling Google Vision API for label detection...
✅ Vision API returned 5 labels: Water, Bottle, Spring Water, Product, Beverage
✅ Labels detected: Water, Bottle, Spring Water, Product, Beverage
```

## 🐛 Hala Çalışmıyorsa

1. **API Key doğru mu?** → `.env` dosyasını kontrol edin
2. **API etkin mi?** → Google Cloud Console'da kontrol edin
3. **Bekleme süresi** → Birkaç dakika bekleyin
4. **Farklı API key deneyin** → Yeni bir API key oluşturun

## 📝 Notlar

- API key'ler projeye özeldir
- API'yi etkinleştirmek ücretsizdir (kullanım limitleri var)
- API etkinleştirildikten sonra hemen çalışmaya başlar

