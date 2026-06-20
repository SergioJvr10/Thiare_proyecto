import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { getMonthlyReport } from "@/lib/reports";
import { formatMoney, monthKey } from "@/lib/format";

type HomeProps = {
  searchParams: Promise<{ mes?: string }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const month = params.mes ?? monthKey();
  const report = await getMonthlyReport(month);

  const [year, mon] = month.split("-");
  const monthLabel = new Date(Number(year), Number(mon) - 1, 1).toLocaleDateString(
    "es-CL",
    { month: "long", year: "numeric" },
  );

  const prev = new Date(Number(year), Number(mon) - 2, 1);
  const next = new Date(Number(year), Number(mon), 1);
  const prevKey = monthKey(prev);
  const nextKey = monthKey(next);
  const isCurrentMonth = month === monthKey();

  return (
    <div>
      <PageHeader
        title="Resumen del mes"
        description="Ventas, gastos en insumos y ganancia estimada"
      />

      <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
        <Link
          href={`/?mes=${prevKey}`}
          className="rounded-lg px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-stone-800"
        >
          ← Anterior
        </Link>
        <span className="text-center text-sm font-semibold capitalize text-stone-800">
          {monthLabel}
        </span>
        {!isCurrentMonth ? (
          <Link
            href={`/?mes=${nextKey}`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-stone-800"
          >
            Siguiente →
          </Link>
        ) : (
          <span className="w-20" />
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Ventas del mes" value={report.totalSales} />
        <StatCard
          label="Gasto en insumos"
          value={report.totalPurchases}
          hint={`${report.purchaseCount} compra(s) registrada(s)`}
          variant="negative"
        />
        <StatCard
          label="Costo de lo vendido"
          value={report.costOfGoodsSold}
          hint="Según recetas e insumos actuales"
        />
        <StatCard
          label="Ganancia bruta"
          value={report.grossProfit}
          hint="Ventas − costo de productos vendidos"
          variant={report.grossProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Balance simple del mes
        </p>
        <p className="mt-1 text-2xl font-bold text-amber-800 dark:text-amber-300">
          {formatMoney(report.netEstimate)}
        </p>
        <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
          Ventas menos lo que pagaste en insumos este mes
        </p>
      </div>

      {report.salesByProduct.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-stone-900">Por producto</h2>
          <ul className="space-y-2">
            {report.salesByProduct.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-stone-900">{row.name}</p>
                  <p className="text-xs text-stone-500">{row.qty} vendido(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-900">{formatMoney(row.revenue)}</p>
                  <p className="text-xs text-emerald-700">
                    +{formatMoney(row.revenue - row.cost)} margen
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <QuickLink href="/materiales" title="Insumos" desc="Harina, huevos, etc." />
        <QuickLink href="/compras" title="Registrar compra" desc="Actualiza precios" />
        <QuickLink href="/productos" title="Productos" desc="Recetas y precios" />
        <QuickLink href="/ventas" title="Nueva venta" desc="Registra lo que vendiste" />
      </section>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:border-rose-300 hover:shadow"
    >
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="text-sm text-stone-500">{desc}</p>
    </Link>
  );
}
