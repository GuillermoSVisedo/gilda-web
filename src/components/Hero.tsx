export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-24 overflow-hidden border-b border-line/70"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, var(--color-olive) 0%, transparent 45%), radial-gradient(circle at 85% 0%, var(--color-olive) 0%, transparent 40%), var(--color-cream)",
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
          Moda femenina
        </span>
        <h1 className="mt-6 max-w-3xl text-balance font-serif text-5xl leading-tight text-charcoal sm:text-6xl">
          Prendas con carácter, pensadas para cada mujer
        </h1>
        <p className="mt-6 max-w-xl text-balance text-base text-charcoal-soft sm:text-lg">
          Gilda es una tienda de ropa de mujer donde cuidamos cada detalle,
          desde el tejido hasta el acabado. Ven a conocernos.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#colecciones"
            className="rounded-full bg-olive-dark px-8 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
          >
            Ver colecciones
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-olive-dark px-8 py-3 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
          >
            Visítanos
          </a>
        </div>
      </div>
    </section>
  );
}
