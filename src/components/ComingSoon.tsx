// TODO: sustituye por el email real donde queréis recibir avisos de interés.
const CONTACT_EMAIL = "hola@gilda.com";

export default function ComingSoon() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
        Muy pronto
      </span>
      <h2 className="mt-4 font-serif text-4xl text-charcoal">
        Tienda online conectada a nuestro stock real
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-charcoal-soft leading-relaxed">
        Estamos preparando la tienda online de Gilda, sincronizada con la
        disponibilidad real de cada prenda. Mientras tanto, escríbenos y te
        contamos qué tenemos disponible ahora mismo.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-8 inline-block rounded-full bg-olive-dark px-8 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
      >
        Avísame cuando esté lista
      </a>
    </section>
  );
}
