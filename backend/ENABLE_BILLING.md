# Google Cloud Billing Etkinleştirme

## 🔍 Sorun

Backend loglarında şu hatayı görüyorsunuz:
```
This API method requires billing to be enabled.
PERMISSION_DENIED (403)
```

Google Cloud Vision API kullanmak için billing hesabı bağlı olması gerekir.

## ✅ Çözüm: Billing'i Etkinleştirin

### ⚠️ Önemli Not

**Google Cloud Vision API ücretsiz bir kota ile gelir:**
- İlk 1,000 istek/ay **ÜCRETSİZ**
- Sonrası için ücretlendirme yapılır
- Billing hesabı bağlı olması gerekir ama **otomatik ücretlendirme yapılmaz**
- Sadece limit aşıldığında ücret alınır

### Adım 1: Billing Hesabı Oluşturun (Eğer Yoksa)

1. **Google Cloud Console**'a gidin: https://console.cloud.google.com/
2. Projenizi seçin (Project ID: `693337154262`)
3. Sol menüden **"Billing"** seçin
4. **"Link a billing account"** butonuna tıklayın

### Adım 2: Billing Hesabını Bağlayın

**Yöntem 1: Direkt Link (Hızlı)**
1. Bu linke tıklayın: https://console.developers.google.com/billing/enable?project=693337154262
2. Billing hesabınızı seçin veya yeni bir tane oluşturun
3. **"Set account"** butonuna tıklayın

**Yöntem 2: Manuel (Adım Adım)**
1. Google Cloud Console'da **"Billing"** bölümüne gidin
2. **"Link a billing account"** butonuna tıklayın
3. Mevcut bir billing hesabınız varsa seçin
4. Yoksa **"Create billing account"** ile yeni bir tane oluşturun

### Adım 3: Billing Hesabı Oluşturma (Yeni Hesap)

1. **"Create billing account"** butonuna tıklayın
2. Hesap adı girin (örn: "Scan Good Billing")
3. Ülke seçin
4. Ödeme yöntemi ekleyin (kredi kartı)
5. **"Submit and enable billing"** butonuna tıklayın

### Adım 4: Bekleyin

Billing etkinleştirildikten sonra:
- Genellikle **1-2 dakika** içinde aktif olur
- Bazen **5-10 dakika** sürebilir

### Adım 5: Backend'i Yeniden Başlatın

1. Backend'i durdurun (Ctrl+C)
2. Tekrar başlatın:
   ```bash
   cd backend
   npm start
   ```

### Adım 6: Test Edin

1. Telefonda kamera ile bir resim çekin
2. Backend console'unda şunu görmelisiniz:
   ```
   ✅ Vision API returned X labels: ...
   ```

## 💰 Ücretlendirme Bilgisi

### Ücretsiz Kota (Her Ay)

- **1,000 istek/ay** ücretsiz
- Bu çoğu test ve küçük projeler için yeterlidir

### Ücretlendirme (Limit Aşıldığında)

- 1,001+ istek için: **$1.50 per 1,000 istek**
- Örnek: 2,000 istek = $1.50

### Billing Limit Ayarlama

1. Google Cloud Console'da **"Billing" > "Budgets & alerts"** bölümüne gidin
2. **"Create budget"** ile limit belirleyin
3. Örnek: Aylık $5 limit koyabilirsiniz
4. Limit aşıldığında API otomatik kapanır

## ✅ Başarılı Durum

Billing etkinleştirildikten sonra backend loglarında şunu göreceksiniz:
```
📸 Processing image, size: 281727 bytes
🔍 Calling Google Vision API for label detection...
✅ Vision API returned 5 labels: Water, Bottle, Spring Water, Product, Beverage
✅ Labels detected: Water, Bottle, Spring Water, Product, Beverage
```

## 🐛 Hala Çalışmıyorsa

1. **Billing aktif mi?** → Google Cloud Console'da kontrol edin
2. **Bekleme süresi** → Birkaç dakika bekleyin
3. **Proje doğru mu?** → Project ID'nin doğru olduğundan emin olun

## 📝 Notlar

- Billing hesabı bağlı olması gerekir ama **otomatik ücretlendirme yapılmaz**
- İlk 1,000 istek/ay **tamamen ücretsiz**
- Limit aşıldığında sadece o zaman ücret alınır
- Billing limiti ayarlayarak koruma sağlayabilirsiniz

## 🔒 Güvenlik İçin

1. **Billing limiti ayarlayın** → Aylık limit belirleyin
2. **Alarm ayarlayın** → Limit yaklaştığında email alın
3. **API kullanımını izleyin** → "APIs & Services" > "Dashboard" bölümünden

