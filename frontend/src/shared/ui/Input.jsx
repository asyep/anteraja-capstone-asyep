export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`min-w-0 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#EC008C] focus:ring-4 focus:ring-[#EC008C]/10 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}