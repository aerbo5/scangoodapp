# 📱 Frontend Başlatma Rehberi

## 📂 Klasör Yapısı

```
C:\Users\ALI\Downloads\files\     ← ANA KLASÖR (Frontend burada)
├── App.js                         ← Frontend ana dosya
├── package.json                   ← Frontend package.json
├── src/                           ← Frontend kaynak kodları
│   ├── screens/
│   ├── components/
│   ├── services/
│   └── ...
└── backend/                       ← Backend klasörü (ayrı)
    ├── server.js
    └── package.json
```

---

## 🚀 Frontend'i Başlatma

### ✅ Doğru Klasör: Ana Klasör

```bash
# Ana klasörde (C:\Users\ALI\Downloads\files)
npm start
```

veya

```bash
# Ana klasörde
npx expo start
```

---

## 📋 Tam Adımlar

### 1. Terminal 1: Backend
```bash
cd C:\Users\ALI\Downloads\files\backend
npm start
```

### 2. Terminal 2: Ngrok
```bash
ngrok http 3001
```
Ngrok URL'ini kopyala (örn: `https://abc123.ngrok-free.app`)

### 3. Terminal 3: Frontend (ANA KLASÖRDE)
```bash
cd C:\Users\ALI\Downloads\files
npm start
```

---

## ⚠️ ÖNEMLİ

- ❌ **YANLIŞ:** `cd backend && npm start` (Bu backend'i başlatır)
- ✅ **DOĞRU:** Ana klasörde `npm start` (Frontend'i başlatır)

---

## 🔍 Kontrol

Frontend başlatıldığında:
- ✅ QR kod görünecek
- ✅ Terminal'de "Metro bundler" mesajı görünecek
- ✅ Expo DevTools açılacak

---

## 📝 Notlar

- Frontend: Ana klasörde (`C:\Users\ALI\Downloads\files`)
- Backend: `backend/` klasöründe (`C:\Users\ALI\Downloads\files\backend`)


