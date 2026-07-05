import Link from "next/link";
import { notFound } from "next/navigation";
import { MainContent } from "@/components/layout/main-content";
import { getCommunity, getOwners, getReceipts } from "@/lib/db";
import { formatCentsToEuros } from "@/lib/utils";
import styles from "./community-detail.module.css";

interface CommunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;

  const [community, owners, receipts] = await Promise.all([
    getCommunity(id),
    getOwners(id),
    getReceipts({ communityId: id }),
  ]);

  if (!community) notFound();

  const pendingReceipts = receipts.filter((r) => r.status !== "paid");
  const totalPendingDebt = pendingReceipts.reduce((sum, r) => sum + r.amountCents, 0);

  return (
    <MainContent title={community.name}>
      <div className={styles.header}>
        <div className={styles.communityInfo}>
          <p className={styles.municipality}>
            <span className={styles.label}>Municipio:</span> {community.municipality}
          </p>
          <p className={styles.stats}>
            <span className={styles.label}>Propietarios:</span> {owners.length} |{" "}
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
        {owners.length === 0 ? (
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
              {owners.map((owner, index) => {
                const ownerPending = receipts.filter(
                  (r) => r.ownerId === owner.id && r.status !== "paid",
                );
                const ownerDebt = ownerPending.reduce((sum, r) => sum + r.amountCents, 0);
                return (
                  <tr key={owner.id} className={index % 2 === 1 ? styles.zebra : ""}>
                    <td>
                      <Link href={`/propietarios/${owner.id}/mayor`} className={styles.ownerLink}>
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
