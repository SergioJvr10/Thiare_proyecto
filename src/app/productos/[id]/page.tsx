import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { DeleteForm } from "@/components/DeleteForm";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { UNIT_SHORT, formatPackageHint } from "@/lib/units";
import { productUnitCost, marginPercent } from "@/lib/calculations";
import {
  addRecipeItem,
  removeRecipeItem,
  updateProduct,
  deleteProduct,
} from "@/app/actions/products";

type Props = { params: Promise<{ id: string }> };

export default async function ProductoDetailPage({ params }: Props) {
  const { id } = await params;

  const [product, materials] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { recipeItems: { include: { material: true } } },
    }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const unitCost = productUnitCost(product.recipeItems);
  const margin = marginPercent(product.salePrice, unitCost);

  return (
    <div>
      <Link href="/productos" className="mb-4 inline-block text-sm text-rose-600">
        ← Productos
      </Link>

      <PageHeader title={product.name} description="Receta y precio de venta" />

      <form
        action={updateProduct}
        className="mb-6 space-y-3 rounded-2xl bg-white p-4 shadow-sm"
      >
        <input type="hidden" name="id" value={product.id} />
        <input
          name="name"
          defaultValue={product.name}
          required
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <input
          name="salePrice"
          type="number"
          min="1"
          defaultValue={product.salePrice}
          required
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <button
          type="submit"
          className="w-full rounded-xl border border-rose-200 py-2 text-sm font-medium text-rose-700"
        >
          Guardar cambios
        </button>
      </form>

      <div className="mb-6 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-xs text-stone-500">Venta</p>
          <p className="font-bold">{formatMoney(product.salePrice)}</p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-xs text-stone-500">Costo</p>
          <p className="font-bold">{formatMoney(unitCost)}</p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-xs text-stone-500">Margen</p>
          <p className="font-bold text-emerald-700">{margin.toFixed(0)}%</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-stone-900">Insumos de la receta</h2>

        {materials.length === 0 ? (
          <p className="text-sm text-amber-800">Agrega insumos primero.</p>
        ) : (
          <form
            action={addRecipeItem}
            className="mb-4 space-y-3 rounded-2xl border border-rose-100 bg-white p-4"
          >
            <input type="hidden" name="productId" value={product.id} />
            <select
              name="materialId"
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
            >
              <option value="">Insumo</option>
              {materials.map((m) => {
                const pkg = formatPackageHint(m.packageSize, m.unit);
                return (
                  <option key={m.id} value={m.id}>
                    {m.name} — {formatMoney(m.pricePerUnit)}/{UNIT_SHORT[m.unit]}
                    {pkg ? ` (${pkg})` : ""}
                  </option>
                );
              })}
            </select>
            <input
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Cantidad usada (en la unidad del insumo, ej: gramos)"
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white"
            >
              Agregar a receta
            </button>
          </form>
        )}

        <ul className="space-y-2">
          {product.recipeItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
            >
              <div>
                <p className="font-medium">{item.material.name}</p>
                <p className="text-xs text-stone-500">
                  {item.quantity} {UNIT_SHORT[item.material.unit]} ×{" "}
                  {formatMoney(item.material.pricePerUnit)} ={" "}
                  {formatMoney(item.quantity * item.material.pricePerUnit)}
                </p>
              </div>
              <DeleteForm
                action={removeRecipeItem}
                id={item.id}
                idFieldName="recipeItemId"
                extraFields={{ productId: product.id }}
                label="Quitar"
              />
            </li>
          ))}
        </ul>
      </section>

      <DeleteForm
        action={deleteProduct}
        id={product.id}
        label="Eliminar producto"
        className="w-full rounded-xl py-2 text-sm text-stone-400 hover:text-rose-600"
      />
    </div>
  );
}
