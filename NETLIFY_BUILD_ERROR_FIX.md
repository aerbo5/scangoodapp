# Netlify Build Hatası - Tam Log Gerekli

## 🔍 Sorun

Paylaştığınız log'lar build hatasının gerçek nedenini göstermiyor. Tam log'u görmemiz gerekiyor.

## ✅ Çözüm: Tam Log'u Alın

### Netlify Dashboard'dan:

1. **Netlify Dashboard**: https://app.netlify.com
2. Site sayfanıza gidin
3. **"Deploys"** sekmesine gidin
4. Başarısız deploy'a tıklayın
5. **"View deploy log"** veya **"More deploy details"** tıklayın
6. **Tüm log'u kopyalayın** (özellikle hata satırlarını)

### Önemli: Şu satırları arayın:

- `error:` ile başlayan satırlar
- `Failed` ile başlayan satırlar
- `npm ERR!` ile başlayan satırlar
- `Command failed` ile başlayan satırlar
- Son 20-30 satır (genellikle hata orada olur)

## 🔧 Olası Hatalar ve Çözümleri

### 1. Expo Komutu Bulunamıyor

**Hata:**
```
expo: command not found
```

**Çözüm:**
`netlify.toml`'da şunu kullanın:
```toml
command = "npm install -g expo-cli && npx expo export:web"
```

VEYA:
```toml
command = "npm install && npx expo export:web"
```

### 2. Dependencies Eksik

**Hata:**
```
Cannot find module 'expo'
```

**Çözüm:**
Build command'ı şu şekilde değiştirin:
```toml
command = "npm install && npx expo export:web"
```

### 3. Build Output Bulunamıyor

**Hata:**
```
Publish directory 'web-build' does not exist
```

**Çözüm:**
Expo export komutunu şu şekilde güncelleyin:
```toml
command = "npx expo export:web --output-dir web-build"
```

### 4. Node Version Uyumsuzluğu

**Hata:**
```
Unsupported Node version
```

**Çözüm:**
`netlify.toml`'da Node version'ı belirtin:
```toml
[build.environment]
  NODE_VERSION = "18"
```

## 📝 Tam Log'u Paylaşın

Lütfen şu bilgileri paylaşın:
1. **Hata mesajının tamamı** (son 30-50 satır)
2. **Hangi satırda hata oluştu?**
3. **Hata mesajı ne diyor?**

Bu bilgilerle tam çözümü sağlayabilirim! 🎯

