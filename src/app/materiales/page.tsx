import { PageHeader } from "@/components/PageHeader";
import { MaterialForm } from "@/components/MaterialForm";
import { DeleteForm } from "@/components/DeleteForm";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { UNIT_LABELS, UNIT_SHORT, formatPackageHint } from "@/lib/units";
import { createMaterial, deleteMaterial } from "@/app/actions/materials";

export default async function MaterialesPage() {
  const materials = await prisma.material.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Insumos"
        description="Precio por kilo, gramo, bandeja de huevos, etc."
      />

      <MaterialForm action={createMaterial} />

      <ul className="space-y-3">
        {materials.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-stone-500">
            Aún no hay insumos. Agrega harina, huevos u otros materiales.
          </li>
        )}
        {materials.map((m) => {
          const pkg = formatPackageHint(m.packageSize, m.unit);
          return (
            <li
              key={m.id}
              className="rounded-2xl border border-rose-50 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">{m.name}</p>
                  <p className="text-sm text-stone-500">
                    {UNIT_LABELS[m.unit]} · {formatMoney(m.pricePerUnit)} /{" "}
                    {UNIT_SHORT[m.unit]}
                  </p>
                  {pkg && (
                    <p className="mt-1 text-xs text-rose-700">{pkg}</p>
                  )}
                  {m.notes && (
                    <p className="mt-1 text-xs text-stone-400">{m.notes}</p>
                  )}
                </div>
                <DeleteForm action={deleteMaterial} id={m.id} label="Eliminar" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
