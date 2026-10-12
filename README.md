# Orbitara — Company Profile Website

Company profile satu halaman untuk bisnis **sewa & jual perangkat internet satelit Starlink** di Indonesia.
Bahasa: Indonesia. Dibangun ulang dengan gaya visual dark avant-garde (ruang angkasa, bintang, efek 3D saat scroll).

## Isi halaman

- **Hero** — judul besar + parallax + statistik
- **01 Tentang** — profil usaha
- **02 Produk** — tab Sewa / Beli + kartu harga
- **03 Area Layanan** — chips kota/wilayah
- **04 Cara Memesan** — 4 langkah
- **05 Testimoni** — contoh
- **06 FAQ** — accordion
- **Kontak** — tombol WhatsApp + footer

Efek: preloader, canvas starfield berlapis dengan bintang jatuh, marquee, kursor kustom (desktop), tombol magnetis, tilt 3D pada kartu, reveal saat scroll, progress bar, mode reduced-motion.

## Cara menjalankan

Tidak perlu install apa pun. Buka file `index.html` langsung di browser (klik dua kali) — situs berjalan offline, tanpa server dan tanpa internet.

## Cara push ke GitHub

```bash
cd starlink-web-code
git init
git add .
git commit -m "Company profile Orbitara"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Ganti `USERNAME` dan `NAMA-REPO` dengan akun dan nama repositori GitHub-mu.
Buat repositori kosong dulu di github.com → New repository (tanpa README agar tidak konflik).

## Publikasi gratis via GitHub Pages

1. Di halaman repositori GitHub → **Settings → Pages**.
2. Pada "Build and deployment", pilih **Deploy from a branch**.
3. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu ~1 menit — situsmu online di `https://USERNAME.github.io/NAMA-REPO/`.

## Checklist placeholder (wajib diganti sebelum publikasi)

- [ ] Nama brand "Orbitara" → nama usaha asli (cari `Orbitara` di semua file)
- [ ] Harga sewa & beli → harga resmi (cari `harga contoh`)
- [ ] Nomor WhatsApp → nomor asli (tombol `#wa-btn` di `index.html` + hapus catatan "sementara")
- [ ] Area layanan → sesuaikan kota/wilayah operasional
- [ ] Testimoni → ganti dengan ulasan pelanggan asli (saat ini contoh)
- [ ] Statistik hero (100+ Mbps, 38 provinsi, 24/7) → angka sebenarnya
- [ ] Tahun & teks footer

## Catatan teknis

- Tanpa dependensi eksternal: tanpa CDN, font, atau library. Murni HTML + CSS + JavaScript.
- Seluruh JavaScript dibungkus aman — jika kanvas atau animasi gagal, halaman tetap tampil normal.
- Efek berat (kursor kustom, tilt 3D, magnetis) hanya aktif di perangkat dengan mouse (`pointer: fine`).
- `prefers-reduced-motion` menonaktifkan seluruh animasi demi aksesibilitas.
