# Unified Scan Plan: Barcode + Product Scan

## Özet
Barcode ve Product scan'i birleştirip otomatik algılama yapacağız.

## Yeni Yapı

### Frontend
- **Scan Receipt** → Ayrı buton (değişmez)
- **Scan Product** → Barcode + Product birleşik (otomatik algılama)

### Backend
- `/api/scan/product` endpoint'i güncellenecek:
  1. Önce barcode detection yap
  2. Barcode varsa → Barcode lookup
  3. Barcode yoksa → Vision API label detection
  4. Her ikisi de aynı response formatını döndürür

## Avantajlar
✅ Kullanıcı deneyimi daha basit (2 seçenek yerine 1)
✅ Otomatik algılama (kullanıcı barcode/product seçmek zorunda değil)
✅ Daha akıllı sistem (her iki yöntemi de dener)
✅ Kod tekrarı azalır

## Değişiklikler

### Backend (`backend/server.js`)
- `/api/scan/product` endpoint'ini güncelle:
  - Önce `detectBarcode()` çağır
  - Barcode varsa → `lookupProductByBarcode()` kullan
  - Barcode yoksa → Mevcut Vision API + Custom Search akışını kullan
  - Her ikisi de aynı response formatını döndürür

### Frontend (`App.js`)
- `scanMode` state'inden `barcode` modunu kaldır
- `processImage()` fonksiyonunu güncelle:
  - `receipt` → Receipt scan
  - `product` → Unified scan (barcode + vision)

### HomeScreen (`src/screens/HomeScreen.js`)
- "Scan Barcode" butonunu kaldır
- "Scan Product" butonunu tut (artık her ikisini de yapar)

### CameraScreen (`src/screens/CameraScreen.js`)
- `scanMode === 'barcode'` kontrollerini kaldır
- Sadece `receipt` ve `product` modları kalır


