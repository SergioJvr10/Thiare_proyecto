"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Unit } from "@/generated/prisma/client";

function parsePackageSize(formData: FormData): number | null {
  const raw = String(formData.get("packageSize") ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return n > 0 ? n : null;
}

function resolvePricePerUnit(formData: FormData, packageSize: number | null): number {
  const mode = String(formData.get("priceMode") ?? "per_unit");
  const pricePerPackage = Number(formData.get("pricePerPackage"));
  const pricePerUnit = Number(formData.get("pricePerUnit"));

  if (
    mode === "per_package" &&
    packageSize &&
    packageSize > 0 &&
    pricePerPackage > 0
  ) {
    return pricePerPackage / packageSize;
  }
  return pricePerUnit;
}

export async function createMaterial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "KG") as Unit;
  const packageSize = parsePackageSize(formData);
  const pricePerUnit = resolvePricePerUnit(formData, packageSize);
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name || !pricePerUnit || pricePerUnit <= 0) {
    redirect("/materiales?error=precio");
  }

  await prisma.material.create({
    data: { name, unit, pricePerUnit, packageSize, notes },
  });

  revalidatePath("/materiales");
  revalidatePath("/productos");
  revalidatePath("/compras");
  revalidatePath("/");
  redirect("/materiales");
}

export async function updateMaterial(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "KG") as Unit;
  const packageSize = parsePackageSize(formData);
  const pricePerUnit = resolvePricePerUnit(formData, packageSize);
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!id || !name || !pricePerUnit || pricePerUnit <= 0) {
    redirect("/materiales?error=datos");
  }

  await prisma.material.update({
    where: { id },
    data: { name, unit, pricePerUnit, packageSize, notes },
  });

  revalidatePath("/materiales");
  revalidatePath("/productos");
  revalidatePath("/compras");
  revalidatePath("/");
  redirect("/materiales");
}

export async function deleteMaterial(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/materiales");

  await prisma.material.delete({ where: { id } });
  revalidatePath("/materiales");
  revalidatePath("/productos");
  revalidatePath("/compras");
  revalidatePath("/");
  redirect("/materiales");
}
