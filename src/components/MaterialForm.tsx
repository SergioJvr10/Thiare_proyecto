"use client";

import { useState } from "react";
import {
  UNIT_OPTIONS,
  UNITS_WITH_PACKAGE,
  packageSizeLabel,
  UNIT_SHORT,
} from "@/lib/units";
import type { Unit } from "@/generated/prisma/client";

type MaterialFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function MaterialForm({ action }: MaterialFormProps) {
  const [unit, setUnit] = useState<Unit>("KG");
  const showPackage = UNITS_WITH_PACKAGE.has(unit);

  return (
    <form
      action={action}
      className="mb-8 space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
    >
      <p className="font-semibold text-stone-900">Agregar insumo</p>
      <input
        name="name"
        placeholder="Ej: Harina, Huevos, Mantequilla"
        required
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-rose-400"
      />
      <select
        name="unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value as Unit)}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-rose-400"
      >
        {UNIT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {showPackage && (
        <div className="rounded-xl bg-rose-50/80 p-3 space-y-2">
          <label className="block text-sm font-medium text-stone-800">
            {packageSizeLabel(unit)}
          </label>
          <input
            name="packageSize"
            type="number"
            min="0.01"
            step="0.01"
            placeholder={
              unit === "GRAM"
                ? "Ej: 500 (bolsa de 500 g)"
                : unit === "TRAY"
                  ? "Ej: 30 (huevos por bandeja)"
                  : "Ej: 1"
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5"
          />
          <p className="text-xs text-stone-600">
            Opcional. Sirve al comprar por envases y para calcular el precio por{" "}
            {UNIT_SHORT[unit]}.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-stone-100 p-3 space-y-2">
        <p className="text-sm font-medium text-stone-800">Precio</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="priceMode" value="per_unit" defaultChecked />
          Por {UNIT_SHORT[unit]} (ej: $ por gramo)
        </label>
        <input
          name="pricePerUnit"
          type="number"
          min="0.01"
          step="0.01"
          placeholder={`Precio por ${UNIT_SHORT[unit]}`}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        />
        {showPackage && (
          <>
            <label className="flex items-center gap-2 text-sm mt-2">
              <input type="radio" name="priceMode" value="per_package" />
              Por envase/paquete completo
            </label>
            <input
              name="pricePerPackage"
              type="number"
              min="1"
              step="1"
              placeholder="Precio del envase (ej: bolsa $2.000)"
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
          </>
        )}
      </div>

      <input
        name="notes"
        placeholder="Notas (opcional)"
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-rose-400"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700"
      >
        Guardar insumo
      </button>
    </form>
  );
}
