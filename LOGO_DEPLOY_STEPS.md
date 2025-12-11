# 🎨 Logo Değişikliği Deploy Rehberi

## ✅ Logo Değiştirildi!

Logo dosyası: `src/assets/image1.png`

Logo kullanılan yerler:
- Header (üst menü)
- Home Screen (ana sayfa)
- Drawer Menu (yan menü)
- Login Screen (giriş ekranı)

## 🚀 Deploy Adımları

### Seçenek 1: Otomatik Deploy (GitHub Push)

Eğer GitHub'a bağlıysanız:

1. **Değişiklikleri commit edin:**
   ```bash
   git add src/assets/image1.png
   git commit -m "Update logo image"
   git push
   ```

2. **Netlify otomatik deploy edecek:**
   - Netlify GitHub'a bağlıysa otomatik deploy başlar
   - 5-10 dakika bekleyin

### Seçenek 2: Manuel Deploy (Netlify Dashboard)

1. **Netlify Dashboard**: https://app.netlify.com
2. Site'inize tıklayın
3. **Deploys** sekmesine gidin
4. **"Trigger deploy"** butonuna tıklayın
5. **"Deploy site"** seçin
6. ⏳ 5-10 dakika bekleyin

## ✅ Kontrol

Deploy tamamlandıktan sonra:

1. Site URL'inizi açın
2. **Hard refresh yapın** (Ctrl+Shift+R veya Ctrl+F5)
3. Logo'nun güncellendiğini kontrol edin:
   - Header'da logo görünüyor mu?
   - Home screen'de logo görünüyor mu?
   - Login screen'de logo görünüyor mu?

## 🐛 Sorun Giderme

### Logo görünmüyor?

1. **Browser cache'i temizleyin** (Ctrl+Shift+R)
2. **Deploy başarılı mı kontrol edin** (Netlify Dashboard)
3. **Logo dosyası doğru mu?** (`src/assets/image1.png`)

### Deploy başarısız?

1. **Deploy loglarını kontrol edin**
2. **Build hatası var mı?**
3. **Logo dosyası çok büyük mü?** (optimize edin)

## 📋 Kontrol Listesi

- [ ] Logo dosyası değiştirildi (`src/assets/image1.png`)
- [ ] Değişiklikler commit edildi (GitHub)
- [ ] GitHub'a push edildi
- [ ] Netlify otomatik deploy başladı
- [ ] Deploy başarılı
- [ ] Site'de logo güncellendi
- [ ] Tüm ekranlarda logo görünüyor

## 🎯 Sonuç

Deploy tamamlandıktan sonra:
- ✅ Yeni logo tüm ekranlarda görünecek
- ✅ Header'da logo güncellenecek
- ✅ Home screen'de logo güncellenecek
- ✅ Login screen'de logo güncellenecek



