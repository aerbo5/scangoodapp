# Git Push Rehberi - Adım Adım

## 📚 Temel Git Komutları

### 1. Durumu Kontrol Etme

```bash
# Hangi dosyalar değişti?
git status

# Kısa format
git status --short
```

### 2. Değişiklikleri Stage'e Ekleme (Hazırlama)

```bash
# Tek bir dosya ekle
git add dosya-adi.js

# Birden fazla dosya ekle
git add dosya1.js dosya2.js

# Tüm değişiklikleri ekle
git add .

# Belirli bir klasörü ekle
git add src/
```

### 3. Commit Etme (Yerel Kayıt)

```bash
# Commit mesajı ile
git commit -m "Değişiklik açıklaması"

# Örnek:
git commit -m "Fix: Netlify build command düzeltildi"
```

### 4. GitHub'a Push Etme

```bash
# Ana branch'e push
git push origin main

# Eğer branch adı master ise:
git push origin master
```

## 🚀 Tam Örnek - Adım Adım

### Senaryo: netlify.toml ve package.json'ı push etmek

```bash
# 1. Durumu kontrol et
git status

# 2. Değişen dosyaları ekle
git add netlify.toml package.json

# 3. Commit et
git commit -m "Fix: Expo export komutu düzeltildi - Metro bundler için"

# 4. GitHub'a push et
git push origin main
```

## 🔧 Sık Kullanılan Komutlar

### Tüm Değişiklikleri Tek Seferde Push Etmek

```bash
# Tüm değişiklikleri ekle
git add .

# Commit et
git commit -m "Mesajınız"

# Push et
git push origin main
```

### Remote Repository'yi Kontrol Etme

```bash
# Remote repository URL'ini göster
git remote -v

# Remote repository'yi değiştir
git remote set-url origin https://github.com/kullanici/repo.git
```

### Branch Kontrolü

```bash
# Hangi branch'te olduğunuzu göster
git branch

# Tüm branch'leri göster (remote dahil)
git branch -a

# Yeni branch oluştur
git branch yeni-branch-adi

# Branch değiştir
git checkout branch-adi
```

### Son Commit'leri Görme

```bash
# Son 5 commit'i göster
git log --oneline -5

# Detaylı log
git log
```

## ⚠️ Hata Durumları ve Çözümleri

### 1. "Updates were rejected" Hatası

```bash
# Önce pull yap, sonra push et
git pull origin main
git push origin main
```

### 2. "Unrelated histories" Hatası

```bash
# Unrelated histories'i birleştir
git pull origin main --allow-unrelated-histories
git push origin main
```

### 3. Credential Sorunu

```bash
# GitHub credentials cache'i temizle
git credential-manager-core erase
# Sonra push yaparken tekrar giriş yapmanız istenecek
```

## 📝 Pratik Örnekler

### Örnek 1: Yeni Dosya Eklemek

```bash
git add yeni-dosya.js
git commit -m "Add: Yeni dosya eklendi"
git push origin main
```

### Örnek 2: Değişiklikleri Geri Almak

```bash
# Stage'den çıkar (commit etmeden)
git reset HEAD dosya-adi.js

# Son commit'i geri al (değişiklikler kalır)
git reset --soft HEAD~1

# Son commit'i tamamen sil
git reset --hard HEAD~1
```

### Örnek 3: Commit Mesajını Değiştirmek

```bash
# Son commit mesajını değiştir
git commit --amend -m "Yeni mesaj"
git push origin main --force
```

## 🎯 Şu Anki Durumunuz İçin

```bash
# 1. Durumu kontrol et
git status

# 2. netlify.toml ve package.json'ı ekle
git add netlify.toml package.json

# 3. Commit et
git commit -m "Fix: Expo export komutu Metro bundler için düzeltildi"

# 4. Push et
git push origin main
```

## 💡 İpuçları

1. **Her zaman önce `git status` çalıştırın** - Ne değişti görmek için
2. **Anlamlı commit mesajları yazın** - "Fix: ...", "Add: ...", "Update: ..."
3. **Push etmeden önce local'de test edin** - Build çalışıyor mu kontrol edin
4. **Sık sık commit edin** - Küçük, anlamlı commit'ler yapın

## 🔐 Güvenlik

- **Asla `.env` dosyalarını commit etmeyin**
- **API key'leri commit etmeyin**
- **`.gitignore` dosyasını kontrol edin**

