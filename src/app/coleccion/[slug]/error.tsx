"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CollectionError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
            Vaya
          </span>
          <h1 className="mt-4 font-serif text-3xl text-charcoal">
            No hemos podido cargar esta colección
          </h1>
          <p className="mt-4 text-charcoal-soft">
            Puede que estemos actualizando el stock en este momento.
            Inténtalo de nuevo en unos segundos.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => retry()}
              className="rounded-full bg-olive-dark px-8 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
            >
              Reintentar
            </button>
            <Link
              href="/#colecciones"
              className="rounded-full border border-olive-dark px-8 py-3 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
            >
              Ver todas las colecciones
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
