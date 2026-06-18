import Link from "next/link";
import { notFound } from "next/navigation";
import { MainContent } from "@/components/layout/main-content";
import { COMUNIDADES } from "@/data/comunidades";
import { PROPIETARIOS } from "@/data/propietarios";
import { RECIBOS } from "@/data/recibos";
import { formatCentsToEuros } from "@/lib/utils";
import styles from "./community-detail.module.css";

interface CommunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;
  const community = COMUNIDADES.find((c) => c.id === id);

  if (!community) {
    notFound();
  }

  const communityOwners = PROPIETARIOS.filter(
    (p) => p.communityId === community.id
  );
  const communityReceipts = RECIBOS.filter(
    (r) => r.communityId === community.id
  );
  const pendingReceipts = communityReceipts.filter((r) => r.status !== "paid");
  const totalPendingDebt = pendingReceipts.reduce(
    (sum, r) => sum + r.amountCents,
    0
  );

  return (
    <MainContent title={community.name}>
      <div className={styles.header}>
        <div className={styles.communityInfo}>
          <p className={styles.municipality}>
            <span className={styles.label}>Municipio:</span> {community.municipality}
          </p>
          <p className={styles.stats}>
            <span className={styles.label}>Propietarios:</span> {communityOwners.length} |{" "}
            <span className={styles.label}>Recibos pendientes:</span> {pendingReceipts.length} |{" "}
            <span className={styles.label}>Deuda total:</span>{" "}
            {formatCentsToEuros(totalPendingDebt)}
          </p>
        </div>
        <Link href="/comunidades" className={styles.backLink}>
          ← Volver a Comunidades
        </Link>
      </div>

      <h2 className={styles.sectionTitle}>Propietarios</h2>
      <div className={styles.tableWrapper}>
        {communityOwners.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay propietarios en esta comunidad.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th className={styles.centeredCol}>Nº Recibos pendientes</th>
                <th className={styles.amountCol}>Deuda total</th>
              </tr>
            </thead>
            <tbody>
              {communityOwners.map((owner, index) => {
                const ownerReceipts = communityReceipts.filter(
                  (r) => r.ownerId === owner.id
                );
                const ownerPending = ownerReceipts.filter(
                  (r) => r.status !== "paid"
                );
                const ownerDebt = ownerPending.reduce(
                  (sum, r) => sum + r.amountCents,
                  0
                );

                return (
                  <tr
                    key={owner.id}
                    className={index % 2 === 1 ? styles.zebra : ""}
                  >
                    <td>
                      <Link
                        href={`/propietarios/${owner.id}/mayor`}
                        className={styles.ownerLink}
                      >
                        {owner.displayName}
                      </Link>
                    </td>
                    <td>{owner.unitReference}</td>
                    <td className={styles.centeredCol}>{ownerPending.length}</td>
                    <td className={`${styles.amountCol} ${styles.amount}`}>
                      {formatCentsToEuros(ownerDebt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </MainContent>
  );
}
