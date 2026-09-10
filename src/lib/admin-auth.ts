import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "gilda_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "Falta ADMIN_PASSWORD en el entorno. Añádela a .env.local (ver .env.example)."
    );
  }
  return password;
}

// La cookie no guarda la contraseña en claro, sino un hash derivado de ella
// — así no se puede leer la contraseña aunque alguien vea la cookie.
function expectedToken(): string {
  return createHash("sha256")
    .update(`${getAdminPassword()}:gilda-admin-session`)
    .digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && token === expectedToken();
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
