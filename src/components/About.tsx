export default function About() {
  return (
    <section
      id="sobre-gilda"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24"
    >
      <div className="grid items-center gap-14 md:grid-cols-2">
        {/* TODO: sustituir por una foto real de la tienda o del equipo (usar next/image). */}
        <div className="flex aspect-4/5 items-center justify-center rounded-2xl border border-dashed border-olive-dark/50 bg-olive/40">
          <span className="px-8 text-center text-sm tracking-wide text-charcoal-soft">
            Foto de la tienda / equipo
            <br />
            (pendiente de añadir)
          </span>
        </div>

        <div>
          <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
            Sobre nosotras
          </span>
          <h2 className="mt-4 font-serif text-4xl text-charcoal">
            La historia de Gilda
          </h2>
          <p className="mt-6 text-charcoal-soft leading-relaxed">
            {/* TODO: sustituir por la historia real de la marca: origen del nombre,
                filosofía, tipo de prendas, qué os hace diferentes. */}
            Gilda nace del gusto por la moda femenina cuidada y atemporal.
            Seleccionamos cada prenda pensando en mujeres reales, combinando
            calidad, comodidad y estilo en una propuesta cercana y honesta.
          </p>
          <p className="mt-4 text-charcoal-soft leading-relaxed">
            Próximamente podrás comprar toda nuestra colección también desde
            esta web, con el mismo stock que ves en tienda.
          </p>
        </div>
      </div>
    </section>
  );
}
