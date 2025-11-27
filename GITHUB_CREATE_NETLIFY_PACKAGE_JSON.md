# GitHub'da netlify/functions/package.json Oluşturma

## 🎯 Sorun
`netlify/functions/package.json` dosyası GitHub'da kaybolmuş. Yeniden oluşturmamız gerekiyor.

## ✅ Adım Adım: GitHub'da netlify/functions/package.json Oluştur

### 1. GitHub Repository'ye Gidin
1. **GitHub'a gidin**: https://github.com/aerbo5/pricecheck-
2. **`netlify`** klasörüne gidin
3. **`functions`** klasörüne gidin
4. **"Add file"** > **"Create new file"** tıklayın

### 2. Dosya Adını Girin
- Dosya adı: `package.json`
- Dosya yolu: `netlify/functions/package.json` olmalı

### 3. İçeriği Yapıştırın
Aşağıdaki içeriği tamamen kopyalayıp yapıştırın:

```json
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "description": "Netlify Functions for Scan Good API proxy",
  "main": "api.js",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

### 4. Commit Edin
1. Sayfanın altında **"Commit new file"** bölümüne gidin
2. Commit message: `Add: netlify/functions/package.json`
3. **"Commit new file"** butonuna tıklayın

## ✅ Sonuç

- ✅ `netlify/functions/package.json` GitHub'da oluşturuldu
- ✅ Netlify Functions çalışacak
- ✅ API proxy çalışacak

## 📝 Dosya Yapısı

```
pricecheck-/
├── package.json                    ← Root (Ana dosya)
├── netlify.toml                    ← Netlify config
└── netlify/
    └── functions/
        ├── package.json            ← BU DOSYA (Netlify Functions için)
        └── api.js                  ← API proxy dosyası
```

## 🎯 Önemli Notlar

- **Root `package.json`**: Expo projesi için (build script'leri var)
- **`netlify/functions/package.json`**: Netlify Functions için (sadece axios dependency)
- İki dosya da farklı amaçlar için, ikisi de gerekli!

## ✅ Kontrol Listesi

- [ ] Root `package.json` var mı? (Ana dizinde)
- [ ] `netlify/functions/package.json` var mı? (Netlify Functions klasöründe)
- [ ] `netlify.toml` güncellendi mi?


