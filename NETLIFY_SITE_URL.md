# Netlify Site URL'ini Bulma

## 🌐 Netlify Dashboard'dan Site URL'ini Bulma

### Adım 1: Netlify Dashboard'a Gidin
1. https://app.netlify.com adresine gidin
2. Giriş yapın (ulikmeapp@gmail.com)

### Adım 2: Site URL'ini Bulun
1. Dashboard'da siteleriniz listelenir
2. Site adının altında URL görünür:
   - Örnek: `https://random-name-12345.netlify.app`
   - Veya custom domain varsa: `https://yourdomain.com`

### Adım 3: Site Yoksa Oluşturun
Eğer henüz site oluşturmadıysanız:

1. **"Add new site"** butonuna tıklayın
2. **"Import an existing project"** seçin
3. **GitHub** seçin
4. Repository'nizi seçin: `aerbo5/pricecheck-`
5. Build settings:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
6. **"Deploy site"** tıklayın
7. Deploy tamamlandığında URL görünecek!

## 🔗 Site URL Formatı

Netlify site URL'leri şu formatta olur:
```
https://[random-name]-[random-numbers].netlify.app
```

Örnek:
```
https://pricecheck-app-abc123.netlify.app
```

## 📱 Site URL'ini Nerede Bulabilirsiniz?

1. **Netlify Dashboard**: https://app.netlify.com
   - Site listesinde görünür
   - Site adına tıklayınca detay sayfasında görünür

2. **Deploy Logs**: 
   - Site > Deploys > Son deploy
   - Deploy tamamlandığında URL gösterilir

3. **Site Settings**:
   - Site > Site settings > General
   - "Site details" bölümünde görünür

## 🎯 Hızlı Erişim

Netlify Dashboard: https://app.netlify.com

Site URL'inizi bulduktan sonra:
- Siteyi test edin
- Backend URL'ini environment variables'a ekleyin
- Custom domain ekleyebilirsiniz (opsiyonel)

