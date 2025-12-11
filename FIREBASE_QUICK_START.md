# ⚡ Firebase Quick Start - Hızlı Başlangıç

## 🎯 5 Adımda Firebase'e Geçiş

### 1️⃣ Firebase Projesi Oluştur (2 dakika)

1. https://console.firebase.google.com
2. **"Add project"** → `scangoodapp` → **Create**

### 2️⃣ Firebase CLI Kur (1 dakika)

```bash
npm install -g firebase-tools
firebase login
```

### 3️⃣ Firebase Init (2 dakika)

```bash
firebase init
```

**Seçenekler:**
- ✅ Functions
- ✅ Hosting
- ❌ Firestore (opsiyonel)

**Ayarlar:**
- Functions language: **JavaScript**
- Hosting public directory: **web-build**
- Single-page app: **Yes**

### 4️⃣ Backend'i Taşı (10 dakika)

Backend kodunu `functions/index.js`'e taşıyacağız (otomatik script hazırlayacağım).

### 5️⃣ Deploy (5 dakika)

```bash
npm run build:web
firebase deploy
```

---

## 🚀 Hazır Script

Size otomatik migration script'i hazırlayacağım. Şimdi başlayalım mı?

