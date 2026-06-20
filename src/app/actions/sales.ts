"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createSale(formData: FormData) {
  const productId = String(formData.get("productId"));
  const quantity = Number(formData.get("quantity"));
  const unitPrice = Number(formData.get("unitPrice"));
  const dateStr = String(formData.get("date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!productId || !quantity || quantity <= 0 || !unitPrice || unitPrice <= 0) {
    redirect("/ventas?error=datos");
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.sale.create({
    data: { productId, quantity, unitPrice, date, notes },
  });

  revalidatePath("/ventas");
  revalidatePath("/");
  redirect("/ventas");
}

export async function deleteSale(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/ventas");

  await prisma.sale.delete({ where: { id } });
  revalidatePath("/ventas");
  revalidatePath("/");
  redirect("/ventas");
}
