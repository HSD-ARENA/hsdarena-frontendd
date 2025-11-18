# HSDArena Frontend

---

## ⚙️ Kurulum

1. Repo’yu klonlayın:

```
git clone https://github.com/EmirUzlucan/hsdarena-frontend.git

cd hsdarena-frontend
```

2. Bağımlılıkları yükleyin:

```
npm install
```

3. `.env.local` dosyasını oluşturun:


```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Geliştirme sunucusunu başlatın:

```
npm run dev
```


- Uygulama varsayılan olarak: [http://localhost:3000](http://localhost:3000)  

---

## 🔑 Demo Kullanıcı

- Email: `admin@example.com`  
- Password: `Admin123!`

---


## 🔗 Kullanım

### Login

```
const { login } = useAuth();
await login(email, password);
```

- Token otomatik olarak `localStorage`’a kaydedilir ve tüm API isteklerinde Authorization header olarak gönderilir.

### Logout

```
const { logout } = useAuth();
logout(); // Token silinir, kullanıcı state sıfırlanır
```

### API Çağrısı

```
import { apiFetch } from "@/lib/api";
const data = await apiFetch("/users/2"); // Örnek endpoint
```

- `apiFetch` otomatik olarak base URL, API key ve token header ekler.  
- Yeni endpoint eklemek için sadece path ve method/body belirtmek yeterlidir.

---

## 🛠️ Dosya Yapısı

```
hsdarena-frontend/
│
├─ src/
│   ├─ app/
|   |   ├─ (auth)/
|   |   │     └─ login/
|   |   │          └─ page.tsx              → Kullanıcı giriş ekranı (admin girişi için kullanılır)
|   |   │ 
|   |   ├─ admin/
|   |   │     ├─ page.tsx                   → Admin dashboard (giriş yapan admin için ana panel)
|   |   │     └─ quiz/
|   |   │          ├─ create/
|   |   │          │    └─ page.tsx         → Yeni quiz oluşturma sayfası
|   |   │          ├─ join/
|   |   │               └─ [sessionCode]/
|   |   │                    └─ page.tsx    → Quiz QR kod sayfası
|   |   │          ├─ result/
|   |   │          │    └─ page.tsx         → Quiz sonuçlarını görüntüleme sayfası
|   |   │          └─ session/
|   |   │               └─ [sessionCode]/
|   |   │                    └─ page.tsx    → Belirli bir quiz oturumuna ait yönetim ekranı
|   |   │ 
|   |   ├─ team/
|   |   |     ├─ join/
|   |   |     │    └─ page.tsx              → Takımın quiz oturumuna katılma ekranı (takım adı + session kodu girişi)
|   |   |     └─ quiz/
|   |   |          └─ [sessionCode]/
|   |   |               └─ page.tsx         → Takımın katıldığı quizin oynandığı ekran
|   |   ├─ layout.tsx                     
|   |   └─ page.tsx                         → Ana sayfa (quiz oluştur / quize katıl)
|   |
|   ├─ components/  # Uygulamada tekrar kullanılabilir UI bileşenlerini içerir (butonlar, formlar, layout vb.).
|   ├─ hooks/       # Özel React hook’larını ve reusable state yönetim logic’lerini içerir.
|   ├─ lib/         # Uygulama genelinde kullanılan yardımcı kütüphaneler ve fonksiyonları içerir.
|   ├─ services/    # API çağrıları ve backend ile iletişimi sağlayan servisleri içerir.
|   ├─ types/       # TypeScript tiplerini ve interface’leri barındırır.
|   ├─ styles/      # Global ve bileşen bazlı stilleri içerir (CSS, SCSS, Tailwind config vb.).
|   ├─ utils/       # Genel amaçlı yardımcı fonksiyonlar ve küçük araçlar için klasör.
|
├─ .env.local # API URL ve key (push etmeyin!)
├─ package.json
├─ next.config.js
└─ ...
```

## 🌿 Git Branch ve Commit Kullanımı

Projede **ana dal (main)** her zaman deploy edilebilir ve stabil tutulmalıdır. Yeni özellikler veya düzeltmeler için **branch** oluşturup üzerinde çalışmak önerilir.  

### 1️⃣ Branch Oluşturma

Yeni bir özellik veya düzeltme için:

```
git checkout -b feature/yeni-ozellik
```

- `feature/yeni-ozellik` → branch ismi, anlamlı ve kısa olmalı  
- `checkout -b` → yeni branch oluşturur ve o branch’e geçer  

---

### 2️⃣ Çalışma ve Commit

Değişiklik yaptıktan sonra:

- `git add .` → tüm değişiklikleri stage’ler  
- `git commit -m "mesaj"` → commit mesajı ile değişiklikleri kaydeder  
- Commit mesajı **kısa, anlaşılır ve yapılan değişikliği özetler**  

---

### 3️⃣ Branch’i Remote’a Gönderme

```
git push -u origin feature/yeni-ozellik
```


- Yeni branch GitHub’a eklenir ve başkalarıyla paylaşılabilir  
- `-u` parametresi branch’i remote ile takip edecek şekilde ayarlar  

---

### 4️⃣ Pull Request / Merge

- GitHub’da yeni branch için **Pull Request (PR)** açılır  
- Kod gözden geçirilir, onaylanırsa `main` branch’ine merge edilir  
- Bu yöntem, ana branch’in her zaman stabil kalmasını sağlar  

---

### 5️⃣ Ana Branch’e Geçme

```
git checkout main
git pull origin main
```

- Ana branch’e geçip en güncel hâlini alabilirsin  
- Yeni feature branch’ini main’e merge etmeden önce mutlaka güncel olmalı  

---

### 💡 Öneriler

- Her yeni özellik için **yeni branch** oluştur  
- Commit mesajlarını **anlaşılır ve kısa** tut  
- Ana branch’e **doğrudan commit yapma**; sadece PR üzerinden merge et  

---
