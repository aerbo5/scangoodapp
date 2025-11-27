# Firebase Setup Guide

## 1. Firebase Console'da Proje Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. "Add project" butonuna tıklayın
3. Proje adını girin (örn: "scan-good-app")
4. Google Analytics'i etkinleştirin (opsiyonel)
5. Projeyi oluşturun

## 2. Authentication Ayarları

1. Firebase Console'da "Authentication" sekmesine gidin
2. "Get started" butonuna tıklayın
3. "Sign-in method" sekmesine gidin
4. "Phone" provider'ını etkinleştirin
5. Test telefon numaraları ekleyebilirsiniz (development için)

## 3. Firestore Database Ayarları

1. "Firestore Database" sekmesine gidin
2. "Create database" butonuna tıklayın
3. "Start in test mode" seçeneğini seçin (development için)
4. Location seçin (örn: us-central1)
5. Database'i oluşturun

## 4. Storage Ayarları

1. "Storage" sekmesine gidin
2. "Get started" butonuna tıklayın
3. "Start in test mode" seçeneğini seçin
4. Location seçin
5. Storage'ı oluşturun

## 5. Firebase Config Bilgilerini Alma

1. Firebase Console'da proje ayarlarına gidin (⚙️ ikonu)
2. "Project settings" sekmesine gidin
3. Aşağı kaydırın ve "Your apps" bölümüne gidin
4. Web uygulaması ekleyin (</> ikonu)
5. App nickname girin (örn: "Scan Good Web")
6. Config bilgilerini kopyalayın

## 6. Config Dosyasını Güncelleme

`src/config/firebase.js` dosyasındaki `firebaseConfig` objesini Firebase Console'dan aldığınız bilgilerle güncelleyin:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 7. Firestore Security Rules (Production için)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /shoppingList/{itemId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /favorites/{favoriteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Products are readable by all authenticated users
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
    
    // Stores are readable by all authenticated users
    match /stores/{storeId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
  }
}
```

## 8. Storage Security Rules (Production için)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 && // 5MB limit
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 9. Test Etme

1. Uygulamayı çalıştırın: `npm start`
2. Login ekranında telefon numarası girin
3. Verification code ekranında kodu girin
4. Firebase Console'da Authentication ve Firestore'da verilerin oluştuğunu kontrol edin

## Notlar

- Development için test mode kullanabilirsiniz
- Production'a geçmeden önce Security Rules'ı güncelleyin
- Phone authentication için Firebase'in SMS gönderme limitleri vardır
- Test telefon numaraları ekleyerek development sırasında SMS maliyetinden kaçınabilirsiniz




