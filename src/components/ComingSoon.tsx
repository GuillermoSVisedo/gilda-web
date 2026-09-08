const WHATSAPP_LINK = "https://wa.me/34614934915";

export default function ComingSoon() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
        Cómo comprar
      </span>
      <h2 className="mt-4 font-serif text-4xl text-charcoal">
        Ya puedes ver nuestro stock real
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-charcoal-soft leading-relaxed">
        Las colecciones de esta web muestran la disponibilidad real de cada
        prenda en tienda. El pago online llegará más adelante — mientras
        tanto, resérvalo por WhatsApp o pásate por la tienda.
      </p>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-olive-dark px-8 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
      >
        Reservar por WhatsApp
      </a>
    </section>
  );
}
