# Netlify Private Repository Çözümü

## 🔒 Private Repository İçin Netlify Ayarları

Private repository için Netlify'ın özel izinlere ihtiyacı var.

## ✅ Çözüm Adımları

### 1. GitHub'da Netlify App İzinlerini Kontrol Edin

1. **GitHub Settings**: https://github.com/settings/installations
2. **"Netlify"** uygulamasını bulun
3. **"Configure"** tıklayın
4. **Repository access** bölümünde:
   - ✅ **"Only select repositories"** seçili olmalı
   - ✅ **`aerbo5/pricecheck-`** repository'si seçili olmalı
   - VEYA **"All repositories"** seçili olabilir
5. **"Save"** tıklayın

### 2. Netlify'da Repository'yi Yeniden Bağlayın

1. **Netlify Dashboard**: https://app.netlify.com
2. Site sayfanıza gidin
3. **Site settings** > **Build & deploy** > **Continuous Deployment**
4. **"Change repository"** veya **"Disconnect repository"** tıklayın
5. **"Link to Git provider"** tıklayın
6. **GitHub** seçin
7. **Yeniden authorize** edin (bu adımda private repo izinleri verilir)
8. Repository seçin: `aerbo5/pricecheck-`
9. Branch: `main`
10. **"Save"** tıklayın

### 3. GitHub OAuth App İzinlerini Kontrol Edin

1. **GitHub Settings**: https://github.com/settings/applications
2. **"Authorized OAuth Apps"** sekmesine gidin
3. **"Netlify"** uygulamasını bulun
4. İzinleri kontrol edin:
   - ✅ **repo** (Full control of private repositories)
   - ✅ **read:org** (Read org and team membership)
5. Eğer izinler eksikse, Netlify'ı yeniden authorize edin

### 4. Repository'yi Public Yapmak (Alternatif)

Eğer repository'yi public yapmak isterseniz:

1. **GitHub Repository**: https://github.com/aerbo5/pricecheck-
2. **Settings** > **General** > **Danger Zone**
3. **"Change repository visibility"** > **"Make public"**
4. Netlify otomatik olarak erişebilir

⚠️ **Not**: Public yapmak istemiyorsanız, yukarıdaki izin ayarlarını yapmanız gerekir.

### 5. Deploy'u Yeniden Deneyin

1. **Netlify Dashboard** > Site sayfanız
2. **Deploys** sekmesine gidin
3. **"Trigger deploy"** > **"Clear cache and deploy site"** tıklayın

## 🔍 Kontrol Listesi

- [ ] GitHub'da Netlify App kurulu mu?
- [ ] Netlify App'e private repo erişim izni var mı?
- [ ] Repository Netlify'da doğru bağlı mı?
- [ ] GitHub OAuth izinleri tam mı?
- [ ] Deploy yeniden denendi mi?

## 🚀 En Hızlı Çözüm

**Adım 1**: GitHub'da Netlify App izinlerini kontrol edin
- https://github.com/settings/installations
- Netlify > Configure > Repository access > `aerbo5/pricecheck-` seçili olmalı

**Adım 2**: Netlify'da repository'yi yeniden bağlayın
- Site settings > Build & deploy > Change repository
- GitHub'ı yeniden authorize edin
- Repository'yi seçin

**Adım 3**: Deploy'u yeniden deneyin
- Clear cache and deploy site

Bu adımlar private repository sorununu çözecektir! 🎯


