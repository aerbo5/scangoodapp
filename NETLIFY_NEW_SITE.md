# Netlify'da Yeni Site Oluşturma

## 🚀 Hızlı Adımlar

### 1. Netlify Dashboard
https://app.netlify.com adresine gidin

### 2. Yeni Site Oluştur
1. **"Add new site"** butonuna tıklayın
2. **"Import an existing project"** seçin
3. **GitHub** seçin
4. Repository seçin: `aerbo5/pricecheck-`
5. Build settings:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
   - **Base directory**: (boş bırakın)
6. **"Show advanced"** tıklayın
7. **Environment variables** ekleyin:
   ```
   BACKEND_URL=https://your-backend.railway.app
   NODE_VERSION=18
   ```
   ⚠️ **ÖNEMLİ**: Backend'i önce Railway'a deploy edin, sonra URL'ini buraya ekleyin!

### 3. Deploy
1. **"Deploy site"** tıklayın
2. ⏳ 5-10 dakika bekleyin
3. ✅ Deploy tamamlandığında site URL'iniz görünecek!

## 📝 Site URL Formatı

Netlify otomatik olarak bir URL oluşturur:
```
https://[random-name]-[random-numbers].netlify.app
```

Örnek:
```
https://pricecheck-app-abc123.netlify.app
```

## ✅ Deploy Sonrası

1. Site URL'ini kopyalayın
2. Siteyi test edin
3. Backend URL'ini environment variables'a ekleyin (eğer eklemediyseniz)
4. Redeploy yapın

## 🔗 Netlify Dashboard

https://app.netlify.com

