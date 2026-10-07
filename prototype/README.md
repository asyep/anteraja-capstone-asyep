# Anteraja Tracking — HTML/CSS Prototype

Prototype UI pelacakan paket yang mengacu pada PRD Smart AI Shipment Tracking Widget v4.0 dan FRD Final v3.0, termasuk FRD F-01 sampai F-05 dan F-06.

Flow prototype dipetakan langsung dari [`../docs/flow map.md`](../docs/flow%20map.md); lihat [FLOW.md](FLOW.md) untuk relasi node sumber dengan halaman HTML.

## Membuka prototype

Buka `index.html` untuk melihat beranda layanan. Pilih **Lacak Kiriman** untuk masuk ke form pelacakan di `pages/lacak.html`. Atau jalankan server statis dari folder `prototype/`:

```bash
python3 -m http.server 8000
```

Kemudian kunjungi `http://localhost:8000`.

## Halaman

- `index.html` + `home.css`: beranda prototype dengan pencarian ringkas, empat fitur FRD, empat status demo, FAQ, dan tautan bantuan.
- `pages/lacak.html`: halaman pelacakan khusus dengan form resi, empat contoh status, informasi fitur, dan FAQ.
- `pages/loading.html`: state indikator loading dan skeleton.
- `pages/validation-error.html`: format resi salah (HTTP 400/client validation) dengan pesan dan input ditandai.
- `pages/tracking-normal.html`: paket berjalan normal.
- `pages/tracking-live.html`: fixture khusus Live Map dengan peta ilustratif.
- `pages/tracking.html`: paket dalam perjalanan dengan kendala, banner operasional, narasi, dan ETA yang disesuaikan.
- `pages/ai-fallback.html`: narasi cadangan; informasi perjalanan dan ETA tetap tersedia.
- `pages/delivered.html`: paket tiba, tanggal/jam penerimaan, semua milestone selesai.
- `pages/canceled.html`: status batal dan progres stepper berhenti.
- `pages/not-found.html`: state resi tidak ditemukan.
- `pages/service-error.html`: state gangguan layanan dan jalur coba kembali.
- `pages/bantuan.html`: FAQ dan tautan bantuan.

Setiap halaman memiliki navigasi kembali ke pencarian, bantuan, atau halaman status terkait. Beranda mengikuti struktur referensi Stitch tetapi berisi fitur proyek: pencarian ringkas di hero, pintasan ke empat kebutuhan FRD, empat kartu status demo, informasi batas prototype, FAQ, dan footer. Beranda dan halaman Lacak Kiriman terhubung melalui navigasi dan CTA; halaman Lacak Kiriman memuat form serta empat kartu demo dengan nomor resi dan status yang jelas. Halaman perjalanan menampilkan banner ETA, narasi, stepper, riwayat, detail kiriman, ilustrasi rute, dan kartu kurir demo; halaman kendala menonjolkan banner peringatan oranye dan ETA yang disesuaikan. Halaman 404 memuat panduan pemeriksaan nomor resi. Form utama menerima resi demo 13 digit. JavaScript sisi klien memetakan `1000849201994` ke In-Transit, `1000921477821` ke Live Map, dan `1000781293812` ke Peringatan Jalur; nomor lain menuju state tidak ditemukan. Pemetaan mengarah ke fixture statis dan bukan lookup database. Data rute dan kurir tambahan diberi label ilustrasi/contoh, bukan data live.

## Pemetaan FRD

- **F-01** — label input, batas 32 karakter, `pattern` alfanumerik, validasi native browser, submit, state format salah (400), loading, 404, dan gangguan layanan.
- **F-02** — stepper empat tahap, timestamp WIB, tahap aktif/selesai, status delivered dan canceled.
- **F-03** — kartu narasi Asisten Anteraja dan keterangan fallback.
- **F-04** — banner oranye dengan alasan keterlambatan dan kondisi lalu lintas; tidak ditampilkan di alur normal.
- **F-05** — badge ETA tanggal/jam, penyesuaian waktu tunggu, dan konfirmasi saat delivered.
- **F-06** — halaman fallback narasi dan informasi status tetap tersedia. Cache Redis dan batas waktu Gemini 1,2 detik adalah proses backend, bukan perilaku yang bisa dilakukan HTML/CSS.

## Standar implementasi

- UI memakai HTML dan CSS. JavaScript kecil hanya dipakai untuk memetakan tiga nomor resi demo ke halaman state statis; tidak ada backend atau pencarian database.
- Semantic HTML: `header`, `nav`, `main`, `section`, `aside`, `ol`, `time`, `form`, `label`, `dl`, `details`, dan `footer` digunakan sesuai konteks.
- JSON-LD Schema.org `ParcelDelivery` dan `DeliveryEvent` disediakan pada `pages/tracking.html`.
- CSS mencakup breakpoint tablet/ponsel, state fokus keyboard, dan `prefers-reduced-motion`.

## Batas prototype

Semua data pada halaman status adalah contoh statis dari fixture database. Pemetaan nomor resi demo berlangsung sepenuhnya di browser dan tidak membuktikan status dari record database. Prototype tidak menjalankan request tracking, memperbarui status dari server, menonaktifkan tombol selama request, melakukan retry otomatis, atau memanggil Gemini/Redis. Layar UI untuk state tersebut tersedia sebagai halaman prototype; fungsi integrasi dan transisi state otomatis memerlukan JavaScript dan backend. Prototype ini berfokus pada hierarki visual dan alur navigasi pelanggan, bukan pelacakan live.
