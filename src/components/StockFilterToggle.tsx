import Link from "next/link";

export default function StockFilterToggle({
  active,
  hrefOn,
  hrefOff,
}: {
  active: boolean;
  hrefOn: string;
  hrefOff: string;
}) {
  return (
    <Link
      href={active ? hrefOff : hrefOn}
      className={
        active
          ? "rounded-full bg-olive-dark px-5 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
          : "rounded-full border border-olive-dark px-5 py-2 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
      }
    >
      {active ? "✓ Solo en stock" : "Solo en stock"}
    </Link>
  );
}
