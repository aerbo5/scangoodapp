# Local'de Uygulamayı Test Etme

## 🚀 Yöntem 1: Build Edilmiş Dosyaları Serve Et (Production Build)

### Adım 1: Build Et (Eğer yoksa)
```bash
npx expo export --platform web --output-dir web-build
```

### Adım 2: Serve Et
```bash
npx serve web-build -p 3000
```

### Adım 3: Tarayıcıda Aç
- **URL**: http://localhost:3000
- Uygulama açılacak!

## 🚀 Yöntem 2: Expo Development Server (Development Mode)

### Adım 1: Expo Server'ı Başlat
```bash
npm start
```

### Adım 2: Web'i Seç
- Terminal'de **`w`** tuşuna basın (web için)
- Veya tarayıcıda otomatik açılacak

### Adım 3: Tarayıcıda Aç
- **URL**: http://localhost:8081 (veya terminal'de gösterilen port)
- Development mode'da çalışacak (hot reload aktif)

## 🚀 Yöntem 3: Python HTTP Server (Basit)

### Adım 1: web-build Klasörüne Git
```bash
cd web-build
```

### Adım 2: Python Server Başlat
```bash
python -m http.server 3000
```

### Adım 3: Tarayıcıda Aç
- **URL**: http://localhost:3000

## 📝 Notlar

- **Yöntem 1**: Production build'i test eder (Netlify'da olacak gibi)
- **Yöntem 2**: Development mode (hot reload, debugging)
- **Yöntem 3**: En basit yöntem (Python gerekli)

## ✅ Kontrol Listesi

- [ ] Build başarılı mı? (`web-build` klasörü var mı?)
- [ ] Server çalışıyor mu? (Port açık mı?)
- [ ] Tarayıcıda açılıyor mu?
- [ ] Uygulama çalışıyor mu?

## 🔧 Sorun Giderme

### Port Zaten Kullanılıyor
```bash
# Farklı port kullan
npx serve web-build -p 3001
```

### Serve Bulunamıyor
```bash
# Önce yükle
npm install -g serve
# Sonra çalıştır
serve web-build -p 3000
```

### Python Server
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```


