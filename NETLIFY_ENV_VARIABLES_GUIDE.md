# 🔧 Netlify Environment Variables Rehberi

## 📋 Netlify'da Olması Gerekenler

Netlify **frontend** için kullanılıyor. Frontend sadece backend'e API çağrıları yapıyor, bu yüzden sadece backend URL'ine ihtiyaç duyuyor.

### ✅ Gerekli Environment Variables

#### 1. `REACT_APP_API_URL` (ZORUNLU)
**Amaç:** Frontend'in backend'e bağlanması için

**Değer:**
```
https://scangoodapp-production.up.railway.app/api
```

⚠️ **ÖNEMLİ:** 
- URL'in sonunda `/api` olmalı!
- Railway backend URL'iniz: `https://scangoodapp-production.up.railway.app`
- Tam URL: `https://scangoodapp-production.up.railway.app/api`

#### 2. `NODE_VERSION` (Önerilen)
**Amaç:** Build sırasında Node.js versiyonu

**Değer:**
```
18
```

#### 3. `EXPO_USE_METRO` (Önerilen)
**Amaç:** Expo Metro bundler kullanımı

**Değer:**
```
true
```

---

## ❌ Netlify'da OLMAMASI Gerekenler

**⚠️ ÖNEMLİ:** Aşağıdaki API key'ler **SADECE Railway'de** olmalı, Netlify'da OLMAMALI!

### Backend API Key'leri (Railway'de Olmalı)

Bu key'ler frontend'de kullanılmıyor, sadece backend'de kullanılıyor:

- ❌ `GOOGLE_GEMINI_API_KEY` → **Sadece Railway'de**
- ❌ `AZURE_COMPUTER_VISION_KEY` → **Sadece Railway'de**
- ❌ `AZURE_COMPUTER_VISION_ENDPOINT` → **Sadece Railway'de**
- ❌ `GOOGLE_CLOUD_VISION_API_KEY` → **Sadece Railway'de**

**Neden?**
- Frontend bu API key'leri kullanmıyor
- Tüm Vision API çağrıları backend'de yapılıyor
- Frontend sadece backend'e HTTP istekleri gönderiyor
- API key'ler frontend'de güvenlik riski oluşturur

---

## 🔍 Netlify Environment Variables Kontrol Listesi

### Netlify Dashboard'da Kontrol Edin

1. **Netlify Dashboard**: https://app.netlify.com
2. Site'inize tıklayın
3. **Site settings** > **Environment variables** bölümüne gidin

### Olması Gerekenler ✅

- [ ] `REACT_APP_API_URL` = `https://scangoodapp-production.up.railway.app/api`
- [ ] `NODE_VERSION` = `18` (opsiyonel ama önerilen)
- [ ] `EXPO_USE_METRO` = `true` (opsiyonel ama önerilen)

### Olmaması Gerekenler ❌

- [ ] `GOOGLE_GEMINI_API_KEY` → **SİLİN** (Railway'de olmalı)
- [ ] `AZURE_COMPUTER_VISION_KEY` → **SİLİN** (Railway'de olmalı)
- [ ] `AZURE_COMPUTER_VISION_ENDPOINT` → **SİLİN** (Railway'de olmalı)
- [ ] `GOOGLE_CLOUD_VISION_API_KEY` → **SİLİN** (Railway'de olmalı)

---

## 🚀 Railway Environment Variables (Backend)

Bu key'ler **SADECE Railway'de** olmalı:

### Railway Dashboard'da Olması Gerekenler

1. **Railway Dashboard**: https://railway.app
2. Backend service'inize tıklayın
3. **Variables** sekmesine gidin

### Backend API Key'leri ✅

- [ ] `GOOGLE_GEMINI_API_KEY` = `your-gemini-api-key`
- [ ] `AZURE_COMPUTER_VISION_KEY` = `your-azure-key`
- [ ] `AZURE_COMPUTER_VISION_ENDPOINT` = `https://your-resource.cognitiveservices.azure.com/`
- [ ] `GOOGLE_CLOUD_VISION_API_KEY` = `your-google-vision-key` (opsiyonel)

---

## 📊 Özet Tablo

| Variable | Netlify | Railway | Açıklama |
|----------|---------|---------|----------|
| `REACT_APP_API_URL` | ✅ | ❌ | Frontend backend URL'i |
| `NODE_VERSION` | ✅ | ❌ | Build için Node versiyonu |
| `EXPO_USE_METRO` | ✅ | ❌ | Expo bundler ayarı |
| `GOOGLE_GEMINI_API_KEY` | ❌ | ✅ | Backend Vision API |
| `AZURE_COMPUTER_VISION_KEY` | ❌ | ✅ | Backend Vision API |
| `AZURE_COMPUTER_VISION_ENDPOINT` | ❌ | ✅ | Backend Vision API |
| `GOOGLE_CLOUD_VISION_API_KEY` | ❌ | ✅ | Backend Vision API (opsiyonel) |

---

## 🔧 Netlify'da Gereksiz Key'leri Silme

Eğer Netlify'da backend API key'lerini eklediyseniz:

1. **Netlify Dashboard** > Site'iniz
2. **Site settings** > **Environment variables**
3. Gereksiz key'leri bulun (Gemini, Azure, Google Vision)
4. Her birinin yanındaki **"Delete"** butonuna tıklayın
5. **"Save"** tıklayın
6. **Deploys** > **"Trigger deploy"** > **"Deploy site"** ile yeniden deploy edin

---

## ✅ Doğru Yapılandırma

### Netlify (Frontend)
```env
REACT_APP_API_URL=https://scangoodapp-production.up.railway.app/api
NODE_VERSION=18
EXPO_USE_METRO=true
```

### Railway (Backend)
```env
GOOGLE_GEMINI_API_KEY=your-gemini-key
AZURE_COMPUTER_VISION_KEY=your-azure-key
AZURE_COMPUTER_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
GOOGLE_CLOUD_VISION_API_KEY=your-google-vision-key
```

---

## 🎯 Sonuç

- **Netlify:** Sadece frontend build ayarları ve backend URL'i
- **Railway:** Tüm API key'leri ve backend environment variables

Bu yapılandırma hem güvenlik hem de performans açısından doğru yaklaşımdır! 🔒



