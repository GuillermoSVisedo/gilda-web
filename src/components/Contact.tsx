// TODO: sustituir todos los datos de esta sección por los reales de la tienda.
const STORE = {
  address: "Calle Ejemplo, 12 — 28000 Madrid",
  phone: "+34 600 000 000",
  email: "hola@gilda.com",
  hours: ["Lunes a viernes: 10:00 – 20:00", "Sábados: 10:00 – 14:00"],
  instagram: "https://instagram.com/gilda",
  whatsapp: "https://wa.me/34600000000",
};

export default function Contact() {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 border-t border-line/70 bg-white/50"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
            Visítanos
          </span>
          <h2 className="mt-4 font-serif text-4xl text-charcoal">
            Te esperamos en tienda
          </h2>

          <dl className="mt-8 space-y-5 text-charcoal-soft">
            <div>
              <dt className="text-xs tracking-wide text-charcoal uppercase">
                Dirección
              </dt>
              <dd className="mt-1">{STORE.address}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-charcoal uppercase">
                Horario
              </dt>
              {STORE.hours.map((line) => (
                <dd className="mt-1" key={line}>
                  {line}
                </dd>
              ))}
            </div>
            <div>
              <dt className="text-xs tracking-wide text-charcoal uppercase">
                Contacto
              </dt>
              <dd className="mt-1">{STORE.phone}</dd>
              <dd>{STORE.email}</dd>
            </div>
          </dl>

          <div className="mt-8 flex gap-4">
            <a
              href={STORE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-olive-dark px-6 py-2 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
            >
              Instagram
            </a>
            <a
              href={STORE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-olive-dark px-6 py-2 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* TODO: sustituir por un mapa real (ej. iframe de Google Maps) cuando
            se tenga la dirección definitiva. */}
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-olive-dark/50 bg-olive/40 md:aspect-auto">
          <span className="px-8 text-center text-sm tracking-wide text-charcoal-soft">
            Mapa de la tienda
            <br />
            (pendiente de añadir)
          </span>
        </div>
      </div>
    </section>
  );
}
