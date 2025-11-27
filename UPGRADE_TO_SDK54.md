# Expo SDK 54'e Yükseltme Rehberi

## Adım 1: Package.json Güncellendi ✅

Package.json dosyası SDK 54 için güncellendi. Şimdi bağımlılıkları yükleyin:

## Adım 2: Bağımlılıkları Yükleyin

```bash
# Önce eski node_modules'i temizleyin (opsiyonel ama önerilir)
rm -rf node_modules
# Windows için:
# rmdir /s /q node_modules

# Package.json'ı güncelledik, şimdi yükleyin
npm install

# Expo'nun önerdiği versiyonları kontrol edin ve güncelleyin
npx expo install --fix
```

## Adım 3: Expo Doctor ile Kontrol

```bash
npx expo-doctor
```

Bu komut uyumsuzlukları kontrol eder ve düzeltmeleri önerir.

## Adım 4: Babel Config Kontrolü

`babel.config.js` dosyanızı kontrol edin. Eğer yoksa oluşturun:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

## Adım 5: Önbelleği Temizleyin ve Başlatın

```bash
# Metro önbelleğini temizleyin
npx expo start --clear

# veya
npm start -- --clear
```

## Önemli Değişiklikler SDK 54'te:

1. **React Native 0.76**: Daha yeni React Native versiyonu
2. **React 18.3.1**: React'in en son versiyonu
3. **expo-camera ~16.0.0**: Camera paketi güncellendi
4. **expo-image-picker ~16.0.0**: Image picker güncellendi
5. **@react-native-async-storage/async-storage 2.1.0**: AsyncStorage güncellendi

## Olası Sorunlar ve Çözümler:

### Sorun: "Module not found" hataları
**Çözüm**: `npx expo install --fix` komutunu çalıştırın

### Sorun: Metro bundler hataları
**Çözüm**: `npx expo start --clear` ile önbelleği temizleyin

### Sorun: Camera veya Image Picker çalışmıyor
**Çözüm**: `npx expo install expo-camera expo-image-picker` ile paketleri yeniden yükleyin

### Sorun: Firebase uyumsuzluğu
**Çözüm**: Firebase SDK'sını güncelleyin:
```bash
npm install firebase@latest
```

## Test Etme:

1. Uygulamayı başlatın: `npx expo start`
2. Expo Go uygulamasında QR kodu tarayın
3. Tüm özellikleri test edin (camera, image picker, vb.)

## Notlar:

- SDK 54, Expo Go'da çalışmak için gereklidir
- Eğer hala sorun yaşıyorsanız, `npx expo-doctor` çıktısını kontrol edin
- Tüm native modüllerin uyumlu versiyonlarını kullandığınızdan emin olun




