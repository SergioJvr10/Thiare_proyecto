import { prisma } from "@/lib/prisma";
import { productUnitCost } from "@/lib/calculations";
import { parseMonthKey } from "@/lib/format";

export async function getMonthlyReport(month: string) {
  const { start, end } = parseMonthKey(month);

  const [sales, purchases, products] = await Promise.all([
    prisma.sale.findMany({
      where: { date: { gte: start, lte: end } },
      include: { product: { include: { recipeItems: { include: { material: true } } } } },
    }),
    prisma.purchase.findMany({
      where: { date: { gte: start, lte: end } },
    }),
    prisma.product.findMany({
      include: { recipeItems: { include: { material: true } } },
    }),
  ]);

  const totalSales = sales.reduce((s, v) => s + v.quantity * v.unitPrice, 0);

  const totalPurchases = purchases.reduce((s, p) => s + p.totalPaid, 0);

  const costOfGoodsSold = sales.reduce((s, v) => {
    const unitCost = productUnitCost(v.product.recipeItems);
    return s + v.quantity * unitCost;
  }, 0);

  const grossProfit = totalSales - costOfGoodsSold;
  const netEstimate = totalSales - totalPurchases;

  const salesByProduct = sales.reduce<
    Record<string, { name: string; qty: number; revenue: number; cost: number }>
  >((acc, v) => {
    const key = v.productId;
    const unitCost = productUnitCost(v.product.recipeItems);
    if (!acc[key]) {
      acc[key] = { name: v.product.name, qty: 0, revenue: 0, cost: 0 };
    }
    acc[key].qty += v.quantity;
    acc[key].revenue += v.quantity * v.unitPrice;
    acc[key].cost += v.quantity * unitCost;
    return acc;
  }, {});

  return {
    month,
    totalSales,
    totalPurchases,
    costOfGoodsSold,
    grossProfit,
    netEstimate,
    salesCount: sales.length,
    purchaseCount: purchases.length,
    productsWithRecipe: products.filter((p) => p.recipeItems.length > 0).length,
    salesByProduct: Object.values(salesByProduct).sort((a, b) => b.revenue - a.revenue),
  };
}
