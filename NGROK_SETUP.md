# Ngrok Kurulumu - Mobil Backend Bağlantısı

## 🔍 Sorun
Mobilde test ederken backend'e bağlanamıyorsunuz çünkü telefon localhost'a erişemez.

## ✅ Çözüm: Ngrok Kullanın

Ngrok, local backend'inizi internet üzerinden erişilebilir hale getirir.

### Adım 1: Ngrok'u İndirin

1. https://ngrok.com/ adresine gidin
2. **"Get started for free"** tıklayın
3. Hesap oluşturun (ücretsiz)
4. Ngrok'u indirin ve kurun

### Adım 2: Ngrok'u Başlatın

Yeni bir terminal açın:

```bash
ngrok http 3000
```

### Adım 3: Ngrok URL'ini Kopyalayın

Ngrok size bir URL verecek:

```
Forwarding  https://xxxxx.ngrok-free.app -> http://localhost:3000
```

**`https://xxxxx.ngrok-free.app`** URL'ini kopyalayın.

### Adım 4: Frontend'te URL'i Güncelleyin

`src/services/apiService.js` dosyasında:

```javascript
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'https://xxxxx.ngrok-free.app/api';  // Ngrok URL'inizi buraya yapıştırın
  }
  // ...
};
```

### Adım 5: Frontend'i Yeniden Başlatın

Frontend'i durdurun (Ctrl+C) ve tekrar başlatın:

```bash
npm start
```

## 📱 Mobilde Test

1. Expo Go ile QR kodu tarayın
2. Uygulama açılacak
3. Backend'e bağlanabilecek (ngrok sayesinde)

## ⚠️ Önemli Notlar

- **Ngrok URL'i her başlatışta değişir** - Her seferinde güncellemeniz gerekir
- **Ücretsiz plan**: URL her başlatışta değişir
- **Ücretli plan**: Sabit URL alabilirsiniz

## 🔧 Alternatif: Tunnel Modu (Expo)

Expo'nun kendi tunnel modunu da kullanabilirsiniz:

```bash
npx expo start --tunnel
```

Bu mod backend için değil, frontend için tunnel sağlar. Backend için hala ngrok gerekir.

## ✅ Kontrol Listesi

- [ ] Ngrok kuruldu
- [ ] Ngrok başlatıldı (`ngrok http 3000`)
- [ ] Ngrok URL'i kopyalandı
- [ ] Frontend'te URL güncellendi
- [ ] Frontend yeniden başlatıldı
- [ ] Mobilde test edildi

## 🎯 Sonuç

Ngrok ile:
- ✅ Backend'iniz internet üzerinden erişilebilir
- ✅ Mobilde test edebilirsiniz
- ✅ Gerçek API sonuçları alabilirsiniz

