import React from "react";
import { LACAK_CONTACT } from "../../data/lacakContent";
import TrackingFaq from "./TrackingFaq";

/** Kartu bantuan Satria Care + daftar FAQ populer. */
export default function HelpAndFaq() {
  return (
    <section className="mb-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-lg lg:col-span-5">
        <div className="relative z-10">
          <span className="mb-4 inline-block rounded-full bg-on-primary/10 px-3 py-1 font-label-sm text-label-sm font-bold uppercase text-on-primary">
            Bantuan Langsung
          </span>
          <h2 className="mb-3 font-headline-lg text-headline-lg font-extrabold text-on-primary">
            Butuh Bantuan Pelacakan Khusus?
          </h2>
          <p className="mb-6 font-body-md text-body-md text-on-primary/90">
            Tim Satria Care beroperasi 24 jam sehari untuk membantu kendala nomor
            resi tidak ditemukan, salah alamat, atau perubahan instruksi
            pengantaran.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-secondary-container px-5 font-label-md text-label-md font-bold text-on-secondary-fixed shadow-md transition-all hover:bg-secondary-fixed-dim"
              href={LACAK_CONTACT.whatsapp}
              rel="noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>
              WhatsApp Satria Care
            </a>
            <a
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-5 font-label-md text-label-md font-bold text-primary transition-all hover:bg-surface-subtle"
              href={LACAK_CONTACT.hotline}
            >
              <span className="material-symbols-outlined text-[18px]">
                call
              </span>
              Hotline 24 Jam
            </a>
          </div>
        </div>
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="lg:col-span-7">
        <TrackingFaq />
      </div>
    </section>
  );
}
