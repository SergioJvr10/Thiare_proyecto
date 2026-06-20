import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/format";
import { createSale, deleteSale } from "@/app/actions/sales";
import { SaleForm } from "@/components/SaleForm";
import { DeleteForm } from "@/components/DeleteForm";

export default async function VentasPage() {
  const [products, sales] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.sale.findMany({
      orderBy: { date: "desc" },
      take: 40,
      include: { product: true },
    }),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Ventas"
        description="Registra lo que vendiste cada día"
      />

      {products.length === 0 ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Primero crea productos con su precio de venta.
        </p>
      ) : (
        <SaleForm products={products} today={today} action={createSale} />
      )}

      <h2 className="mb-3 font-semibold text-stone-900">Historial reciente</h2>
      <ul className="space-y-2">
        {sales.length === 0 && (
          <li className="text-center text-sm text-stone-500">Sin ventas registradas</li>
        )}
        {sales.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-stone-900">{s.product.name}</p>
              <p className="text-xs text-stone-500">
                {s.quantity} × {formatMoney(s.unitPrice)} · {formatDate(s.date)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-700">
                {formatMoney(s.quantity * s.unitPrice)}
              </span>
              <DeleteForm
                action={deleteSale}
                id={s.id}
                label="×"
                className="text-xs text-stone-400 hover:text-rose-600 px-1"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
