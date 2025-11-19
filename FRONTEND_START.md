# Frontend Başlatma - Adım Adım

## 🚀 Frontend'i Başlatın

### Adım 1: Ana Klasöre Gidin

```bash
cd C:\Users\ALI\Downloads\files
```

### Adım 2: Frontend'i Başlatın

```bash
npm start
```

Veya:

```bash
npx expo start
```

### Adım 3: Platform Seçin

Terminal'de şu seçenekleri göreceksiniz:

- **`w`** → Web için (tarayıcıda açılacak)
- **`a`** → Android için (emulator veya telefon)
- **`i`** → iOS için (simulator veya telefon)
- **`r`** → Reload (yeniden yükle)

### Adım 4: Web'de Açın

**`w`** tuşuna basın veya tarayıcıda otomatik açılacak.

## 🌐 Web'de Çalıştırma

### Yöntem 1: Expo Development Server

```bash
npm start
# Sonra 'w' tuşuna bas
```

### Yöntem 2: Direkt Web Build

```bash
npm run web
```

## 📱 Mobil'de Çalıştırma

### Android

1. **Android Studio** ile emulator başlatın
2. `npm start` çalıştırın
3. Terminal'de **`a`** tuşuna basın

### iOS (Mac gerekli)

1. **Xcode** ile simulator başlatın
2. `npm start` çalıştırın
3. Terminal'de **`i`** tuşuna basın

### Fiziksel Telefon

1. **Expo Go** uygulamasını telefonunuza indirin
2. `npm start` çalıştırın
3. QR kodu telefonunuzla tarayın

## 🔗 Backend Bağlantısı

Frontend'in backend'e bağlanabilmesi için:

### Local Development

`src/services/apiService.js` dosyasında backend URL'i kontrol edin:

```javascript
if (__DEV__) {
  return 'https://diagenetic-berry-pompously.ngrok-free.dev/api';
}
```

Eğer backend local'de çalışıyorsa (localhost:3000), ngrok kullanmanız gerekebilir:

1. Yeni terminal açın
2. Ngrok'u başlatın:

```bash
ngrok http 3000
```

3. Ngrok URL'ini kopyalayın (örn: `https://xxxxx.ngrok-free.app`)
4. `src/services/apiService.js` dosyasında URL'i güncelleyin:

```javascript
if (__DEV__) {
  return 'https://xxxxx.ngrok-free.app/api';
}
```

## ✅ Kontrol Listesi

- [ ] Backend çalışıyor mu? (`http://localhost:3000/api/health`)
- [ ] Frontend başlatıldı mı? (`npm start`)
- [ ] Web'de açıldı mı? (`w` tuşuna bas)
- [ ] Backend'e bağlanıyor mu? (Browser console'da hata var mı?)

## 🔧 Sorun Giderme

### Port Zaten Kullanılıyor

```bash
# Farklı port kullan
npx expo start --port 8082
```

### Dependencies Eksik

```bash
npm install
```

### Backend Bağlantı Hatası

- Backend çalışıyor mu kontrol edin
- Ngrok kullanıyorsanız URL'i güncelleyin
- CORS ayarlarını kontrol edin

## 🎯 Sonuç

Frontend başlatıldıktan sonra:
- ✅ Web'de açılacak
- ✅ Backend'e bağlanacak
- ✅ Kamera ile görüntü çekebileceksiniz
- ✅ Gerçek sonuçlar alacaksınız!

