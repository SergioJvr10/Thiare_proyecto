import type { Unit } from "@/generated/prisma/client";

export const UNIT_LABELS: Record<Unit, string> = {
  KG: "kilogramo (kg)",
  GRAM: "gramo (g)",
  LITER: "litro (L)",
  ML: "mililitro (ml)",
  UNIT: "unidad",
  TRAY: "bandeja",
  PACKAGE: "paquete",
};

export const UNIT_SHORT: Record<Unit, string> = {
  KG: "kg",
  GRAM: "g",
  LITER: "L",
  ML: "ml",
  UNIT: "u.",
  TRAY: "band.",
  PACKAGE: "paq.",
};

export const UNIT_OPTIONS = Object.entries(UNIT_LABELS).map(([value, label]) => ({
  value: value as Unit,
  label,
}));

/** Unidades donde tiene sentido indicar cuánto trae cada envase/paquete */
export const UNITS_WITH_PACKAGE = new Set<Unit>([
  "GRAM",
  "ML",
  "KG",
  "LITER",
  "PACKAGE",
  "TRAY",
  "UNIT",
]);

export function packageSizeLabel(unit: Unit): string {
  switch (unit) {
    case "GRAM":
      return "Gramos por envase/paquete";
    case "ML":
      return "Mililitros por envase";
    case "KG":
      return "Kilos por saco/envase";
    case "LITER":
      return "Litros por envase";
    case "TRAY":
      return "Huevos (u.) por bandeja";
    case "PACKAGE":
      return "Cantidad por paquete";
    case "UNIT":
      return "Unidades por envase";
    default:
      return "Cantidad por envase";
  }
}

export function formatPackageHint(
  packageSize: number | null | undefined,
  unit: Unit,
): string | null {
  if (!packageSize || packageSize <= 0) return null;
  return `1 envase = ${packageSize} ${UNIT_SHORT[unit]}`;
}
