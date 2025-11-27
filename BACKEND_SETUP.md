# Backend Setup Guide

## ✅ Completed Steps

### 1. Service Architecture
- ✅ **Vision Service**: OCR, barcode detection, image recognition
- ✅ **Product Service**: Product lookup and search
- ✅ **Store Service**: Store location and price comparison

### 2. API Endpoints
- ✅ `/api/scan/receipt` - Receipt OCR
- ✅ `/api/scan/barcode` - Barcode recognition
- ✅ `/api/scan/product` - Product image recognition
- ✅ `/api/compare/prices` - Price comparison
- ✅ `/api/products/search` - Product search
- ✅ `/api/stores/nearby` - Nearby stores

### 3. Google Cloud Vision Integration
- ✅ Service structure ready
- ✅ Fallback to dummy data if not configured
- ⏳ **Next**: Configure Google Cloud Vision API

## 🔧 Configuration Steps

### Step 1: Google Cloud Vision Setup (Optional but Recommended)

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Cloud Vision API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "scan-good-vision")
   - Grant role: "Cloud Vision API User"
   - Click "Done"

4. **Download Key File**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the key file

5. **Configure Backend**
   - Place the key file in `backend/` directory (or secure location)
   - Create `.env` file in `backend/`:
   ```env
   PORT=3000
   GOOGLE_CLOUD_VISION_KEY_FILE=./path/to/your-key-file.json
   ```

### Step 2: Test the API

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Test Health Endpoint**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Test Scan Endpoint** (with dummy data)
   ```bash
   curl -X POST http://localhost:3000/api/scan/receipt \
     -F "image=@path/to/receipt.jpg"
   ```

## 📊 Current Status

### Working Features
- ✅ All API endpoints functional
- ✅ Dummy data fallback system
- ✅ Error handling
- ✅ Service architecture ready

### Pending Configuration
- ⏳ Google Cloud Vision API (optional - works with dummy data)
- ⏳ Real store APIs integration
- ⏳ Database setup (MongoDB/PostgreSQL)
- ⏳ Authentication middleware
- ⏳ Rate limiting

## 🚀 Next Steps

1. **Configure Google Cloud Vision** (for real OCR/barcode/image recognition)
2. **Integrate Store APIs** (Target, Walmart, Whole Foods APIs)
3. **Add Database** (for caching and user data)
4. **Add Authentication** (JWT tokens, Firebase Admin)
5. **Add Rate Limiting** (prevent abuse)
6. **Improve Receipt Parsing** (ML model for better accuracy)

## 📝 Notes

- The backend works with dummy data if Google Cloud Vision is not configured
- All scan endpoints accept image uploads via `multipart/form-data`
- Price comparison uses Haversine formula for distance calculation
- Product search is currently limited to dummy database




