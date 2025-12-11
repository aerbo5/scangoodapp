# 🚨 Vercel Environment Variable Silme - Acil!

## ❌ Sorun

Frontend hala eski backend URL'ini kullanıyor:
```
baseURL: 'https://eski-backend-url.com/api'
```

**Neden?** Vercel'de `REACT_APP_API_URL` environment variable'ı var ve eski Railway URL'ini gösteriyor.

Kod öncelik sırası:
1. ✅ `REACT_APP_API_URL` varsa → Onu kullan (ŞU AN BURADAYIZ!)
2. Vercel algılanırsa → Render.com kullan
3. Fallback → Render.com kullan

## ✅ ÇÖZÜM: Vercel'de Environment Variable'ı SİLİN

### Adım 1: Vercel Dashboard'a Gidin

1. **Vercel Dashboard**: https://vercel.com
2. Projenize tıklayın
3. **Settings** → **Environment Variables** sekmesine gidin

### Adım 2: REACT_APP_API_URL'i Bulun ve SİLİN

1. `REACT_APP_API_URL` değişkenini bulun
2. Sağ taraftaki **"..."** menüsüne tıklayın
3. **"Delete"** seçeneğini seçin
4. Onaylayın

**NEDEN SİLİYORUZ?**
- Kod zaten Vercel'i otomatik algılıyor
- Vercel algılandığında Render.com URL'ini kullanacak
- Environment variable gereksiz ve eski URL'i gösteriyor

### Adım 3: Redeploy YAPIN (ÇOK ÖNEMLİ!)

Environment variable sildikten sonra **MUTLAKA redeploy yapın**:

1. **Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. ⏳ 2-3 dakika bekleyin

**⚠️ ÖNEMLİ:** Environment variable silindikten sonra redeploy yapmazsanız, eski build hala eski URL'i kullanır!

---

## ✅ Alternatif: Environment Variable'ı Güncelleyin

Eğer silmek istemiyorsanız, Render.com URL'ine güncelleyin:

1. `REACT_APP_API_URL` → **Edit**
2. Yeni değer: `https://scangood-backend.onrender.com/api`
3. **Save**
4. **Redeploy** yapın

---

## 🧪 Test

Redeploy'dan sonra:

1. Tarayıcıda **Hard Refresh** yapın (`Ctrl + Shift + R`)
2. **F12** → **Console** sekmesine gidin
3. Ürün resmini çekin
4. Console'da şunu görmelisiniz:
   ```
   🌐 Detected Vercel, using Render backend URL
   🌐 API Base URL: https://scangood-backend.onrender.com/api
   ```

**Eğer hala Railway URL'i görüyorsanız:**
- Browser cache'i temizleyin
- Incognito mode'da test edin
- Redeploy tamamlandı mı kontrol edin

---

## 📝 Özet

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ `REACT_APP_API_URL` → Delete
3. ✅ Deployments → Redeploy
4. ✅ Hard Refresh (`Ctrl + Shift + R`)
5. ✅ Test et

**En önemli adım: Environment variable'ı silin ve redeploy yapın!**

