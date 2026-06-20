"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const salePrice = Number(formData.get("salePrice"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name || !salePrice || salePrice <= 0) {
    redirect("/productos?error=datos");
  }

  await prisma.product.create({
    data: { name, salePrice, notes },
  });

  revalidatePath("/productos");
  revalidatePath("/ventas");
  redirect("/productos");
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const salePrice = Number(formData.get("salePrice"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!id || !name || !salePrice || salePrice <= 0) {
    redirect(`/productos/${id}?error=datos`);
  }

  await prisma.product.update({
    where: { id },
    data: { name, salePrice, notes },
  });

  revalidatePath("/productos");
  revalidatePath(`/productos/${id}`);
  revalidatePath("/ventas");
  revalidatePath("/");
  redirect(`/productos/${id}`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/productos");

  await prisma.product.delete({ where: { id } });
  revalidatePath("/productos");
  revalidatePath("/ventas");
  revalidatePath("/");
  redirect("/productos");
}

export async function addRecipeItem(formData: FormData) {
  const productId = String(formData.get("productId"));
  const materialId = String(formData.get("materialId"));
  const quantity = Number(formData.get("quantity"));

  if (!productId || !materialId || !quantity || quantity <= 0) {
    redirect(`/productos/${productId}?error=receta`);
  }

  await prisma.recipeItem.upsert({
    where: { productId_materialId: { productId, materialId } },
    create: { productId, materialId, quantity },
    update: { quantity },
  });

  revalidatePath(`/productos/${productId}`);
  revalidatePath("/productos");
  revalidatePath("/");
  redirect(`/productos/${productId}`);
}

export async function removeRecipeItem(formData: FormData) {
  const id = String(formData.get("recipeItemId") ?? "");
  const productId = String(formData.get("productId") ?? "");

  if (!id || !productId) redirect("/productos");

  await prisma.recipeItem.delete({ where: { id } });
  revalidatePath(`/productos/${productId}`);
  revalidatePath("/productos");
  revalidatePath("/");
  redirect(`/productos/${productId}`);
}
