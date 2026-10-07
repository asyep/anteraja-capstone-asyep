import Button from "@/shared/ui/Button";
import ErrorAlert from "@/shared/ui/ErrorAlert";
import Input from "@/shared/ui/Input";
import Loader from "@/shared/ui/Loader";
import { isValidWaybill } from "@/shared/lib/formatters";

export default function SearchBox({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  loading,
  errorMessage,
}) {
  const isValid = isValidWaybill(searchQuery);
  const isError = searchQuery.length > 0 && !isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    onSearch(searchQuery.trim());
  };

  return (
    <div className="max-w-2xl mt-4">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/60 p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-magenta/5 rounded-bl-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-ink mb-1">Lacak Pengiriman</h2>
          <p className="text-sm text-muted mb-5">
            Masukkan nomor resi untuk mengetahui status terkini.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  name="waybill_number"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Masukkan 32 karakter nomor resi"
                  minLength={32}
                  maxLength={32}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={isError}
                  disabled={loading}
                  className={`w-full px-5 py-3.5 rounded-2xl border bg-canvas focus:bg-white transition-all duration-200 outline-none font-mono text-sm
                    ${
                      isError || errorMessage
                        ? "border-brand text-brand focus:border-brand focus:ring-4 focus:ring-brand/10"
                        : "border-stone-200 focus:border-magenta focus:ring-4 focus:ring-magenta/10"
                    }
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid || loading}
                className={`sm:w-auto py-3.5 px-8 rounded-2xl font-bold transition-all duration-200 flex justify-center items-center shrink-0
                  ${
                    !isValid || loading
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                      : "bg-magenta text-white hover:bg-magenta-alt active:scale-95 shadow-lg shadow-magenta/20"
                  }`}
              >
                {loading ? <Loader label="Mencari" /> : "Lacak Paket"}
              </Button>
            </div>

            {isError && <ErrorAlert>Nomor resi harus persis 32 karakter.</ErrorAlert>}
            {!isError && <ErrorAlert>{errorMessage}</ErrorAlert>}
          </form>
        </div>
      </div>
    </div>
  );
}
