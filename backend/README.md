# Scan Good Backend API

Node.js/Express backend for Scan Good mobile application.

## Features

- **Scan Receipt**: OCR processing for receipt scanning
- **Scan Barcode**: Barcode recognition and product lookup
- **Scan Product**: Image recognition for product identification
- **Price Comparison**: Compare prices across multiple stores
- **Store Search**: Find nearby stores based on location

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your configuration:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Scan Endpoints
- `POST /api/scan/receipt` - Scan receipt (OCR)
- `POST /api/scan/barcode` - Scan barcode
- `POST /api/scan/product` - Scan product image

### Comparison
- `POST /api/compare/prices` - Compare prices across stores

### Products
- `GET /api/products/search?q=query` - Search products

### Stores
- `GET /api/stores/nearby?lat=25.7617&lng=-80.1918&radius=10` - Find nearby stores

## Services

### Vision Service (`services/visionService.js`)
- **OCR**: Extracts text from receipt images using Google Cloud Vision API
- **Barcode Detection**: Recognizes barcodes from images
- **Label Detection**: Identifies products from images using label detection
- **Receipt Parsing**: Parses extracted text into structured items

### Product Service (`services/productService.js`)
- **Barcode Lookup**: Finds products by barcode
- **Label Matching**: Matches products based on image recognition labels
- **Product Search**: Searches products by name

### Store Service (`services/storeService.js`)
- **Nearby Stores**: Finds stores near a location
- **Price Comparison**: Compares prices across multiple stores
- **Distance Calculation**: Calculates distances using Haversine formula

## Configuration

Create a `.env` file in the backend directory:

```env
PORT=3000

# Google Cloud Vision API (Optional)
# To enable OCR, barcode detection, and image recognition:
# 1. Create a Google Cloud project
# 2. Enable Cloud Vision API
# 3. Create a service account and download the key file
# 4. Set the path to the key file below, OR use API key
GOOGLE_CLOUD_VISION_KEY_FILE=path/to/service-account-key.json
# OR
GOOGLE_CLOUD_VISION_API_KEY=your-api-key-here
```

**Note**: If Google Cloud Vision is not configured, the API will use dummy data as fallback.

## TODO

- [x] Integrate OCR service structure (Google Cloud Vision)
- [x] Integrate barcode recognition structure
- [x] Integrate image recognition structure
- [ ] Connect to real store APIs for price data
- [ ] Add authentication middleware
- [ ] Add rate limiting
- [ ] Add error logging
- [ ] Add database (MongoDB/PostgreSQL) for caching
- [ ] Improve receipt parsing with ML model

