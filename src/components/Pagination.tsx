import Link from "next/link";
import type { ReactNode } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-center gap-4">
      <PageLink href={buildHref(currentPage - 1)} disabled={currentPage <= 1}>
        Anterior
      </PageLink>
      <span className="text-sm text-charcoal-soft">
        Página {currentPage} de {totalPages}
      </span>
      <PageLink
        href={buildHref(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Siguiente
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full border border-line px-5 py-2 text-sm text-charcoal-soft/40">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-full border border-olive-dark px-5 py-2 text-sm text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
    >
      {children}
    </Link>
  );
}
