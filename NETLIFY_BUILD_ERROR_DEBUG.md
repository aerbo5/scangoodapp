# Netlify Build Hatası - Debug Rehberi

## 🔍 Sorun
Build script başarısız oluyor (exit code: 2). Gerçek hata mesajı log'larda görünmüyor.

## ✅ Adım 1: Tam Log'u Alın

1. **Netlify Dashboard**: https://app.netlify.com
2. Site sayfanıza gidin
3. **"Deploys"** sekmesine gidin
4. Başarısız deploy'a tıklayın
5. **"View deploy log"** veya **"More deploy details"** tıklayın
6. **Tüm log'u kopyalayın** (özellikle 13. satırdan sonraki hata mesajlarını)

## ✅ Adım 2: netlify.toml Kontrolü

`netlify.toml` dosyası şu şekilde olmalı:

```toml
[build]
  command = "npm install && npx expo export --platform web --output-dir web-build"
  publish = "web-build"

[build.environment]
  NODE_VERSION = "18"
  EXPO_USE_METRO = "true"
```

## ✅ Adım 3: package.json Kontrolü

Root `package.json` dosyasında şu script'ler olmalı:

```json
{
  "scripts": {
    "build:web": "expo export --platform web --output-dir web-build",
    "build": "expo export --platform web --output-dir web-build"
  }
}
```

## ✅ Adım 4: Local'de Test Edin

Local'de build komutunu çalıştırın:

```bash
npm install
npx expo export --platform web --output-dir web-build
```

Eğer hata alırsanız, o hatayı düzeltin.

## 🔧 Olası Sorunlar ve Çözümleri

### 1. Expo CLI Bulunamıyor

**Hata:**
```
expo: command not found
```

**Çözüm:**
`netlify.toml`'da şunu kullanın:
```toml
command = "npm install -g @expo/cli && npm install && npx expo export --platform web --output-dir web-build"
```

### 2. Dependencies Eksik

**Hata:**
```
Cannot find module 'expo'
```

**Çözüm:**
Build command'ı şu şekilde değiştirin:
```toml
command = "npm ci && npx expo export --platform web --output-dir web-build"
```

### 3. Build Output Bulunamıyor

**Hata:**
```
Publish directory 'web-build' does not exist
```

**Çözüm:**
Export komutunu kontrol edin, output directory doğru mu?

## 📝 Tam Log'u Paylaşın

Lütfen şu bilgileri paylaşın:
1. **13. satırdan sonraki tüm log'lar** (hata mesajları)
2. **İlk hata mesajı ne diyor?**
3. **Local'de build çalışıyor mu?**

Bu bilgilerle tam çözümü sağlayabilirim! 🎯

