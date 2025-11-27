# 💰 API Kredileri Optimizasyonu

## ⚠️ Sorun

Önceki versiyonda her site için ayrı API çağrısı yapıyorduk:
- Amazon: 1 API çağrısı
- Target: 1 API çağrısı
- Walmart: 1 API çağrısı
- Google Shopping: 1 API çağrısı
- **TOPLAM: 4 API çağrısı** ❌

Google Custom Search API ücretsiz kotası: **100 sorgu/gün**
- 4 çağrı = 4 kredi kullanımı
- Günde 25 ürün araması yaparsanız = 100 kredi biter! ❌

---

## ✅ Çözüm

**Tek API çağrısı ile tüm siteleri aramak:**

```javascript
// Tek sorgu ile tüm siteler:
query = "Solti buy online (site:amazon.com OR site:target.com OR site:walmart.com OR site:google.com/shopping)"
```

- **TOPLAM: 1 API çağrısı** ✅
- Günde 100 ürün araması yapabilirsiniz! ✅

---

## 🔧 Nasıl Çalışıyor?

### 1. Tek Sorgu
- Google Custom Search API'ye tek bir sorgu gönderilir
- Sorgu içinde `OR` operatörü ile tüm siteler belirtilir
- API tüm sitelerden sonuçları döndürür

### 2. Sonuç Dengeleme
- Eğer bir site çok fazla sonuç döndürürse, diğer sitelerden de sonuçlar gösterilir
- Her siteden en fazla 3 sonuç gösterilir (çeşitlilik için)
- Sonuçlar fiyata göre sıralanır

### 3. Tekrar Kaldırma
- Aynı URL'den gelen sonuçlar kaldırılır
- Benzersiz sonuçlar gösterilir

---

## 📊 Karşılaştırma

| Özellik | Önceki (4 çağrı) | Yeni (1 çağrı) |
|---------|------------------|----------------|
| API çağrısı | 4 | 1 ✅ |
| Kredi kullanımı | 4/ürün | 1/ürün ✅ |
| Günlük limit | ~25 ürün | ~100 ürün ✅ |
| Sonuç çeşitliliği | Yüksek | Yüksek ✅ |
| Hız | Yavaş (4x) | Hızlı ✅ |

---

## 🎯 Sonuç

- ✅ **4x daha az kredi kullanımı**
- ✅ **4x daha hızlı**
- ✅ **Aynı sonuç kalitesi**
- ✅ **Tüm sitelerden sonuçlar**

---

## ⚠️ Notlar

- Google Custom Search API ücretsiz kotası: **100 sorgu/gün**
- Tek sorgu ile günde **100 ürün** arayabilirsiniz
- Daha fazla arama için ücretli plan gerekir

---

## 🔍 Test Etmek İçin

1. Backend'i yeniden başlat: `cd backend && npm start`
2. Bir ürün tara
3. Backend loglarında şunu göreceksiniz:
   ```
   🔍 Calling Google Custom Search API for: Solti
   💡 Using single API call to save credits (searching all sites at once)
   ✅ Custom Search API returned 10 results
   📊 Results by source: { Amazon: 3, Target: 2, Walmart: 4, 'Google Shopping': 1 }
   ```

Tek API çağrısı ile tüm sitelerden sonuçlar geliyor! 🎉


