// Todos los datos son reales (Loyverse + confirmados por el usuario,
// 2026-09-08).
const STORE = {
  address: "Av. de Madrid, 50 — 28491 Navacerrada, Madrid",
  phone: "+34 614 93 49 15",
  email: "gildanavacerrada@gmail.com",
  hours: {
    invierno: [
      "Viernes: 17:30 – 20:30",
      "Sábados: 11:00 – 14:30 y 17:30 – 20:30",
      "Domingos: 11:00 – 14:30",
    ],
    verano: [
      "Viernes: 18:30 – 21:30",
      "Sábados: 11:00 – 14:30 y 18:30 – 21:30",
      "Domingos: 11:00 – 14:30",
    ],
  },
  instagram: "https://www.instagram.com/gildanavacerrada/",
  whatsapp: "https://wa.me/34614934915",
  // Embed de Google Maps sin API key (query con la dirección real).
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Av.+de+Madrid,+50,+28491+Navacerrada,+Madrid&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+de+Madrid,+50,+28491+Navacerrada,+Madrid",
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
              <p className="mt-2 text-xs tracking-wide text-olive-dark uppercase">
                Invierno
              </p>
              {STORE.hours.invierno.map((line) => (
                <dd className="mt-1" key={line}>
                  {line}
                </dd>
              ))}
              <p className="mt-3 text-xs tracking-wide text-olive-dark uppercase">
                Verano
              </p>
              {STORE.hours.verano.map((line) => (
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

        <div className="flex aspect-square flex-col gap-2 md:aspect-auto">
          <div className="flex-1 overflow-hidden rounded-2xl border border-line/70">
            <iframe
              src={STORE.mapsEmbedUrl}
              title="Mapa de la tienda Gilda"
              loading="lazy"
              className="h-full min-h-80 w-full border-0"
            />
          </div>
          <a
            href={STORE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-olive-dark hover:underline"
          >
            Abrir en Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
