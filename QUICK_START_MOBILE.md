# 🚀 Hızlı Başlangıç: Expo Go ile Mobilde Çalıştırma

## ⚡ 3 Adımda Başlat

### 1️⃣ Backend'i Başlat
```bash
cd backend
npm start
```
✅ Backend `http://localhost:3001` adresinde çalışacak

### 2️⃣ Ngrok'u Başlat (Yeni Terminal)
```bash
ngrok http 3001
```
✅ Ngrok URL'ini kopyala (örn: `https://abc123.ngrok-free.app`)

### 3️⃣ Frontend'i Başlat (Yeni Terminal)
```bash
# Ana klasörde
npm start
```
✅ QR kod görünecek

---

## 📱 Telefonda Aç

1. **Expo Go** uygulamasını aç
2. QR kodu tara
3. Uygulama açılacak! 🎉

---

## ⚙️ ÖNEMLİ: Ngrok URL'ini Güncelle

Ngrok başlattıktan sonra:

1. `src/services/apiService.js` dosyasını aç
2. Şu satırı bul:
   ```javascript
   return 'https://diagenetic-berry-pompously.ngrok-free.dev/api';
   ```
3. Ngrok URL'in ile değiştir (sonuna `/api` ekle):
   ```javascript
   return 'https://abc123.ngrok-free.app/api';  // Senin ngrok URL'in
   ```
4. Frontend'i yeniden başlat (Ctrl+C sonra `npm start`)

---

## ✅ Kontrol Listesi

- [ ] Backend çalışıyor (`http://localhost:3001/api/health`)
- [ ] Ngrok çalışıyor ve URL aldın
- [ ] `apiService.js`'de ngrok URL'i güncellendi
- [ ] Frontend başlatıldı (`npm start`)
- [ ] Expo Go ile QR kod tarandı
- [ ] Uygulama telefonda açıldı

---

## 🐛 Sorun mu var?

**"Network request failed" hatası:**
- Ngrok URL'ini kontrol et
- Backend çalışıyor mu? → `http://localhost:3001/api/health`
- `apiService.js`'de URL doğru mu?

**QR kod görünmüyor:**
- Terminal penceresini büyüt
- `npm start` komutunu tekrar çalıştır

**Backend'e bağlanamıyor:**
- Ngrok çalışıyor mu?
- Port 3001 doğru mu? (backend/server.js'de kontrol et)

---

## 📝 Notlar

- **Port:** Backend port 3001'de çalışıyor
- **Ngrok URL:** Her başlatışta değişir, güncellemeyi unutma!
- **Aynı WiFi:** Telefon ve bilgisayar aynı WiFi'de olmalı (QR kod için)

---

Detaylı rehber için: `MOBILE_EXPO_GO_SETUP.md`


