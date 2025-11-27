# Ürün Linkleri Özelliği - Deploy Rehberi

## ✅ Yapılan Değişiklikler

1. **Yeni Servis**: `backend/services/productSearchService.js`
   - Google Custom Search API ile ürün linklerini bulur
   - Amazon, Target, Walmart, Google Shopping linklerini döner

2. **Backend Endpoint Güncellendi**: `/api/scan/product`
   - Ürün tanıma sonrası internetten linkleri arar
   - Response'a `productLinks` eklendi

## 🚀 Deploy Adımları

### 1. GitHub'a Push Edin

```bash
git add backend/services/productSearchService.js backend/server.js
git commit -m "Add: Product search service - Find product links from internet"
git push origin main
```

### 2. Netlify (Frontend) - Otomatik Deploy

- GitHub'a push edince Netlify otomatik deploy başlatacak
- Frontend güncellenecek

### 3. Backend Deploy (Railway/Render)

Backend'i deploy etmek için:

#### Railway:
1. Railway Dashboard'a gidin
2. Projenizi seçin
3. **"Deploy"** sekmesine gidin
4. GitHub'dan otomatik deploy olacak

#### Render:
1. Render Dashboard'a gidin
2. Servisinizi seçin
3. **"Manual Deploy"** tıklayın
4. Veya GitHub'dan otomatik deploy olacak

## 🔧 Environment Variables

Backend'e deploy ederken şu environment variable'ları ekleyin:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR_VISION_API_KEY
GOOGLE_CUSTOM_SEARCH_API_KEY=YOUR_CUSTOM_SEARCH_API_KEY
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=YOUR_SEARCH_ENGINE_ID
```

## ✅ Kontrol Listesi

- [ ] Değişiklikler commit edildi
- [ ] GitHub'a push edildi
- [ ] Netlify deploy başladı (otomatik)
- [ ] Backend deploy edildi (Railway/Render)
- [ ] Environment variables eklendi
- [ ] Test edildi

## 🎯 Sonuç

Deploy tamamlandıktan sonra:
- ✅ Frontend güncellenecek
- ✅ Backend güncellenecek
- ✅ Ürün linkleri özelliği çalışacak!


