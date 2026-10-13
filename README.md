# T3'Adana Yarışma Dünyası – Kurulum

Sayfalar GitHub Pages'te (ücretsiz) çalışır; gerçek zamanlı eşleşme için ücretsiz Firebase Realtime Database kullanılır.

## 1) Firebase (ücretsiz, 5 dk)
1. https://console.firebase.google.com → **Proje ekle**.
2. Sol menü **Build → Realtime Database → Veritabanı oluştur** (test modu).
3. **Rules** sekmesine yapıştırıp **Publish**:
   `{"rules":{"games":{"$pin":{".read":true,".write":true}},"contests":{".read":true,".write":true}}}`
4. **Proje ayarları → Uygulamalarım → Web (</>)** ekle; çıkan `firebaseConfig` değerlerini `config.js` içine yaz (`databaseURL` dahil).

## 2) GitHub Pages
1. Yeni repo oluştur, bu klasördeki tüm dosyaları yükle.
2. **Settings → Pages → Branch: main / root → Save**.
3. Adresler: `https://KULLANICI.github.io/REPO/` (yarışmacı), `.../admin.html` (yönetici).

## Kullanım
Yönetici `admin.html`'de **Yeni Yarışma Hazırla** ile soruları önceden kaydeder (ör. "Yarışma 1"). Zamanı gelince listeden **Odayı Aç** der → çıkan PIN/linki paylaşır → yarışmacılar katılınca **Başlat**. Kayıtlı yarışmalar Firebase'de durur, her cihazdan görünür.
Yönetici sayfası oyun boyunca **açık kalmalı** (soru geçişlerini o sayfa yönetir).
Puan: doğru cevap 500–1000 (hızlı = yüksek). Not: Bu basit kurulumda teknik bilen biri tarayıcı konsolundan cevapları görebilir; ciddi/ödüllü yarışmalar için Firebase Auth + kurallar eklenmeli.
