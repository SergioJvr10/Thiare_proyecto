import { formatMoney } from "@/lib/format";

type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
  variant?: "default" | "positive" | "negative";
};

export function StatCard({ label, value, hint, variant = "default" }: StatCardProps) {
  const valueClass =
    variant === "positive"
      ? "text-emerald-700"
      : variant === "negative"
        ? "text-rose-700"
        : "text-stone-900";

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold ${valueClass}`}>{formatMoney(value)}</p>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}
