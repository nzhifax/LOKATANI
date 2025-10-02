"# Lokatani - Marketplace Hasil Panen 🌾

Aplikasi marketplace React Native untuk transaksi hasil panen antara petani dan pembeli.

## ✨ Fitur Utama

### 1. Autentikasi Pengguna
- ✅ Registrasi pengguna (Petani & Pembeli)
- ✅ Login dengan email & password
- ✅ Logout
- ✅ Data tersimpan lokal dengan AsyncStorage

### 2. Multi Bahasa (i18n)
- ✅ Bahasa Indonesia
- ✅ Bahasa Inggris
- ✅ Toggle bahasa di halaman profil
- ✅ Preferensi bahasa tersimpan otomatis

### 3. Mode Tema (Dark/Light)
- ✅ **Light Mode**: Kombinasi hijau (#10B981) + putih
- ✅ **Dark Mode**: Kombinasi hijau (#10B981) + hitam
- ✅ Toggle tema di halaman profil
- ✅ Preferensi tema tersimpan otomatis

### 4. Halaman Produk
- ✅ Daftar produk dengan kategori (Sayuran, Biji-bijian, Buah-buahan)
- ✅ Filter produk berdasarkan kategori
- ✅ Pencarian produk
- ✅ Tampilan card dengan gambar, harga, nama petani, lokasi
- ✅ 30 produk dummy dengan data lengkap

### 5. Detail Produk
- ✅ Gambar produk full-width
- ✅ Informasi lengkap (harga, stok, deskripsi)
- ✅ Informasi petani & lokasi
- ✅ Pilih jumlah pembelian
- ✅ Tombol \"Tambah ke Keranjang\" & \"Beli Sekarang\"

### 6. Keranjang Belanja
- ✅ Menampilkan semua item di keranjang
- ✅ Update jumlah item
- ✅ Hapus item dari keranjang
- ✅ Total harga otomatis
- ✅ Badge notifikasi jumlah item di tab bar
- ✅ Data keranjang tersimpan di AsyncStorage

### 7. Checkout & Pembayaran
- ✅ Form alamat pengiriman
- ✅ Ringkasan pesanan
- ✅ Biaya pengiriman
- ✅ Total pembayaran
- ✅ **Mock Midtrans Payment Flow**:
  - Pilih metode pembayaran (Bank Transfer, GoPay, OVO, DANA)
  - Simulasi proses pembayaran
  - Halaman sukses dengan nomor pesanan
- ✅ Clear keranjang setelah pembayaran sukses

### 8. Profil Pengguna
- ✅ Upload foto profil (Kamera & Gallery)
- ✅ Permission handling untuk kamera & media library
- ✅ Foto tersimpan sebagai base64
- ✅ Informasi pribadi (Nama, Email, Tipe User)
- ✅ Pengaturan bahasa & tema
- ✅ Logout

## 🛠 Teknologi yang Digunakan

### Core
- **React Native** dengan **Expo**
- **Expo Router** (File-based routing)
- **TypeScript**

### State Management & Storage
- **React Context API** (Auth, Theme, Cart)
- **AsyncStorage** (Persistence lokal)

### UI/UX
- **React Native Components** (Native components only)
- **@expo/vector-icons** (Ionicons)
- **react-native-safe-area-context** (Safe areas)
- **expo-image** (Optimized images)

### Internationalization
- **react-i18next** & **i18next** (Multi-language support)

### Media & Camera
- **expo-image-picker** (Camera & Gallery access)

### Additional
- **Platform-specific handling** (iOS & Android)
- **KeyboardAvoidingView** untuk input yang nyaman

## 📁 Struktur Folder

```
/app/frontend/
├── app/                          # Routes (Expo Router)
│   ├── _layout.tsx              # Root layout dengan providers
│   ├── index.tsx                # Splash/Auth check
│   ├── auth/
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Register screen
│   ├── (tabs)/                  # Tab navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── home.tsx             # Home/Product listing
│   │   ├── cart.tsx             # Shopping cart
│   │   └── profile.tsx          # User profile & settings
│   ├── product/
│   │   └── [id].tsx             # Product detail (dynamic route)
│   ├── checkout.tsx             # Checkout screen
│   └── payment.tsx              # Payment screen
├── components/
│   ├── common/                  # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── product/
│   │   └── ProductCard.tsx
│   └── cart/
│       └── CartItem.tsx
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication
│   ├── ThemeContext.tsx         # Theme management
│   └── CartContext.tsx          # Shopping cart
├── data/
│   └── products.ts              # Dummy product data (30 items)
├── translations/
│   ├── id.json                  # Indonesian translations
│   └── en.json                  # English translations
├── utils/
│   ├── i18n.ts                  # i18n configuration
│   └── colors.ts                # Theme colors
├── app.json                     # Expo configuration
└── package.json                 # Dependencies

```

## 🎨 Warna & Tema

### Light Theme
```typescript
{
  primary: '#10B981',        // Green
  background: '#FFFFFF',     // White
  surface: '#F3F4F6',        // Light Gray
  text: '#1F2937',           // Dark Gray
  textSecondary: '#6B7280',  // Medium Gray
  border: '#E5E7EB',         // Border Gray
}
```

### Dark Theme
```typescript
{
  primary: '#10B981',        // Green
  background: '#000000',     // Black
  surface: '#1F2937',        // Dark Gray
  text: '#FFFFFF',           // White
  textSecondary: '#9CA3AF',  // Light Gray
  border: '#374151',         // Border Gray
}
```

## 📦 Data Dummy

### Produk (30 items)
- **8 Sayuran**: Tomat, Bayam, Cabai, Wortel, Kubis, Timun, Buncis, Terong
- **7 Biji-bijian**: Beras Premium, Jagung, Kedelai, Gandum, Kacang Merah, Kacang Hijau, Kacang Tanah
- **10 Buah**: Pisang, Mangga, Jeruk, Pepaya, Apel, Semangka, Nanas, Stroberi, Buah Naga, Alpukat

Setiap produk memiliki:
- Nama (ID & EN)
- Kategori
- Harga (Rupiah)
- Gambar (URL dari Unsplash)
- Deskripsi (ID & EN)
- Info Petani (Nama & Lokasi)
- Unit (kg, piece, etc.)
- Stok

## 🚀 Cara Menjalankan

### Development
```bash
cd /app/frontend
yarn start
```

### Testing di Device
1. Install **Expo Go** di smartphone
2. Scan QR code yang muncul di terminal
3. App akan terbuka di Expo Go

### Web Preview
```bash
yarn web
```
Buka browser di `http://localhost:3000`

## 📱 Navigasi Aplikasi

### Route Structure
```
/ (index) → Auth Check
  ↓
/auth/login → Login Screen
/auth/register → Register Screen
  ↓ (setelah login)
/(tabs)/home → Product Listing (Tab 1)
/(tabs)/cart → Shopping Cart (Tab 2)
/(tabs)/profile → User Profile (Tab 3)
  ↓
/product/[id] → Product Detail
  ↓
/checkout → Checkout Form
  ↓
/payment → Payment Selection → Success Screen
```

## 🔐 Autentikasi (Local)

Data pengguna disimpan di AsyncStorage:
- **@lokatani:user** - Current user data
- **@lokatani:users** - List of all registered users

### User Data Structure
```typescript
{
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'farmer' | 'buyer';
  photo?: string; // base64
  createdAt: string;
}
```

## 🛒 Shopping Cart (Local)

Data keranjang tersimpan di AsyncStorage:
- **@lokatani:cart** - Cart items

### Cart Item Structure
```typescript
{
  ...Product,  // All product fields
  quantity: number;
}
```

## 💳 Pembayaran (Mock Midtrans)

Payment flow adalah **simulasi** Midtrans:
1. User pilih metode pembayaran (Bank, GoPay, OVO, DANA)
2. Klik \"Proceed to Payment\"
3. Simulasi processing 2.5 detik
4. Menampilkan halaman sukses dengan order number
5. Cart dibersihkan otomatis

**Catatan**: Saat backend Laravel ditambahkan, ganti dengan Midtrans Snap API yang sesungguhnya.

## 📸 Screenshot Features

### Screens Included
1. ✅ Login Screen
2. ✅ Register Screen
3. ✅ Home Screen (dengan kategori & search)
4. ✅ Product Detail Screen
5. ✅ Cart Screen
6. ✅ Checkout Screen
7. ✅ Payment Screen
8. ✅ Payment Success Screen
9. ✅ Profile Screen (dengan upload foto)

## 🔧 Permissions

### iOS
- Camera Usage
- Photo Library Access

### Android
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

Permissions diminta saat user mencoba mengakses kamera/gallery.

## 🌐 i18n Support

Semua teks di aplikasi mendukung 2 bahasa:
- Indonesian (id) - **Default**
- English (en)

Translation files di `/translations/id.json` dan `/translations/en.json`

## 🎯 Fitur untuk Backend Laravel (Future)

Saat Laravel backend ditambahkan, berikut yang perlu diintegrasikan:

### API Endpoints yang Dibutuhkan
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/products
GET    /api/products/:id
POST   /api/cart
GET    /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
POST   /api/orders
POST   /api/payment/midtrans
GET    /api/user/profile
PUT    /api/user/profile
POST   /api/user/photo
```

### Yang Perlu Diganti
1. **AsyncStorage** → API calls
2. **Dummy products** → Real database
3. **Mock Midtrans** → Real Midtrans Snap API
4. **Local auth** → JWT tokens
5. **Base64 images** → Cloud storage (S3, Cloudinary, etc.)

## ✅ Fitur yang Sudah Selesai

- [x] Authentication (Login/Register/Logout)
- [x] Dual language (ID/EN)
- [x] Dark/Light theme
- [x] Product listing with categories
- [x] Product detail page
- [x] Shopping cart
- [x] Checkout flow
- [x] Mock payment (Midtrans simulation)
- [x] User profile
- [x] Photo upload (Camera & Gallery)
- [x] AsyncStorage persistence
- [x] Safe area handling
- [x] Keyboard handling
- [x] Navigation dengan expo-router
- [x] Responsive design
- [x] Cross-platform (iOS & Android)

## 🚀 Ready to Test!

Aplikasi sudah **100% fungsional** dengan dummy data. Semua fitur bekerja dengan baik:
- Registrasi & Login ✓
- Browse produk dengan kategori ✓
- Add to cart & checkout ✓
- Mock payment flow ✓
- Profile dengan foto upload ✓
- Dark/Light theme toggle ✓
- Bahasa ID/EN toggle ✓

**Tinggal scan QR code dan test di device Anda!**

---

## 📝 Notes

- App ini menggunakan **dummy data** - tidak ada backend API calls
- Semua data tersimpan **lokal** di device dengan AsyncStorage
- Payment flow adalah **simulasi** - tidak ada transaksi real
- Gambar produk menggunakan Unsplash URLs (online images)
- Photo profile upload menggunakan **base64** encoding

Ketika backend Laravel sudah ready, tinggal ganti data flow dari local ke API! 🚀
"