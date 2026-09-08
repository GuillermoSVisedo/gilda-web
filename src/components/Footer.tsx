export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-charcoal py-10 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <span className="font-serif text-2xl tracking-[0.2em]">GILDA</span>
        <p className="text-sm text-cream/70">
          © {year} Gilda. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
