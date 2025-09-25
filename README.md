# 🏭 Berita Acara Generator - KPP FGDP

Web App untuk pembuatan form dan export laporan PDF Berita Acara Inspeksi (Roof, Floor, dan Combined).

## ✨ Fitur Utama

- **3 Template Laporan**: Roof Inspection, Floor Inspection, Combined Report
- **Form Dinamis**: Otomatis menyesuaikan checklist berdasarkan template
- **Upload Evidence**: Setiap checklist item bisa upload foto bukti
- **Dokumentasi Foto**: Upload foto umum dokumentasi
- **Export PDF**: Generate PDF sesuai template asli dengan layout profesional
- **Responsive Design**: Tampilan modern dan mobile-friendly

## 🚀 Cara Menjalankan

### Metode 1: Langsung di Browser (Recommended)
1. Buka file `index.html` di browser
2. Aplikasi akan langsung berjalan menggunakan React CDN

### Metode 2: Dengan Node.js
1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan aplikasi:
   ```bash
   npm start
   ```

## 📋 Cara Penggunaan

1. **Pilih Template**: Pilih jenis laporan (Roof/Floor/Combined)
2. **Isi Form**: Lengkapi informasi umum (tanggal, project, lokasi, dll)
3. **Checklist**: Centang item yang sudah diperiksa dan upload evidence foto
4. **Dokumentasi**: Upload foto umum dokumentasi (opsional)
5. **Catatan**: Tambahkan catatan khusus
6. **Export**: Klik tombol "Export PDF" untuk download laporan

## 📁 Struktur File

```
Project_Dandy/
├── index.html              # File HTML utama
├── Template_Code.jsx       # Komponen React utama
├── package.json           # Dependencies NPM
├── README.md             # Dokumentasi
└── Template/             # Template PDF referensi
    ├── TEMPLATE FLOOR (MINED OUT).pdf
    └── TEMPLATE ROOF (EXPOSE).pdf
```

## 🎨 Perbaikan dari Versi Sebelumnya

### ✅ Desain & UI/UX
- **Modern Design**: Styling clean dengan warna yang konsisten
- **Responsive Layout**: Grid system yang adaptive
- **Better Typography**: Font system yang readable
- **Visual Feedback**: Hover effects, focus states, progress indicator
- **Icons & Emojis**: Visual cues yang intuitif

### ✅ Functionality
- **Pure JavaScript**: Menghilangkan TypeScript complexity
- **CDN Dependencies**: Tidak perlu build process
- **Better PDF Export**: Layout sesuai template asli
- **Image Handling**: Preview dan thumbnail di PDF
- **Progress Tracking**: Real-time checklist progress
- **Form Validation**: Input validation dan formatting

### ✅ Code Quality
- **Clean Architecture**: Separation of concerns
- **Reusable Components**: Modular design
- **Error Handling**: Robust error management
- **Performance**: Optimized rendering

## 🔧 Kustomisasi

### Mengubah Template Checklist
Edit array `roofChecklist` dan `floorChecklist` di `Template_Code.jsx`:

```javascript
const roofChecklist = [
  { id: "R1", text: "Item checklist baru" },
  // tambah item lainnya...
];
```

### Mengubah Styling
Modifikasi inline styles atau tambahkan CSS di `index.html`:

```css
/* Custom styling */
.custom-style {
    /* your styles */
}
```

### Mengubah Layout PDF
Edit function `exportPDF()` untuk menyesuaikan:
- Header layout
- Table columns
- Image positioning
- Signature section

## 🎯 Roadmap

- [ ] **Database Integration**: Simpan data form
- [ ] **User Authentication**: Multi-user support
- [ ] **Template Builder**: Visual template editor
- [ ] **Digital Signature**: E-signature integration
- [ ] **Batch Export**: Multiple reports at once
- [ ] **Email Integration**: Auto-send reports
- [ ] **Mobile App**: Native mobile version

## 🐛 Troubleshooting

### PDF tidak ter-generate
- Pastikan browser mendukung jsPDF
- Check console untuk error messages
- Verify image files format (JPG/PNG)

### Layout broken
- Check responsive CSS
- Verify browser compatibility
- Clear browser cache

### Upload foto gagal
- Check file size (max recommended: 5MB)
- Verify image format
- Check browser permissions

## 📞 Support

Untuk pertanyaan atau bug report, hubungi:
- **Developer**: KPP-FGDP Data Analyst Team
- **Project**: Dandy
- **Version**: 1.0.0

## 📄 License

MIT License - Free to use and modify for internal company use.

---

🏭 **PT BRE – PT KPP (Project)** | Berita Acara Generator v1.0
