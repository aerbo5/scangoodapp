# 🔍 Railway'da Backend Servisini Bulma

Gördüğünüz loglar **frontend (Expo)** logları. Backend loglarını görmek için backend servisini bulmanız gerekiyor.

---

## 🎯 Backend Servisini Bulma

### Yöntem 1: Railway Dashboard'da Servisleri Kontrol Edin

1. **Railway Dashboard'a gidin**: https://railway.app
2. Projenize tıklayın
3. **Sol menüde servisleri kontrol edin:**
   - Eğer birden fazla servis varsa, **backend** veya **api** adlı servisi bulun
   - Genellikle servisler şöyle adlandırılır:
     - `backend`
     - `api`
     - `server`
     - `scangoodapp-backend`

4. **Backend servisine tıklayın**
5. **"Deployments"** sekmesine gidin
6. Son deployment'ı seçin
7. **"View Logs"** butonuna tıklayın

### Yöntem 2: Tüm Servisleri Listeleyin

1. Railway Dashboard'da projenize gidin
2. Ana sayfada **tüm servisler** listelenir
3. Her servisin adını ve tipini kontrol edin
4. **Backend/API servisini** bulun

---

## ✅ Backend Loglarında Görmeniz Gerekenler

Backend loglarında şunları görmelisiniz:

```
Starting Container
> scan-good-backend@1.0.0 start
> node server.js
✅ Azure Computer Vision initialized (5,000 free requests/month)
✅ Google Gemini Vision API initialized (AI-powered product recognition)
Server is running on port 3001
```

**Eğer bunları görmüyorsanız:**
- Backend servisi bulunamadı
- Backend başlatılmadı
- Environment variables yüklenmedi

---

## 🔧 Backend Servisi Yoksa

Eğer Railway'da sadece frontend servisi varsa ve backend servisi yoksa:

### Seçenek 1: Backend Servisi Ekleme

1. Railway Dashboard'da projenize gidin
2. **"+ New"** butonuna tıklayın
3. **"GitHub Repo"** seçin
4. Repository'nizi seçin
5. **Root Directory** olarak `backend` klasörünü seçin
6. **Start Command** olarak `npm start` yazın
7. Environment variables'ları ekleyin

### Seçenek 2: Monorepo Yapılandırması

Eğer tek bir serviste hem frontend hem backend varsa:
1. Railway'da servis ayarlarına gidin
2. **"Settings"** sekmesine tıklayın
3. **"Root Directory"** ayarını kontrol edin
4. Backend için ayrı bir servis oluşturun

---

## 🎯 Hızlı Kontrol

### Backend URL'ini Test Edin

Tarayıcıda şu URL'leri açın:

1. **Health Check:**
   ```
   https://scangoodapp-production.up.railway.app/api/health
   ```
   Beklenen: `{"status":"ok","message":"Scan Good API is running"}`

2. **Debug Endpoint:**
   ```
   https://scangoodapp-production.up.railway.app/api/debug/env
   ```
   Beklenen: Environment variables durumu

**Eğer bu URL'ler çalışıyorsa:**
- Backend çalışıyor demektir
- Logları yanlış serviste görüntülüyorsunuz

**Eğer bu URL'ler çalışmıyorsa:**
- Backend servisi yok veya çalışmıyor
- Backend servisini oluşturmanız gerekiyor

---

## 📝 Checklist

- [ ] Railway Dashboard'da tüm servisleri kontrol ettim
- [ ] Backend servisini buldum
- [ ] Backend servisinin loglarını görüntüledim
- [ ] Backend loglarında `✅ Azure Computer Vision initialized` mesajını gördüm
- [ ] Backend URL'lerini test ettim (`/api/health`, `/api/debug/env`)

---

## 🆘 Hala Bulamıyorsanız

1. Railway Dashboard'da projenizin **ana sayfasının ekran görüntüsünü** paylaşın
2. Hangi servislerin listelendiğini gösterin
3. Backend servisi var mı yok mu belirtin

Bu bilgilerle backend servisini bulmanıza yardımcı olabilirim!

