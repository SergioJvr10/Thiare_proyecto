"use client";

import { useMemo, useState } from "react";
import { UNIT_SHORT, formatPackageHint } from "@/lib/units";
import type { Unit } from "@/generated/prisma/client";

type MaterialOption = {
  id: string;
  name: string;
  unit: Unit;
  packageSize: number | null;
};

type PurchaseFormProps = {
  materials: MaterialOption[];
  today: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function PurchaseForm({ materials, today, action }: PurchaseFormProps) {
  const [materialId, setMaterialId] = useState("");
  const [buyByPackage, setBuyByPackage] = useState(false);

  const selected = useMemo(
    () => materials.find((m) => m.id === materialId),
    [materials, materialId],
  );

  const hasPackage =
    selected?.packageSize != null && selected.packageSize > 0;

  const packageHint = selected
    ? formatPackageHint(selected.packageSize, selected.unit)
    : null;

  return (
    <form
      action={action}
      className="mb-8 space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
    >
      <p className="font-semibold text-stone-900">Nueva compra</p>
      <select
        name="materialId"
        required
        value={materialId}
        onChange={(e) => {
          setMaterialId(e.target.value);
          setBuyByPackage(false);
        }}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
      >
        <option value="">Selecciona insumo</option>
        {materials.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({UNIT_SHORT[m.unit]}
            {m.packageSize ? ` · envase ${m.packageSize}${UNIT_SHORT[m.unit]}` : ""})
          </option>
        ))}
      </select>

      {hasPackage && (
        <div className="rounded-xl bg-rose-50/80 p-3 space-y-2">
          <p className="text-xs text-stone-700">{packageHint}</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={buyByPackage}
              onChange={(e) => setBuyByPackage(e.target.checked)}
            />
            Compré por envases/paquetes
          </label>
          <input
            type="hidden"
            name="buyByPackage"
            value={buyByPackage ? "1" : "0"}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          name="quantity"
          type="number"
          min="0.01"
          step="0.01"
          placeholder={
            buyByPackage && hasPackage
              ? "Cant. de envases"
              : `Cantidad (${selected ? UNIT_SHORT[selected.unit] : ""})`
          }
          required
          className="rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <input
          name="totalPaid"
          type="number"
          min="1"
          step="1"
          placeholder="Total pagado ($)"
          required
          className="rounded-xl border border-stone-200 px-3 py-2.5"
        />
      </div>
      {buyByPackage && hasPackage && selected && (
        <p className="text-xs text-stone-500">
          Total en {UNIT_SHORT[selected.unit]}: cantidad × {selected.packageSize}
        </p>
      )}
      <input
        name="date"
        type="date"
        defaultValue={today}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
      />
      <input
        name="notes"
        placeholder="Notas (opcional)"
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700"
      >
        Registrar compra
      </button>
    </form>
  );
}
