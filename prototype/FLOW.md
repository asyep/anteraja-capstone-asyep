# Flow Prototype Mengacu ke `/docs/flow map.md`

Dokumen flow utama proyek adalah [`../docs/flow map.md`](../docs/flow%20map.md). Pemetaan berikut mengikuti urutan User Act → System/Backend Process → State/UI Output pada dokumen tersebut. Halaman HTML/CSS menyediakan state visual. JavaScript sisi klien hanya mengarahkan tiga nomor resi demo ke fixture masing-masing. Lookup Redis, query database, keputusan status, perhitungan, API, dan pemilihan narasi tetap proses konseptual backend dan tidak dijalankan prototype.

```mermaid
flowchart TD
  A([START]) --> B[Pengguna membuka beranda]
  B --> B1[Pengguna memilih Lacak Kiriman] --> C[STATE 0: IDLE<br/>Input resi kosong dan siap]
  C --> D[Pengguna memasukkan waybill]
  D --> E{Validasi native HTML<br/>13 digit?}
  E -->|Tidak| E1[STATE E1: VALIDATION ERROR<br/>Browser menahan submit / halaman pesan format]
  E1 --> D
  E -->|Ya| F{Cocokkan resi demo<br/>dengan peta rute statis}
  C -. Lihat contoh layar proses .-> L0[STATE 1: LOADING<br/>loading.html]
  L0 --> L1[Pengguna memilih lanjut]
  L1 --> F
  F -->|1000849201994| D1[In-Transit<br/>tracking-normal.html]
  F -->|1000921477821| D2[Live Map<br/>tracking-live.html]
  F -->|1000781293812| D3[Peringatan Jalur<br/>tracking.html]
  F -->|Nomor lain| D4[STATE E2: RESI TIDAK DITEMUKAN]
  F -. Implementasi backend pada sistem terhubung .-> G{Redis cache lookup<br/>backend konseptual}
  G -->|Cache hit <20ms| H[Gunakan payload cache]
  G -->|Cache miss| I[Query PostgreSQL<br/>relational join 5 tabel]
  I --> J{Resi ditemukan?}
  J -->|Tidak| E2[HTTP 404 / STATE E2<br/>Nomor resi tidak ditemukan]
  J -->|Ya| K[Ambil timestamp, konteks logistik,<br/>kota, ongkir, dan narasi]
  H --> L{order_status canceled?}
  K --> L
  L -->|Ya| E3[STATE E3: CANCELED<br/>Stepper merah dan progres berhenti]
  L -->|Tidak| M[Petakan empat milestone<br/>dan format timestamp WIB]
  M --> N{Ada delay reason,<br/>Heavy, atau Detour?}
  N -->|Ya| O[has_delay true<br/>Banner tampil dan ETA disesuaikan]
  N -->|Tidak| P[has_delay false<br/>Banner disembunyikan dan ETA standar]
  O --> Q[Susun prompt narasi]
  P --> Q
  Q --> R{Gemini berhasil<br/>sebelum 1,2 detik?}
  R -->|Timeout atau error| S[Rule-based fallback<br/>is_fallback true]
  R -->|Berhasil| T[Narasi Gemini<br/>is_fallback false]
  S --> U[Simpan payload ke Redis<br/>TTL 300 detik]
  T --> U
  U --> V[HTTP 200 OK]
  V --> W[STATE 2 / 3: HASIL PELACAKAN]
  W --> W1[F-05: ETA atau tanggal tiba]
  W --> W2[F-04: Banner jika has_delay]
  W --> W3[F-03: Narasi AI atau fallback]
  W --> W4[F-02: Stepper empat tahap]
  W --> W5[Info pengirim/penerima,<br/>layanan, ongkir/free shipping]
  E2 --> X[Pengguna kembali ke pencarian]
  E3 --> X
  W --> X
  X --> C
```

## Pemetaan node sumber ke halaman

| Node pada `/docs/flow map.md` | State atau halaman prototype |
| --- | --- |
| STATE 0: IDLE | `pages/lacak.html` — form kosong dan placeholder |
| Decision 1: format 13 digit untuk tiga fixture demo | Form HTML `required`, `minlength`, `maxlength`, `pattern`; skrip kecil memetakan tiga fixture ke halaman masing-masing |
| STATE E1: VALIDATION ERR | `pages/validation-error.html` — pesan format dan field invalid |
| STATE 1: LOADING | `pages/loading.html` — indikator, skeleton, dan aksi navigasi |
| Redis cache hit / miss | Tahap backend pada flow; tidak ada UI/cache operation di prototype |
| Database tidak menemukan resi / STATE E2 | `pages/not-found.html` — copy 404 ramah dan cara mencoba lagi |
| Database menemukan resi | Data contoh di halaman hasil |
| Decision 4: canceled / STATE E3 | `pages/canceled.html` — indikator merah dan progres berhenti |
| Milestone normal | `pages/tracking-normal.html` — 3 tahap selesai, tahap tujuan menunggu |
| Kondisi operasional delay | `pages/tracking.html` — warning Traffic Jam/Heavy, waiting 45 menit, ETA 18.45 |
| Kondisi operasional clear | `pages/tracking-normal.html` — tanpa banner, ETA standar pukul 18.00 |
| Gemini sukses / `is_fallback=false` | Narasi normal di `pages/tracking-normal.html` |
| Gemini timeout/error / `is_fallback=true` | `pages/ai-fallback.html` — narasi rule-based dan status logistik tetap terlihat |
| HTTP 200: paket tiba | `pages/delivered.html` — semua milestone selesai dan waktu tiba |
| HTTP 500 / layanan gagal | `pages/service-error.html` — pesan gangguan dan jalur kembali |
| Bantuan / selesai | `pages/bantuan.html` dan tautan kembali ke beranda/pencarian |

Beranda (`index.html`) memperkenalkan layanan dan menautkan ke halaman pelacakan; halaman Lacak Kiriman (`pages/lacak.html`) menyediakan form dan tautan demo per status. Halaman hasil juga menghubungkan pencarian, bantuan, dan contoh status lain. Form ringkas pada beranda mengarahkan pengguna ke halaman Lacak Kiriman. Form beranda dan Lacak Kiriman menerima tiga resi demo 13 digit. JavaScript sisi klien memetakan 1000849201994 ke In-Transit, 1000921477821 ke Live Map, dan 1000781293812 ke Peringatan Jalur. Nomor 13 digit lain membuka state tidak ditemukan. Pemetaan tersebut memakai fixture statis dan bukan lookup backend. Halaman loading tetap merupakan contoh layar proses yang dibuka terpisah.

## Batas implementasi HTML/CSS

Flow visual mengikuti seluruh cabang pada dokumen sumber, tetapi cabang Redis, PostgreSQL, status database, Gemini, fallback otomatis, cache TTL, dan respons HTTP hanya direpresentasikan sebagai layar. Skrip klien hanya memetakan tiga nomor resi demo ke fixture yang sudah ditentukan; fitur ini tidak melakukan lookup backend, menyimpan state, menghitung ETA, atau menerima data tracking live.
