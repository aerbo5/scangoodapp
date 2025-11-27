# Backend'i Başlatma

## Sorun: "Cannot GET" Hatası

Bu hata, backend'in çalışmadığı anlamına gelir. Backend'i manuel olarak başlatmanız gerekiyor.

## Adım 1: Backend'i Başlatın

**Yeni bir terminal/PowerShell penceresi açın** ve şu komutları çalıştırın:

```bash
cd backend
npm start
```

Backend başarıyla başladığında şu mesajı göreceksiniz:

```
🚀 Scan Good Backend API running on http://localhost:3000
📡 Health check: http://localhost:3000/api/health
```

## Adım 2: Backend'in Çalıştığını Test Edin

**Başka bir terminal açın** ve şu komutu çalıştırın:

```bash
curl http://localhost:3000/api/health
```

veya PowerShell'de:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/health
```

Eğer şu yanıtı alırsanız, backend çalışıyor demektir:

```json
{"status":"ok","message":"Scan Good API is running"}
```

## Adım 3: Frontend'i Başlatın

Backend çalıştıktan sonra, **başka bir terminal açın** ve frontend'i başlatın:

```bash
npx expo start
```

veya web için:

```bash
npx expo start --web
```

## Sorun Giderme

### Backend başlamıyor?

1. **Dependencies yüklü mü?**
   ```bash
   cd backend
   npm install
   ```

2. **Port 3000 kullanımda mı?**
   ```bash
   netstat -ano | findstr :3000
   ```
   Eğer başka bir process kullanıyorsa, onu kapatın veya backend'in portunu değiştirin.

3. **Hata mesajları var mı?**
   Backend'i başlattığınızda hata mesajları görüyorsanız, bunları paylaşın.

### "Cannot GET" hatası devam ediyor?

1. Backend'in çalıştığından emin olun (yukarıdaki test komutunu kullanın)
2. Tarayıcıda `http://localhost:3000/api/health` adresini açın
3. Eğer hala çalışmıyorsa, backend'i yeniden başlatın

## Hızlı Başlatma (3 Terminal)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npx expo start
```

**Terminal 3 - ngrok (Dışarıdan erişim için):**
```bash
ngrok http 3000
```




