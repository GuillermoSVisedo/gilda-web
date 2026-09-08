import Link from "next/link";

// Los hrefs llevan "/" delante porque estos enlaces deben funcionar también
// desde otras rutas (ej. /coleccion/vestidos), no solo desde la home.
const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre nosotras", href: "/#sobre-gilda" },
  { label: "Colecciones", href: "/#colecciones" },
  { label: "Contacto", href: "/#contacto" },
];

const WHATSAPP_LINK = "https://wa.me/34614934915";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.2em] text-olive-dark"
        >
          GILDA
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-charcoal-soft transition-colors hover:text-olive-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-olive-dark px-5 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
        >
          Escríbenos
        </a>
      </div>
    </header>
  );
}
