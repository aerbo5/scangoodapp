# Web'de Dışarıdan Erişim

## Sorun: Web'de çalışıyor ama dışarıdan erişilemiyor

Web'de dışarıdan erişim için frontend'i de ngrok ile expose etmeniz gerekiyor.

## Çözüm: Frontend için ngrok

### Adım 1: Frontend'in Portunu Öğrenin

Frontend genellikle `8081` portunda çalışır. Kontrol edin:
- Terminal'de frontend başlattığınızda port numarasını göreceksiniz
- Genellikle: `http://localhost:8081`

### Adım 2: Frontend için Yeni ngrok Tunnel Açın

**Yeni bir terminal açın** ve:

```bash
ngrok http 8081
```

Bu size frontend için bir URL verecek, örneğin:
```
Forwarding  https://xyz789.ngrok-free.dev -> http://localhost:8081
```

### Adım 3: Bu URL'i Kullanın

Artık bu ngrok URL'i üzerinden web uygulamanıza erişebilirsiniz:
```
https://xyz789.ngrok-free.dev
```

## Alternatif: Tek ngrok ile Her İkisini de Açmak

Eğer iki ayrı ngrok istemiyorsanız, frontend'i farklı bir port'ta çalıştırabilirsiniz, ama bu daha karmaşık.

## Önerilen: Localhost'ta Çalıştırın

Web geliştirme için genellikle localhost yeterlidir:
- `http://localhost:8081` - Web'de çalışır
- Mobil test için tunnel modu kullanın: `npx expo start --tunnel`

## Hızlı Çözüm

1. **Frontend terminalinde:**
   ```bash
   npx expo start --web
   ```

2. **Yeni terminal - Frontend için ngrok:**
   ```bash
   ngrok http 8081
   ```

3. **ngrok URL'ini kopyalayın ve tarayıcıda açın**

---

## Notlar

- Backend ngrok: `https://diagenetic-berry-pompously.ngrok-free.dev` (port 3000)
- Frontend ngrok: Yeni bir URL alacaksınız (port 8081)
- Her ikisi de aynı anda çalışabilir




