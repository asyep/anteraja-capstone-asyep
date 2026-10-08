#!/usr/bin/env python3
"""Alat bantu demo backend — MilestoneMapperService.

Pemakaian:
    python3 docs/presentations/demo-backend.py           # cek kesiapan sebelum tampil
    python3 docs/presentations/demo-backend.py tampil    # tampilan untuk demo di terminal
"""

import json
import sys
import urllib.error
import urllib.request

API = "http://localhost:8000"
WEB = "http://localhost:5173"

RESI = [
    "44444444444444444444444444444444",
    "00010242fe8c5a6d1ba2dd792cb16214",
    "0008288aa423d2a3f00fcb17cd7d8719",
    "11111111111111111111111111111111",
]

HIJAU = "\033[32m"
MERAH = "\033[31m"
KUNING = "\033[33m"
TEBAL = "\033[1m"
REDUP = "\033[2m"
RESET = "\033[0m"


def ambil(url, timeout=25):
    """Kembalikan (data_json, header, detik)."""
    permintaan = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(permintaan, timeout=timeout) as respons:
        mentah = respons.read().decode()
        return json.loads(mentah), respons.headers, respons.status


def kode_status(url, timeout=5):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as respons:
            return respons.status
    except urllib.error.HTTPError as galat:
        return galat.code
    except Exception:
        return None


def cek_kesiapan():
    gagal = []

    print(f"\n{TEBAL}=== Cek kesiapan demo ==={RESET}\n")

    kode = kode_status(f"{API}/up")
    if kode == 200:
        print(f"  {HIJAU}OK{RESET}    Laravel hidup          {REDUP}{API}{RESET}")
    else:
        print(f"  {MERAH}GAGAL{RESET} Laravel tidak merespons (kode: {kode})")
        print(f"        {KUNING}jalankan:{RESET} cd backend && php artisan serve")
        gagal.append("Laravel")

    kode = kode_status(f"{WEB}/")
    if kode == 200:
        print(f"  {HIJAU}OK{RESET}    Vite / React hidup     {REDUP}{WEB}{RESET}")
    else:
        print(f"  {MERAH}GAGAL{RESET} Vite tidak merespons (kode: {kode})")
        print(f"        {KUNING}jalankan:{RESET} cd frontend && npm run dev")
        gagal.append("Vite")

    print()
    for resi in RESI:
        try:
            data, header, _ = ambil(f"{API}/api/v1/tracking/{resi}")
        except Exception as galat:
            print(f"  {MERAH}GAGAL{RESET} {resi}  ({galat})")
            gagal.append(resi)
            continue

        if not data.get("ok"):
            print(f"  {MERAH}GAGAL{RESET} {resi}  tidak ditemukan di database")
            gagal.append(resi)
            continue

        isi = data["data"]
        waktu = header.get("X-Waktu-Ms", "?")
        tanda_delay = f"  {MERAH}[terlambat: {isi['logistics_delay_reason']}]{RESET}" if isi["has_delay"] else ""
        print(
            f"  {HIJAU}OK{RESET}    {resi}"
            f"  {TEBAL}{isi['current_milestone_stage']}{RESET}"
            f"  {REDUP}{isi['formatted_eta']}  ({waktu} ms){RESET}"
            f"{tanda_delay}"
        )

    print()
    if gagal:
        print(f"{MERAH}{TEBAL}  {len(gagal)} masalah ditemukan — perbaiki dulu sebelum tampil.{RESET}")
        print(f"{REDUP}  Cadangan: slide 7 deck sudah memuat hasilnya, jadi demo tetap bisa jalan.{RESET}\n")
        return 1

    print(f"{HIJAU}{TEBAL}  Semua siap. Selamat presentasi!{RESET}")
    print(f"{REDUP}  Demo lewat aplikasi: buka {WEB}/lacak")
    print(f"  Klik salah satu tombol \"Resi contoh\" — tidak perlu mengetik 32 karakter.{RESET}\n")
    return 0


def tampilkan():
    print(f"\n{TEBAL}Endpoint:{RESET} {REDUP}{API}/api/v1/tracking/{{resi}}{RESET}")

    for nomor, resi in enumerate(RESI, start=1):
        try:
            data, header, _ = ambil(f"{API}/api/v1/tracking/{resi}")
        except Exception as galat:
            print(f"\n{MERAH}Resi {resi} gagal: {galat}{RESET}")
            continue

        isi = data["data"]
        print(f"\n{TEBAL}--- Resi {nomor}: {isi['waybill_number']} ---{RESET}")
        print(f"  status        : {isi['order_status']}")
        print(f"  tahap aktif   : {TEBAL}{isi['current_milestone_stage']}{RESET}")
        print(f"  estimasi tiba : {TEBAL}{isi['formatted_eta']}{RESET}")
        print(f"  keterlambatan : {'ya — ' + str(isi['logistics_delay_reason']) if isi['has_delay'] else 'tidak ada'}")
        print(f"  waktu proses  : {REDUP}{header.get('X-Waktu-Ms', '?')} ms{RESET}")

        print(f"\n  {TEBAL}Empat tahap milestone:{RESET}")
        for tahap in isi["milestone_stages"]:
            if tahap["current"]:
                tanda, warna = ">", KUNING
            elif tahap["completed"]:
                tanda, warna = "x", HIJAU
            else:
                tanda, warna = " ", REDUP
            penanda = f"  {warna}[{tanda}]{RESET} {tahap['stage']:<14} {tahap['label']}"
            if tahap["current"]:
                penanda += f"  {KUNING}<- tahap aktif{RESET}"
            print(penanda)

        narasi = isi.get("ai_narrative")
        if narasi:
            sumber = "fallback" if narasi.get("is_fallback") else narasi.get("provider")
            print(f"\n  {TEBAL}Narasi ({sumber}):{RESET}")
            print(f"  {REDUP}{narasi['text']}{RESET}")

    print()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "tampil":
        tampilkan()
    else:
        sys.exit(cek_kesiapan())
