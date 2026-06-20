"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createPurchase(formData: FormData) {
  const materialId = String(formData.get("materialId"));
  let quantity = Number(formData.get("quantity"));
  const totalPaid = Number(formData.get("totalPaid"));
  const dateStr = String(formData.get("date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const buyByPackage = String(formData.get("buyByPackage") ?? "0") === "1";

  if (!materialId || !quantity || quantity <= 0 || !totalPaid || totalPaid <= 0) {
    redirect("/compras?error=datos");
  }

  const material = await prisma.material.findUnique({ where: { id: materialId } });
  if (!material) redirect("/compras?error=insumo");

  if (
    buyByPackage &&
    material.packageSize != null &&
    material.packageSize > 0
  ) {
    quantity = quantity * material.packageSize;
  }

  const pricePerUnit = totalPaid / quantity;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.$transaction([
    prisma.purchase.create({
      data: { materialId, quantity, totalPaid, date, notes },
    }),
    prisma.material.update({
      where: { id: materialId },
      data: { pricePerUnit },
    }),
  ]);

  revalidatePath("/compras");
  revalidatePath("/materiales");
  revalidatePath("/productos");
  revalidatePath("/");
  redirect("/compras");
}

export async function deletePurchase(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/compras");

  await prisma.purchase.delete({ where: { id } });
  revalidatePath("/compras");
  revalidatePath("/");
  redirect("/compras");
}
