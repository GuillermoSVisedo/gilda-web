"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import {
  createUploadSignature,
  deleteProductPhoto,
  type UploadSignature,
} from "@/lib/cloudinary";

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
//
// El archivo NO se sube a través de esta acción: Vercel rechaza cualquier
// petición de más de 4,5 MB (una foto de móvil normal ya lo supera), así
// que el navegador sube el archivo directamente a Cloudinary usando esta
// firma — ver AdminPhotoUploader.tsx.
export async function createUploadSignatureAction(
  slug: string
): Promise<UploadSignature> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado");
  }

  return createUploadSignature(slug);
}

export async function finalizeUploadAction(slug: string): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado");
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
