export default function ShipmentForm({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  loading,
  errorMessage,
}) {
  // Real-time validation
  const isValid = /^[a-z0-9]{32}$/i.test(searchQuery.trim());
  const isError = searchQuery.length > 0 && !isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    onSearch(searchQuery);
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
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Masukkan 32 karakter nomor resi"
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

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`sm:w-auto py-3.5 px-8 rounded-2xl font-bold transition-all duration-200 flex justify-center items-center shrink-0
                  ${
                    !isValid || loading
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                      : "bg-magenta text-white hover:bg-magenta-alt active:scale-95 shadow-lg shadow-magenta/20"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mencari
                  </span>
                ) : (
                  "Lacak Paket"
                )}
              </button>
            </div>

            {isError && (
              <p className="text-sm text-brand font-semibold px-2 animate-pulse">
                Nomor resi harus persis 32 karakter
              </p>
            )}
            {!isError && errorMessage && (
              <p className="text-sm text-brand font-semibold px-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
