# Netlify Build Hatası - Hızlı Çözüm

## 🔍 Sorun
Build script başarısız oluyor (exit code: 2). Gerçek hata mesajı log'larda görünmüyor.

## ✅ Hızlı Çözüm: netlify.toml Güncelle

### GitHub'da netlify.toml'u Güncelleyin

1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. **`netlify.toml`** dosyasını açın
3. **✏️ Edit** butonuna tıklayın
4. **4. satırı** şu şekilde değiştirin:

**Önceki:**
```toml
command = "npm install && npx expo export --platform web --output-dir web-build"
```

**Yeni:**
```toml
command = "npm ci && npx expo export --platform web --output-dir web-build"
```

5. **Commit changes** yapın

## 🔧 Alternatif Çözümler

### Çözüm 1: Expo CLI'yi Global Yükle

Eğer hala hata alırsanız, `netlify.toml`'da şunu kullanın:

```toml
command = "npm install -g @expo/cli && npm ci && npx expo export --platform web --output-dir web-build"
```

### Çözüm 2: package.json Script Kullan

`netlify.toml`'da:
```toml
command = "npm ci && npm run build:web"
```

Ve `package.json`'da script'in olduğundan emin olun:
```json
"build:web": "expo export --platform web --output-dir web-build"
```

## 📝 Tam Log'u Alın

Eğer hala hata alırsanız:

1. Netlify Dashboard: https://app.netlify.com
2. Site sayfanıza gidin
3. **"Deploys"** sekmesine gidin
4. Başarısız deploy'a tıklayın
5. **"View deploy log"** tıklayın
6. **13. satırdan sonraki tüm log'ları** kopyalayın
7. Bana gönderin, tam çözümü sağlayayım!

## ✅ Kontrol Listesi

- [ ] `netlify.toml` güncellendi (`npm ci` kullanılıyor)
- [ ] Root `package.json` var ve `build:web` script'i var
- [ ] GitHub'da commit edildi
- [ ] Netlify deploy tekrar denendi

## 🎯 Beklenen Sonuç

- ✅ `npm ci` dependencies'i temiz yükler
- ✅ Build komutu çalışır
- ✅ `web-build` klasörü oluşturulur
- ✅ Deploy başarılı olur!

