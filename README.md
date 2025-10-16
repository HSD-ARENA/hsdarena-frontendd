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
---

## 📌 Notlar

- `.env.local` **asla commit edilmemeli**; API key ve token içerir.  
- ReqRes demo backend sadece **tek bir login kullanıcısı** ile çalışır (email: `eve.holt@reqres.in`, password: `cityslicka`).  
- Gerçek backend geldiğinde `.env.local` güncellemek yeterlidir; frontend koduna dokunmaya gerek yok.  

