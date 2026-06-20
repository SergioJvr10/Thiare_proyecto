import type { Material, RecipeItem } from "@/generated/prisma/client";

type RecipeWithMaterial = RecipeItem & { material: Material };

export function productUnitCost(recipeItems: RecipeWithMaterial[]): number {
  return recipeItems.reduce(
    (sum, item) => sum + item.quantity * item.material.pricePerUnit,
    0,
  );
}

export function productMargin(salePrice: number, unitCost: number): number {
  return salePrice - unitCost;
}

export function marginPercent(salePrice: number, unitCost: number): number {
  if (salePrice <= 0) return 0;
  return ((salePrice - unitCost) / salePrice) * 100;
}
