import Spinner from "@/shared/ui/Spinner";

export default function Loader({ label = "Memuat", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Spinner />
      <span>{label}</span>
    </span>
  );
}