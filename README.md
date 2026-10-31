# Todo App — Firebase Firestore

Aplikasi Todo list modern yang dibangun dengan **React 19**, **TypeScript**, **Tailwind CSS**, dan **Firebase Cloud Firestore** (real-time sync).

---

## 👥 Pengembang — Kelompok 6

| Nama | Peran |
|------|-------|
| Nanalis, Anatasya Finchy | Ketua |
| Kowal, Chelsea Mikha | Anggota |
| Tandilangi, Gavrila Balo | Anggota |
| Gari, Anugerah | Anggota |

---

## ✨ Fitur

- ⚡ **Real-time Sync** — Menggunakan Firestore `onSnapshot` sehingga perubahan data langsung sinkron secara instan.
- 📝 **CRUD Lengkap** — Tambah, edit, tandai selesai/belum, dan hapus tugas.
- 🔍 **Pencarian** — Filter tugas berdasarkan judul secara instan.
- 📊 **Statistik** — Total tugas, tugas selesai, dan belum selesai.
- 🎨 **Modern UI** — Dibangun dengan Tailwind CSS v4.

---

## 🚀 Cara Menjalankan (setelah clone)

### 1. Clone & install dependensi

```bash
git clone https://github.com/anugerah170405/todo-firebase.git
cd todo-firebase
npm install
```

### 2. Buat file `.env`

Buat file `.env` di root project, lalu isi dengan konfigurasi Firebase kamu:

```bash
# Salin template env berikut ke file .env
cp .env.example .env   # jika tersedia, atau buat manual
```

Isi file `.env` dengan nilai yang didapat dari Firebase Console (lihat langkah setup di bawah):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Penting:** File `.env` tidak ikut ter-commit ke Git (sudah ada di `.gitignore`). Setiap developer wajib membuat file ini secara manual.

### 3. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

---

## 🔥 Setup Firebase (pertama kali)

Lakukan langkah ini jika belum punya project Firebase:

1. Buka [Firebase Console](https://console.firebase.google.com/) → **Add project** → ikuti wizard.

2. Masuk ke menu **Build** › **Firestore Database** → klik **Create database**.
   - Pilih lokasi: `asia-southeast2` (Jakarta) atau `asia-southeast1` (Singapura).
   - Pilih **Start in test mode** agar bisa langsung diakses saat development.

3. Atur **Security Rules** Firestore (menu **Rules**):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /tasks/{taskId} {
         allow read, write: if true;
       }
     }
   }
   ```

4. Pergi ke **Project Settings** (ikon ⚙️ kiri atas) → tab **General**.

5. Gulir ke bagian **Your apps** → klik ikon **Web** (`</>`) → daftarkan app.

6. Salin nilai dari blok `firebaseConfig` yang muncul ke file `.env` kamu (sesuai format di atas).

---

## 🧰 Tech Stack

| Teknologi | Versi |
|-----------|-------|
| React | 19 |
| TypeScript | ~6.0 |
| Tailwind CSS | v4 |
| Firebase SDK | v13 |
| Vite | v8 |
