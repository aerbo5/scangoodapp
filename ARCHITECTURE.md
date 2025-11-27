# Scan Good - Architecture Overview

## Tech Stack

### Frontend
- **React Native** (Expo)
- **Firebase** (Authentication, User Data)
- **Axios** (API calls)

### Backend
- **Node.js/Express** (API Server)
- **Firebase** (Authentication verification, User profiles)

## Architecture Decision

**Hibrit Yaklaşım**: Firebase + Node.js Backend

### Firebase Kullanımı
- ✅ **Authentication**: Phone, Google, Apple login
- ✅ **User Profiles**: Kullanıcı bilgileri
- ✅ **Shopping Lists**: Kullanıcının alışveriş listeleri
- ✅ **Favorites**: Favori ürünler ve mağazalar
- ✅ **Real-time Sync**: Cihazlar arası senkronizasyon

### Node.js Backend Kullanımı
- ✅ **Scan Processing**: OCR, barcode, image recognition
- ✅ **Price Comparison**: Market API'leri, web scraping
- ✅ **Product Matching**: ML/AI servisleri
- ✅ **Store Data**: Mağaza bilgileri ve fiyatlar
- ✅ **Business Logic**: Karmaşık hesaplamalar

## Data Flow

### Scan İşlemleri
1. User scans receipt/barcode/product
2. Image sent to Node.js backend
3. Backend processes with ML/AI services
4. Results returned to app
5. Data saved to Firebase (user's shopping list)

### Price Comparison
1. User requests price comparison
2. App sends items to Node.js backend
3. Backend queries store APIs
4. Results compared and returned
5. Best deals saved to Firebase

### User Data
1. All user-specific data stored in Firebase
2. Backend verifies authentication via Firebase Admin
3. Real-time updates sync across devices

## API Endpoints

### Backend (Node.js)
- `POST /api/scan/receipt` - Receipt OCR
- `POST /api/scan/barcode` - Barcode recognition
- `POST /api/scan/product` - Product image recognition
- `POST /api/compare/prices` - Price comparison
- `GET /api/products/search` - Product search
- `GET /api/stores/nearby` - Nearby stores

### Firebase
- Authentication (via Firebase SDK)
- Firestore (user data)
- Storage (images)

## Future Integrations

### ML/AI Services
- Google Cloud Vision API (OCR, image recognition)
- AWS Textract (Receipt scanning)
- Custom ML models (Product matching)

### Store APIs
- Target API
- Walmart API
- Whole Foods API
- Web scraping (fallback)

## Development Setup

### Backend
```bash
cd backend
npm install
npm start  # or npm run dev
```

### Frontend
```bash
npm start
```

## Production Deployment

### Backend
- Deploy to: Heroku, AWS, Google Cloud, or Vercel
- Environment variables in `.env`

### Firebase
- Already cloud-based
- Configure security rules for production




