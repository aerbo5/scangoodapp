# 🔧 Render.com Root Directory Hatası - Düzeltme

## ❌ Hata

```
Error: Cannot find module '/opt/render/project/src/backend/node_modules/expo/AppEntry.js'
```

## 🔍 Sorun

Render.com yanlış `package.json` dosyasını kullanıyor (root'taki frontend `package.json`'ı yerine `backend/package.json`'ı).

## ✅ Çözüm

### Yöntem 1: Render.com Dashboard'dan (Önerilen)

1. Render Dashboard → **scangood-backend** service'ine git
2. **Settings** sekmesine tıkla
3. **Root Directory** alanını bul
4. Değeri şu şekilde ayarla: **`backend`**
5. **Save Changes** tıkla
6. **Manual Deploy** → **Deploy latest commit**

### Yöntem 2: render.yaml ile (Otomatik)

`render.yaml` dosyası güncellendi. Eğer Render.com `render.yaml`'ı kullanıyorsa:

1. GitHub'a push yap:
   ```bash
   git add render.yaml
   git commit -m "Fix Render.com root directory"
   git push
   ```

2. Render.com otomatik deploy yapacak

### Yöntem 3: Manuel Ayarlar (Kesin Çözüm)

Render Dashboard → Service Settings:

- **Name**: `scangood-backend`
- **Root Directory**: `backend` ✅ (ÖNEMLİ!)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: `Yes`

**NOT**: Root Directory **mutlaka** `backend` olmalı (boş bırakmayın!)

---

## 📋 Kontrol Listesi

- [ ] Root Directory: `backend` ayarlandı
- [ ] Build Command: `npm install` (veya `cd backend && npm install`)
- [ ] Start Command: `npm start` (veya `cd backend && npm start`)
- [ ] Environment: `Node`
- [ ] Deploy yapıldı
- [ ] Logs kontrol edildi

---

## 🔍 Log Kontrolü

Deploy sonrası **Logs** sekmesinde şunları görmelisiniz:

```
✅ npm install başarılı
✅ node server.js çalışıyor
✅ Scan Good Backend API running on http://0.0.0.0:10000
```

Eğer hala `expo` hatası görüyorsanız, Root Directory ayarı yanlış demektir.

---

## ⚠️ Önemli Notlar

1. **Root Directory** Render.com'da **mutlaka** ayarlanmalı
2. Boş bırakılırsa, root'taki `package.json` kullanılır (frontend)
3. `backend` yazıldığında, `backend/package.json` kullanılır (backend)

---

## 🚀 Test

Deploy sonrası test edin:

```bash
curl https://scangood-backend.onrender.com/api/health
```

Beklenen yanıt:
```json
{"status":"ok","message":"Scan Good API is running"}
```

