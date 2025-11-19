# GitHub'da package.json Oluşturma - Adım Adım

## 🎯 Sorun
Root `package.json` dosyası GitHub'da yok. GitHub web arayüzünden oluşturmamız gerekiyor.

## ✅ Adım Adım: GitHub'da package.json Oluştur

### 1. GitHub Repository'ye Gidin
1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. Ana dizinde **"Add file"** > **"Create new file"** tıklayın

### 2. Dosya Adını Girin
- Dosya adı: `package.json`

### 3. İçeriği Yapıştırın
Aşağıdaki içeriği tamamen kopyalayıp yapıştırın:

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
  "dependencies": {
    "@expo/metro-runtime": "~6.1.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "axios": "^1.13.2",
    "expo": "~54.0.0",
    "expo-camera": "~17.0.9",
    "expo-image-picker": "~17.0.8",
    "expo-status-bar": "~3.0.8",
    "firebase": "^12.5.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-web": "^0.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

### 4. Commit Edin
1. Sayfanın altında **"Commit new file"** bölümüne gidin
2. Commit message: `Add: Root package.json with build scripts`
3. **"Commit new file"** butonuna tıklayın

## ✅ Sonuç

- ✅ `package.json` GitHub'da oluşturuldu
- ✅ `build:web` ve `build` script'leri eklendi
- ✅ Netlify deploy başlayacak!

## 🚀 Netlify Deploy Kontrolü

1. Netlify Dashboard: https://app.netlify.com
2. Site sayfanıza gidin
3. **"Deploys"** sekmesine gidin
4. Yeni deploy başlamış olmalı
5. Build başarılı olmalı! 🎉

## 📝 Notlar

- Dosya adını tam olarak `package.json` yazın (büyük/küçük harf önemli!)
- JSON formatını koruyun (virgüller, tırnak işaretleri)
- `build:web` ve `build` script'leri mutlaka olmalı

