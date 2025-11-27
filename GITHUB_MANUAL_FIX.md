# GitHub'da package.json'ı Manuel Güncelleme

## 🔧 Sorun
GitHub'da `package.json` dosyasında `build:web` script'i yok. Netlify deploy için gerekli.

## ✅ Çözüm: GitHub Web Arayüzünden Güncelleme

### Adım 1: GitHub Repository'ye Gidin
1. https://github.com/aerbo5/pricecheck- adresine gidin
2. `package.json` dosyasını bulun
3. **✏️ Edit** (kalem ikonu) butonuna tıklayın

### Adım 2: Script'i Ekleyin
`package.json` dosyasında `scripts` bölümünü bulun ve şu şekilde güncelleyin:

**Mevcut:**
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

**Güncellenmiş:**
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "build:web": "expo export:web",
  "build": "expo export:web"
}
```

### Adım 3: Commit Edin
1. Sayfanın altında **"Commit changes"** bölümüne gidin
2. Commit message: `Add build:web script for Netlify deploy`
3. **"Commit changes"** butonuna tıklayın

### Adım 4: Netlify Deploy'u Tekrar Deneyin
1. Netlify Dashboard'a gidin
2. **Deploys** sekmesine gidin
3. **"Trigger deploy"** > **"Clear cache and deploy site"** tıklayın

## 📝 Alternatif: netlify.toml'u Güncelleme

Eğer `package.json`'ı güncelleyemiyorsanız, `netlify.toml`'daki build command'ı değiştirebilirsiniz:

**netlify.toml:**
```toml
[build]
  command = "npx expo export:web"
  publish = "web-build"
```

Bu şekilde `package.json`'a script eklemeden direkt komutu çalıştırabilirsiniz.

## 🎯 Hızlı Çözüm

**En kolay yol:**
1. GitHub'da `package.json`'ı açın
2. Edit butonuna tıklayın
3. `"build:web": "expo export:web",` satırını `"web"` satırından sonra ekleyin
4. Commit edin
5. Netlify deploy otomatik başlayacak!


