# Firebase Kullanıcı Bilgilerini Görüntüleme

## Firebase Console'dan Kullanıcı Bilgilerini Görme

### 1. Firebase Console'a Giriş Yapın
1. https://console.firebase.google.com/ adresine gidin
2. Projenizi seçin (veya yeni proje oluşturun)

### 2. Authentication Sekmesinden Kullanıcıları Görüntüleme
1. Sol menüden **"Authentication"** sekmesine tıklayın
2. **"Users"** sekmesine gidin
3. Burada tüm kayıtlı kullanıcıların listesini görebilirsiniz:
   - **Email** adresi (eğer email ile giriş yapıldıysa)
   - **Phone** numarası (eğer telefon ile giriş yapıldıysa)
   - **User UID** (benzersiz kullanıcı ID'si)
   - **Provider** (giriş yöntemi: email, phone, google, vs.)
   - **Created** (hesap oluşturulma tarihi)
   - **Last Sign In** (son giriş tarihi)

### 3. Belirli Bir Kullanıcının Detaylarını Görme
1. Kullanıcı listesinden bir kullanıcıya tıklayın
2. Detay sayfasında şunları görebilirsiniz:
   - Email adresi
   - Telefon numarası
   - Display name
   - Photo URL
   - Email verified durumu
   - Custom claims (varsa)

## Backend'den Kullanıcı Bilgilerini Görme

Backend'de Firebase Admin SDK kullanarak kullanıcı bilgilerini görüntülemek için bir endpoint ekleyebiliriz.

### Mevcut Durum
- `firebase-admin` paketi yüklü (`backend/package.json`)
- Ancak henüz backend'de Firebase Admin yapılandırılmamış

### Backend'e Kullanıcı Listesi Endpoint'i Eklemek İster misiniz?

Eğer isterseniz, backend'e şu endpoint'leri ekleyebilirim:
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:uid` - Belirli bir kullanıcının bilgilerini getir
- `GET /api/users/me` - Mevcut kullanıcının bilgilerini getir

## Hızlı Kontrol

Firebase Console'da kullanıcılarınızı görmek için:
1. https://console.firebase.google.com/
2. Projenizi seçin
3. Authentication > Users

## Notlar

- **Email ile giriş:** Eğer kullanıcı email ile giriş yaptıysa, email adresi görünecektir
- **Telefon ile giriş:** Eğer telefon ile giriş yaptıysa, sadece telefon numarası görünecektir (email olmayabilir)
- **Google ile giriş:** Google hesabındaki email adresi görünecektir
- **Apple ile giriş:** Apple ID'deki email adresi görünecektir (veya gizli email)

## Güvenlik

⚠️ **Önemli:** Kullanıcı bilgileri hassas verilerdir. Production'da:
- Backend endpoint'lerine authentication ekleyin
- Sadece admin kullanıcıların kullanıcı listesini görmesine izin verin
- Rate limiting ekleyin


