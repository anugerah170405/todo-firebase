# Todo App (Firebase Firestore)

Aplikasi Todo list modern yang dibangun dengan React 19, TypeScript, Tailwind CSS, dan Firebase Cloud Firestore (real-time sync).

## Fitur

- ⚡ **Real-time Sync**: Menggunakan Firestore `onSnapshot` sehingga perubahan data langsung sinkron secara instan.
- 📝 **CRUD Lengkap**: Tambah, edit, tandai selesai/belum, dan hapus tugas.
- 🔍 **Pencarian**: Filter pencarian tugas berdasarkan judul.
- 📊 **Statistik**: Total tugas, tugas selesai, dan tugas belum selesai.
- 🎨 **Modern UI**: Dibangun dengan Tailwind CSS.

---

## Langkah Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru.
2. Masuk ke menu **Build** > **Firestore Database**, lalu klik **Create database**.
   - Pilih lokasi server terdekat (misal: `asia-southeast2` untuk Jakarta atau `asia-southeast1` untuk Singapura).
   - Pada bagian Security Rules, pilih **Start in test mode** untuk keperluan development:
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
3. Masuk ke **Project Settings** (ikon gerigi di kiri atas) > tab **General**.
4. Gulir ke bawah ke bagian **Your apps**, lalu klik ikon Web (`</>`) untuk mendaftarkan aplikasi.
5. Salin konfigurasi Firebase ke dalam file `.env` di root project:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Cara Menjalankan

```bash
# Menjalankan development server
npm run dev

# Build untuk production
npm run build

# Menjalankan linter
npm run lint
```
