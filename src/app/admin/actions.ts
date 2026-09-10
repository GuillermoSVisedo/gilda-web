"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { deleteProductPhoto, uploadProductPhoto } from "@/lib/cloudinary";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");

  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

// Cada Server Action verifica la sesión por su cuenta — no basta con que la
// página que la llama esté protegida, porque una Server Action es un
// endpoint invocable por su cuenta (recomendación oficial de Next.js).
export async function uploadPhotoAction(
  slug: string,
  formData: FormData
): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado");
  }

  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;
    await uploadProductPhoto(slug, dataUri);
  }

  revalidatePath(`/admin/producto/${slug}`);
  revalidatePath(`/producto/${slug}`);
}

export async function deletePhotoAction(
  publicId: string,
  slug: string
): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado");
  }

  await deleteProductPhoto(publicId);

  revalidatePath(`/admin/producto/${slug}`);
  revalidatePath(`/producto/${slug}`);
}
