# HSDArena Frontend

**HSDArena Frontend**, Next.js ve Tailwind CSS kullanılarak geliştirilmiş, **backend API ile entegre çalışabilen** bir web uygulamasıdır.  

Şu an frontend, **ReqRes demo backend** ile test edilmekte olup, gerçek backend geldiğinde sadece `.env.local` güncellenerek sorunsuz geçiş sağlanabilir.

---

## 🚀 Özellikler

- Modern **Next.js (App Router)** mimarisi  
- **Tailwind CSS** ile responsive tasarım  
- **JWT token yönetimi** ve otomatik Authorization header ekleme  
- Login ve logout işlevselliği (`useAuth` hook’u ile)  
- Dashboard sayfasında kullanıcı bilgilerini görüntüleme  
- Backend URL ve API key’i `.env.local` üzerinden kolayca değiştirilebilir  
- ReqRes demo API ile test edilebilir; gerçek backend ile sorunsuz geçiş  

---

## 🔑 ReqRes Demo Kullanıcı

- Email: `eve.holt@reqres.in`  
- Password: `cityslicka`  

> Not: Bu kullanıcı sadece ReqRes demo backend ile test amaçlıdır. Gerçek backend geldiğinde kendi kullanıcılarınızla çalışabilirsiniz.

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
NEXT_PUBLIC_API_URL=https://reqres.in/api
NEXT_PUBLIC_API_KEY=reqres-free-v1
```

- Backend geldiğinde sadece URL ve gerekiyorsa API key değiştirin:

```
NEXT_PUBLIC_API_URL=https://api.sizin-backend.com
NEXT_PUBLIC_API_KEY=backend-key-123
```

4. Geliştirme sunucusunu başlatın:

```
npm run dev
```


- Uygulama varsayılan olarak: [http://localhost:3000](http://localhost:3000)  

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
│ ├─ app/ # Next.js sayfaları (page.tsx, dashboard, login vs.)
│ ├─ components/ # UI komponentleri (butonlar, formlar, layout)
│ ├─ hooks/ # useAuth hook ve diğer hooklar
│ ├─ lib/ # apiFetch helper
│ ├─ types/ # TypeScript tip tanımlamaları
│
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

## 📌 Notlar

- `.env.local` **asla commit edilmemeli**; API key ve token içerir.  
- ReqRes demo backend sadece **tek bir login kullanıcısı** ile çalışır (email: `eve.holt@reqres.in`, password: `cityslicka`).  
- Gerçek backend geldiğinde `.env.local` güncellemek yeterlidir; frontend koduna dokunmaya gerek yok.  

