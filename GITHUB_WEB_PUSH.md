# GitHub Web Arayüzünden Push - Adım Adım

## 🎯 Şu Anki Durum

- ✅ Local'de `netlify.toml` ve `package.json` güncellendi
- ✅ Commit edildi
- ❌ Push başarısız (unrelated histories hatası)
- ✅ **Çözüm: GitHub web arayüzünden güncelleme**

## 📝 Adım Adım: GitHub Web'den Güncelleme

### 1. netlify.toml Dosyasını Güncelle

1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. **`netlify.toml`** dosyasını bulun ve açın
3. **✏️ Edit** (kalem ikonu) butonuna tıklayın
4. **4. satırı** şu şekilde değiştirin:
   ```toml
   command = "npm install && npx expo export --platform web --output-dir web-build"
   ```
5. Sayfanın altında **"Commit changes"** bölümüne gidin
6. Commit message: `Fix: Expo export komutu Metro bundler için düzeltildi`
7. **"Commit changes"** butonuna tıklayın

### 2. package.json Dosyasını Güncelle

1. **`package.json`** dosyasını açın
2. **✏️ Edit** butonuna tıklayın
3. **10-11. satırları** şu şekilde değiştirin:
   ```json
   "build:web": "expo export --platform web --output-dir web-build",
   "build": "expo export --platform web --output-dir web-build"
   ```
4. Commit message: `Fix: Build script Metro bundler için güncellendi`
5. **"Commit changes"** butonuna tıklayın

## ✅ Sonuç

- ✅ GitHub'da dosyalar güncellendi
- ✅ Netlify otomatik deploy başlayacak
- ✅ Build başarılı olmalı!

## 🚀 Netlify Deploy Kontrolü

1. Netlify Dashboard: https://app.netlify.com
2. Site sayfanıza gidin
3. **"Deploys"** sekmesine gidin
4. Yeni deploy başlamış olmalı
5. Build başarılı olmalı! 🎉

## 📚 Öğrendikleriniz

### Git Push Komutları (Gelecek İçin)

```bash
# 1. Durumu kontrol et
git status

# 2. Dosyaları ekle
git add dosya-adi.js

# 3. Commit et
git commit -m "Mesajınız"

# 4. Push et
git push origin main

# Eğer hata alırsanız:
git pull origin main
git push origin main
```

### GitHub Web Arayüzü (Daha Kolay)

- ✅ Edit butonuna tıklayın
- ✅ Değişiklikleri yapın
- ✅ Commit edin
- ✅ Otomatik push olur!

## 💡 İpucu

GitHub web arayüzü küçük değişiklikler için daha kolay ve hızlıdır. Büyük değişiklikler için terminal kullanın.


