import Link from "next/link";
import { MainContent } from "@/components/layout/main-content";
import { search } from "@/lib/db";

interface BuscarPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const { q = "" } = await searchParams;
  const results = await search(q);

  const total =
    results.communities.length +
    results.owners.length +
    results.providers.length +
    results.receipts.length;

  return (
    <MainContent title={q ? `Resultados para "${q}"` : "Buscar"}>
      {!q ? (
        <p className="text-muted-foreground">
          Escribe en el buscador de arriba para encontrar comunidades,
          propietarios, proveedores o recibos.
        </p>
      ) : total === 0 ? (
        <p className="text-muted-foreground">
          No se encontró nada para <strong>{q}</strong>.
        </p>
      ) : (
        <div className="space-y-6">
          <ResultGroup title="Comunidades" count={results.communities.length}>
            {results.communities.map((c) => (
              <ResultRow
                key={c.id}
                href={`/comunidades/${c.id}`}
                primary={c.name}
                secondary={c.municipality}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Propietarios" count={results.owners.length}>
            {results.owners.map((o) => (
              <ResultRow
                key={o.id}
                href={`/propietarios/${o.id}/mayor`}
                primary={o.displayName}
                secondary={o.unitReference}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Proveedores" count={results.providers.length}>
            {results.providers.map((p) => (
              <ResultRow
                key={p.id}
                href={`/proveedores/${p.id}/mayor`}
                primary={p.businessName}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Recibos" count={results.receipts.length}>
            {results.receipts.map((r) => (
              <ResultRow
                key={r.id}
                href={`/propietarios/${r.ownerId}/mayor`}
                primary={r.receiptNumber}
                secondary={r.concept}
              />
            ))}
          </ResultGroup>
        </div>
      )}
    </MainContent>
  );
}

function ResultGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({count})
      </h2>
      <div
        className="divide-y rounded-lg border bg-white"
        style={{ borderColor: "var(--border)" }}
      >
        {children}
      </div>
    </section>
  );
}

function ResultRow({
  href,
  primary,
  secondary,
}: {
  href: string;
  primary: string;
  secondary?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50"
    >
      <span className="font-medium" style={{ color: "#1e3648" }}>
        {primary}
      </span>
      {secondary && (
        <span className="text-muted-foreground">{secondary}</span>
      )}
    </Link>
  );
}
