import { useEffect, useState } from 'react';

const WAYBILL_PATTERN = /^[A-Za-z0-9]{32}$/;

export default function ShipmentForm({ onSearch, loading, initialValue = '', errorMessage }) {
  const [waybill, setWaybill] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const isValid = WAYBILL_PATTERN.test(waybill.trim());
  const showValidation = touched && waybill.length > 0 && !isValid;

  useEffect(() => setWaybill(initialValue), [initialValue]);
  useEffect(() => {
    if (errorMessage) setErrorDismissed(false);
  }, [errorMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid || loading) return;
    onSearch(waybill.trim());
  };

  return (
    <section id="pelacakan" className="rounded-3xl border border-stone-100 bg-white p-4 shadow-[0_18px_50px_-35px_rgba(68,28,49,.38)] sm:p-6" aria-labelledby="search-title">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-brand">Pelacakan cerdas Anteraja</p>
          <h1 id="search-title" className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Paketmu sampai mana?</h1>
          <p className="mt-1 text-sm text-muted">Masukkan nomor resi untuk melihat perjalanan dan estimasi terbaru.</p>
        </div>
        <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">✦ Satria AI Tracking</span>
      </div>
      <form className="mt-5" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl border bg-stone-50 px-4 transition focus-within:border-brand ${showValidation ? 'border-red-400' : 'border-stone-200'}`}>
            <span aria-hidden="true" className="text-xl font-bold text-stone-400">#</span>
            <label className="sr-only" htmlFor="input-resi">Nomor resi</label>
            <input id="input-resi" name="waybill_number" value={waybill} onChange={(event) => { setWaybill(event.target.value); setTouched(true); setErrorDismissed(true); }} onBlur={() => setTouched(true)} autoComplete="off" spellCheck="false" maxLength={32} placeholder="Masukkan nomor resi 32 karakter" aria-invalid={showValidation || Boolean(errorMessage && !errorDismissed)} aria-describedby="resi-hint" className="min-w-0 flex-1 bg-transparent py-4 font-mono text-sm font-semibold tracking-wide text-ink outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-stone-400" />
            <span className="hidden text-xs text-stone-400 sm:block">{waybill.length}/32</span>
          </div>
          <button id="btn-lacak" type="submit" disabled={!isValid || loading} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-brand px-7 font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Mencari…</> : <>⌕ <span>Lacak Paket</span></>}
          </button>
        </div>
        <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          <p id="resi-hint" className="text-stone-500">Resi harus terdiri dari 32 karakter alfanumerik.</p>
          {showValidation && <p id="resi-error" role="alert" className="font-semibold text-red-600">Nomor resi harus 32 karakter alfanumerik.</p>}
          {errorMessage && !errorDismissed && <p id="resi-error" role="alert" className="font-semibold text-red-600">{errorMessage}</p>}
        </div>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">Coba resi demo</span>
        {[
          ['00010242fe8c5a6d1ba2dd792cb16214', 'Normal'],
          ['0008288aa423d2a3f00fcb17cd7d8719', 'Kendala'],
          ['11111111111111111111111111111111', 'Tiba'],
          ['22222222222222222222222222222222', 'Dibatalkan'],
        ].map(([number, label]) => <button type="button" key={number} onClick={() => { setWaybill(number); setTouched(false); }} className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-semibold text-stone-600 transition hover:bg-pink-100 hover:text-brand">{label}</button>)}
      </div>
    </section>
  );
}
