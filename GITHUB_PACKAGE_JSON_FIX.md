# GitHub'da package.json Güncelleme - Doğru Dosya

## ⚠️ Önemli: İki Farklı package.json Var!

### 1. Root package.json (Ana Dosya - Bu Güncellenmeli)
**Konum:** Proje kök dizininde (`/package.json`)

**İçerik:**
```json
{
  "name": "scan-good-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:web": "expo export --platform web --output-dir web-build",
    "build": "expo export --platform web --output-dir web-build"
  },
  ...
}
```

### 2. netlify/functions/package.json (Bu Değiştirilmeyecek!)
**Konum:** `netlify/functions/package.json`

**İçerik:**
```json
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "description": "Netlify Functions for Scan Good API proxy",
  "main": "api.js",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

## ✅ GitHub'da Doğru Dosyayı Güncelle

### Adım 1: Root package.json'ı Bulun

1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. **Ana dizinde** `package.json` dosyasını bulun (netlify klasörü dışında!)
3. Dosya yolu: `/package.json` (root seviyesinde)

### Adım 2: Script'leri Kontrol Edin

`package.json` dosyasında `scripts` bölümünü bulun. Şu şekilde olmalı:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "build:web": "expo export --platform web --output-dir web-build",
  "build": "expo export --platform web --output-dir web-build"
}
```

### Adım 3: Eğer Farklıysa Güncelleyin

Eğer `build:web` ve `build` script'leri yoksa veya farklıysa:

1. **✏️ Edit** butonuna tıklayın
2. `"web"` satırından sonra şunu ekleyin:
   ```json
   "build:web": "expo export --platform web --output-dir web-build",
   "build": "expo export --platform web --output-dir web-build"
   ```
3. **Commit changes** yapın

## 📝 Dosya Yapısı

```
pricecheck-/
├── package.json          ← BU GÜNCELLENMELİ (Root)
├── netlify.toml          ← BU GÜNCELLENMELİ
├── netlify/
│   └── functions/
│       └── package.json  ← BU DEĞİŞTİRİLMEYECEK
└── ...
```

## ✅ Kontrol Listesi

- [ ] Root `package.json` dosyasını buldunuz mu? (netlify klasörü dışında)
- [ ] `build:web` script'i var mı?
- [ ] `build` script'i var mı?
- [ ] `netlify.toml` güncellendi mi?

## 🎯 Sonuç

Root `package.json` dosyasında `build:web` ve `build` script'leri olmalı. `netlify/functions/package.json` dosyasına dokunmayın, o Netlify Functions için!

