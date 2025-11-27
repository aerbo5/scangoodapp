# Mobilde Test Etme - Expo Go ile

## 📱 Expo Go ile Mobilde Test

### Adım 1: Expo Go Uygulamasını İndirin

#### Android:
1. Google Play Store'dan **"Expo Go"** uygulamasını indirin
2. Telefonunuza yükleyin

#### iOS:
1. App Store'dan **"Expo Go"** uygulamasını indirin
2. iPhone'unuza yükleyin

### Adım 2: Frontend'i Başlatın

```bash
npm start
```

Veya:

```bash
npx expo start
```

### Adım 3: QR Kodu Tarayın

1. Terminal'de QR kod görünecek
2. **Expo Go** uygulamasını açın
3. **"Scan QR Code"** seçeneğine tıklayın
4. QR kodu tarayın

### Adım 4: Uygulama Açılacak

QR kod tarandıktan sonra uygulama telefonunuzda açılacak!

## 🔗 Aynı WiFi Ağında Olun

**Önemli:** Telefonunuz ve bilgisayarınız **aynı WiFi ağında** olmalı!

Eğer farklı ağlardaysanız:
- **"Tunnel"** modunu kullanın (daha yavaş ama her yerden çalışır)

## 🌐 Tunnel Modu (Farklı Ağlar İçin)

### Tunnel Modunu Başlatın:

```bash
npx expo start --tunnel
```

Bu mod daha yavaş ama internet üzerinden çalışır (aynı WiFi gerekmez).

## 📱 Android Emulator Kullanma

### Android Studio ile:

1. **Android Studio**'yu açın
2. **AVD Manager**'dan emulator başlatın
3. `npm start` çalıştırın
4. Terminal'de **`a`** tuşuna basın

## 🍎 iOS Simulator (Sadece Mac)

### Xcode ile:

1. **Xcode**'u açın
2. **Simulator**'ı başlatın
3. `npm start` çalıştırın
4. Terminal'de **`i`** tuşuna basın

## 🔧 Sorun Giderme

### QR Kod Görünmüyor

Terminal'de **`s`** tuşuna basarak QR kodu tekrar gösterin.

### Bağlantı Hatası

1. Aynı WiFi ağında olduğunuzdan emin olun
2. Firewall'u kontrol edin
3. Tunnel modunu deneyin: `npx expo start --tunnel`

### Backend Bağlantı Hatası

Mobilde backend'e bağlanmak için:

1. **Ngrok** kullanın (backend'i dışarıya açmak için)
2. Yeni terminal açın:

```bash
ngrok http 3000
```

3. Ngrok URL'ini kopyalayın
4. `src/services/apiService.js` dosyasında URL'i güncelleyin

## ✅ Kontrol Listesi

- [ ] Expo Go uygulaması indirildi
- [ ] Frontend başlatıldı (`npm start`)
- [ ] Telefon ve bilgisayar aynı WiFi'de
- [ ] QR kod tarandı
- [ ] Uygulama telefonda açıldı
- [ ] Backend bağlantısı çalışıyor (ngrok gerekebilir)

## 🎯 Sonuç

Mobilde test etmek için:
- ✅ Expo Go uygulamasını indirin
- ✅ QR kodu tarayın
- ✅ Uygulama telefonunuzda açılacak
- ✅ Kamera ile görüntü çekebilirsiniz!

## 📝 Notlar

- **Development Mode**: Expo Go ile test ederken hot reload çalışır
- **Production Build**: App Store/Play Store için build yapmanız gerekir
- **Backend**: Mobilde backend'e bağlanmak için ngrok kullanmanız gerekebilir


