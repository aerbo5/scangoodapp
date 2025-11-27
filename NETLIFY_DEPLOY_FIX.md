# Netlify Deploy Hatası - Çözüm

## 🔴 Hata: "Failed to prepare repo"

Bu hata genellikle Netlify'ın GitHub repo'nuza erişim izni olmadığında oluşur.

## ✅ Çözüm Adımları

### 1. Netlify'da Repository'yi Yeniden Bağlayın

1. **Netlify Dashboard**: https://app.netlify.com
2. Site sayfanıza gidin
3. **Site settings** > **Build & deploy** > **Continuous Deployment**
4. **"Link to Git provider"** veya **"Change repository"** tıklayın
5. GitHub'ı seçin ve **yeniden authorize** edin
6. Repository'yi seçin: `aerbo5/pricecheck-`
7. Branch'i seçin: `main` (veya `master`)

### 2. GitHub OAuth İzinlerini Kontrol Edin

1. **GitHub Settings**: https://github.com/settings/applications
2. **Authorized OAuth Apps** sekmesine gidin
3. **Netlify**'ı bulun
4. İzinleri kontrol edin:
   - ✅ Repository access (repo erişimi)
   - ✅ Read repository contents
   - ✅ Read repository metadata

### 3. Netlify GitHub App İzinlerini Kontrol Edin

1. **GitHub Settings**: https://github.com/settings/installations
2. **Netlify** uygulamasını bulun
3. **Configure** tıklayın
4. Repository erişimini kontrol edin:
   - ✅ `aerbo5/pricecheck-` seçili olmalı
   - Veya **"All repositories"** seçili olmalı

### 4. Repository Erişimini Yeniden Ayarlayın

Eğer repo private ise:

1. **GitHub Repository**: https://github.com/aerbo5/pricecheck-
2. **Settings** > **Collaborators & teams**
3. Netlify'ın erişimi olduğundan emin olun

### 5. Deploy'u Yeniden Deneyin

1. **Netlify Dashboard** > Site sayfanız
2. **Deploys** sekmesine gidin
3. **"Trigger deploy"** > **"Clear cache and deploy site"** tıklayın
4. Deploy'u tekrar başlatın

## 🔍 Alternatif Çözüm: Manuel Deploy

Eğer hala çalışmazsa, Netlify CLI ile manuel deploy yapabilirsiniz:

```bash
# Netlify'a login olun (yeni hesabınızla)
netlify login

# Site oluşturun ve link edin
netlify init

# Deploy edin
netlify deploy --prod
```

## 📝 Kontrol Listesi

- [ ] Netlify GitHub'a bağlı mı?
- [ ] Repository doğru mu? (`aerbo5/pricecheck-`)
- [ ] Branch doğru mu? (`main`)
- [ ] GitHub OAuth izinleri var mı?
- [ ] Netlify GitHub App izinleri var mı?
- [ ] Repository private ise erişim var mı?

## 🚀 Hızlı Çözüm

**En hızlı çözüm:**

1. Netlify Dashboard > Site settings
2. **Build & deploy** > **Continuous Deployment**
3. **"Disconnect repository"** tıklayın
4. **"Link to Git provider"** tıklayın
5. GitHub'ı seçin ve **yeniden authorize** edin
6. Repository'yi seçin: `aerbo5/pricecheck-`
7. Branch: `main`
8. **"Save"** tıklayın
9. **"Trigger deploy"** > **"Clear cache and deploy site"**

Bu genellikle sorunu çözer! 🎯


