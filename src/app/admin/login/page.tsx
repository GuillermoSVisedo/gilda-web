import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export const metadata = { title: "Acceso | Gilda" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <span className="font-serif text-3xl tracking-[0.2em] text-olive-dark">
        GILDA
      </span>
      <h1 className="mt-2 text-sm text-charcoal-soft">Panel privado</h1>

      <form action={loginAction} className="mt-8 flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          autoFocus
          className="rounded-full border border-line/70 bg-white px-5 py-2.5 text-sm text-charcoal focus:border-olive-dark focus:outline-none"
        />

        {error && (
          <p className="text-sm text-red-700">Contraseña incorrecta.</p>
        )}

        <button
          type="submit"
          className="rounded-full bg-olive-dark px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
