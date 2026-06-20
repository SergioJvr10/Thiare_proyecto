import { PageHeader } from "@/components/PageHeader";
import { PurchaseForm } from "@/components/PurchaseForm";
import { DeleteForm } from "@/components/DeleteForm";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/format";
import { UNIT_SHORT } from "@/lib/units";
import { createPurchase, deletePurchase } from "@/app/actions/purchases";

export default async function ComprasPage() {
  const [materials, purchases] = await Promise.all([
    prisma.material.findMany({ orderBy: { name: "asc" } }),
    prisma.purchase.findMany({
      orderBy: { date: "desc" },
      take: 30,
      include: { material: true },
    }),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Compras de insumos"
        description="Registra cuánto pagaste; el precio por unidad se actualiza solo"
      />

      {materials.length === 0 ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Primero agrega insumos en la sección Insumos.
        </p>
      ) : (
        <PurchaseForm materials={materials} today={today} action={createPurchase} />
      )}

      <h2 className="mb-3 font-semibold text-stone-900">Últimas compras</h2>
      <ul className="space-y-2">
        {purchases.length === 0 && (
          <li className="text-center text-sm text-stone-500">Sin compras aún</li>
        )}
        {purchases.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-stone-900">{p.material.name}</p>
              <p className="text-xs text-stone-500">
                {p.quantity} {UNIT_SHORT[p.material.unit]} · {formatDate(p.date)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatMoney(p.totalPaid)}</span>
              <DeleteForm
                action={deletePurchase}
                id={p.id}
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
