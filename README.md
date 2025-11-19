# Scan Good - Price Comparison App

A React Native mobile application that helps users compare prices across different stores by scanning receipts, barcodes, and products.

## Özellikler / Features

### 🇹🇷 Türkçe

- **Fiş Tarama**: Alışveriş fişlerini tarayarak otomatik ürün ve fiyat tanıma
- **Barkod Tarama**: Ürün barkodlarını tarayarak anında fiyat karşılaştırma
- **Ürün Tarama**: Ürün fotoğrafı çekerek farklı mağazalardaki fiyatları görme
- **Fiyat Karşılaştırma**: Birden fazla mağazada aynı ürünlerin fiyat karşılaştırması
- **Tasarruf Hesaplama**: Ne kadar tasarruf edebileceğinizi otomatik hesaplama
- **Mağaza Önerileri**: Size en yakın ve en uygun fiyatlı mağazaları bulma
- **Alışveriş Listesi**: Taradığınız ürünleri liste halinde saklama

### 🇺🇸 English

- **Receipt Scanning**: Automatic product and price recognition by scanning shopping receipts
- **Barcode Scanning**: Instant price comparison by scanning product barcodes
- **Product Scanning**: Take product photos and see prices at different stores
- **Price Comparison**: Compare prices of the same products across multiple stores
- **Savings Calculator**: Automatically calculate how much you can save
- **Store Recommendations**: Find the nearest and most affordable stores
- **Shopping List**: Save scanned products in a list format

## Kurulum / Installation

### Gereksinimler / Requirements

- Node.js (v16 veya üzeri / v16 or higher)
- npm veya yarn
- Expo CLI
- iOS için: Xcode ve iOS Simulator
- Android için: Android Studio ve Android Emulator

### Adımlar / Steps

1. **Projeyi klonlayın / Clone the project**
```bash
git clone <your-repo-url>
cd scan-good-app
```

2. **Bağımlılıkları yükleyin / Install dependencies**
```bash
npm install
# veya / or
yarn install
```

3. **Expo CLI'yi yükleyin (eğer yüklü değilse) / Install Expo CLI (if not installed)**
```bash
npm install -g expo-cli
```

4. **Uygulamayı başlatın / Start the application**
```bash
npm start
# veya / or
expo start
```

5. **Cihazınızda çalıştırın / Run on your device**

   **iOS:**
   - iOS Simulator'da açmak için: `i` tuşuna basın
   - Fiziksel iPhone'da: Expo Go uygulamasını indirin ve QR kodu tarayın
   
   **iOS:**
   - To open in iOS Simulator: Press `i`
   - On physical iPhone: Download Expo Go app and scan the QR code

   **Android:**
   - Android Emulator'da açmak için: `a` tuşuna basın
   - Fiziksel Android'de: Expo Go uygulamasını indirin ve QR kodu tarayın
   
   **Android:**
   - To open in Android Emulator: Press `a`
   - On physical Android: Download Expo Go app and scan the QR code

## Kullanılan Teknolojiler / Technologies Used

- **React Native**: Mobil uygulama geliştirme framework'ü
- **Expo**: React Native development platform
- **Expo Camera**: Kamera erişimi ve tarama işlemleri
- **Expo Image Picker**: Galeriden resim seçimi
- **React Hooks**: State ve lifecycle yönetimi

## Proje Yapısı / Project Structure

```
scan-good-app/
├── App.js                 # Ana uygulama dosyası / Main application file
├── package.json           # Proje bağımlılıkları / Project dependencies
├── app.json              # Expo konfigürasyonu / Expo configuration
├── babel.config.js       # Babel konfigürasyonu / Babel configuration
├── .gitignore            # Git ignore dosyası / Git ignore file
├── README.md             # Bu dosya / This file
└── src/                  # Kaynak kod klasörü / Source code folder
    ├── components/       # Yeniden kullanılabilir bileşenler / Reusable components
    │   ├── Header.js
    │   ├── BottomNavigation.js
    │   └── index.js
    ├── screens/          # Ekran bileşenleri / Screen components
    │   ├── HomeScreen.js
    │   ├── CameraScreen.js
    │   ├── ProductDetailsScreen.js
    │   ├── ShoppingListScreen.js
    │   ├── CompareScreen.js
    │   ├── TargetComparisonScreen.js
    │   └── index.js
    ├── constants/        # Sabitler (renkler, boyutlar) / Constants (colors, dimensions)
    │   ├── colors.js
    │   ├── dimensions.js
    │   └── index.js
    ├── utils/            # Yardımcı fonksiyonlar / Helper functions
    │   └── helpers.js
    ├── navigation/       # Navigasyon yapılandırması / Navigation configuration
    ├── styles/           # Global stiller (opsiyonel) / Global styles (optional)
    └── assets/           # Görseller, fontlar vb. / Images, fonts, etc.
```

## Ekranlar / Screens

1. **Ana Sayfa (Home)**: Üç tarama seçeneği
2. **Kamera (Camera)**: Ürün, barkod veya fiş tarama
3. **Ürün Detayları (Product Details)**: Seçilen ürünün farklı mağazalardaki fiyatları
4. **Alışveriş Listesi (Shopping List)**: Taranmış ürünler ve toplam fiyat
5. **Fiyat Karşılaştırma (Compare Prices)**: Mağazalar arası detaylı karşılaştırma
6. **Mağaza Detayı (Store Details)**: Belirli bir mağazadaki alışveriş listesi toplam fiyatı

## Özelleştirme / Customization

### Renk Teması / Color Theme

Ana renk paleti `#2ecc71` (yeşil) etrafında tasarlanmıştır. Farklı bir renk kullanmak için `styles` objesindeki tüm `#2ecc71` değerlerini değiştirin.

The main color palette is designed around `#2ecc71` (green). To use a different color, change all `#2ecc71` values in the `styles` object.

### Mağaza Logoları / Store Logos

Gerçek mağaza logolarını kullanmak için:
1. Logo görsellerini `assets/` klasörüne ekleyin
2. `Image` component'ini kullanarak görselleri yükleyin

To use actual store logos:
1. Add logo images to the `assets/` folder
2. Use the `Image` component to load the images

## Gelecek Özellikler / Future Features

- 🗺️ Google Maps entegrasyonu ile rota oluşturma
- 💾 Favori mağazaları kaydetme
- 📊 Fiyat geçmişi ve trendler
- 🔔 Fiyat düştüğünde bildirim
- 👥 Sosyal paylaşım özellikleri
- 🌐 API entegrasyonu ile gerçek zamanlı fiyat verileri

- 🗺️ Route creation with Google Maps integration
- 💾 Save favorite stores
- 📊 Price history and trends
- 🔔 Notifications when prices drop
- 👥 Social sharing features
- 🌐 Real-time price data via API integration

## Geliştirme / Development

### Debug Modu / Debug Mode

```bash
expo start --dev-client
```

### Production Build

**iOS:**
```bash
eas build --platform ios
```

**Android:**
```bash
eas build --platform android
```

## Katkıda Bulunma / Contributing

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açarak ne değiştirmek istediğinizi tartışın.

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Lisans / License

MIT

## İletişim / Contact

Sorularınız için: [your-email@example.com]

For questions: [your-email@example.com]

---

**Not / Note**: Bu uygulama demo amaçlıdır. Gerçek mağaza fiyatları için API entegrasyonu gereklidir.

This application is for demonstration purposes. API integration is required for actual store prices.
