export default function ErrorAlert({ children, className = "" }) {
  if (!children) return null;

  return (
    <p
      className={`rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 ${className}`}
      role="alert"
    >
      {children}
    </p>
  );
}