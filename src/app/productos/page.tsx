import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { productUnitCost, marginPercent } from "@/lib/calculations";
import { createProduct } from "@/app/actions/products";

export default async function ProductosPage() {
  const products = await prisma.product.findMany({
    include: { recipeItems: { include: { material: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Define qué insumos usa cada cosa que vendes y su precio"
      />

      <form
        action={createProduct}
        className="mb-8 space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
      >
        <p className="font-semibold text-stone-900">Nuevo producto</p>
        <input
          name="name"
          placeholder="Ej: Torta chocolate, Empanadas x12"
          required
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <input
          name="salePrice"
          type="number"
          min="1"
          step="1"
          placeholder="Precio de venta ($)"
          required
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700"
        >
          Crear producto
        </button>
      </form>

      <ul className="space-y-3">
        {products.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-stone-500">
            Crea tu primer producto y luego agrega su receta (insumos).
          </li>
        )}
        {products.map((p) => {
          const cost = productUnitCost(p.recipeItems);
          const margin = marginPercent(p.salePrice, cost);
          const hasRecipe = p.recipeItems.length > 0;

          return (
            <li key={p.id}>
              <Link
                href={`/productos/${p.id}`}
                className="block rounded-2xl border border-rose-50 bg-white p-4 shadow-sm hover:border-rose-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{p.name}</p>
                    <p className="text-sm text-stone-600">
                      Venta: {formatMoney(p.salePrice)}
                    </p>
                  </div>
                  <span className="text-rose-600">→</span>
                </div>
                {hasRecipe ? (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-stone-100 px-2 py-1 text-stone-700">
                      Costo: {formatMoney(cost)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 ${
                        margin >= 30
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Margen {margin.toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-amber-700">
                    Falta agregar insumos de la receta
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
