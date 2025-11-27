# Ürün Linkleri Özelliği - GitHub'a Ekleme

## ✅ Yapılan Değişiklikler

1. **Yeni Dosya**: `backend/services/productSearchService.js`
2. **Güncellenen Dosya**: `backend/server.js`

## 🚀 GitHub'a Ekleme - Adım Adım

### 1. Yeni Dosya: productSearchService.js

1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. **`backend/services/`** klasörüne gidin
3. **"Add file" > "Create new file"** tıklayın
4. Dosya adı: `productSearchService.js`
5. İçeriği yapıştırın (dosyayı okuyun: `backend/services/productSearchService.js`)
6. **"Commit new file"** tıklayın

### 2. Güncellenen Dosya: server.js

1. **`backend/server.js`** dosyasını açın
2. **✏️ Edit** butonuna tıklayın
3. **11. satırdan sonra** şunu ekleyin:

```javascript
const productSearchService = require('./services/productSearchService');
```

4. **152-222. satırları** bulun ve `/api/scan/product` endpoint'ini güncelleyin (detaylar için `backend/server.js` dosyasına bakın)

5. **"Commit changes"** tıklayın

## 📝 Alternatif: GitHub Web'den Dosya İçeriğini Kopyalama

Local'deki dosyaları okuyup GitHub'a yapıştırabilirsiniz:

1. `backend/services/productSearchService.js` dosyasını açın
2. Tüm içeriği kopyalayın
3. GitHub'da yeni dosya oluşturup yapıştırın

## ✅ Sonuç

GitHub'a eklendikten sonra:
- ✅ Netlify otomatik deploy başlayacak (frontend)
- ✅ Backend'i Railway/Render'a deploy edebilirsiniz
- ✅ Ürün linkleri özelliği çalışacak!

## 🎯 Hızlı Yol

En kolay yol: Local'deki dosyaları okuyup GitHub web arayüzünden oluşturmak!


