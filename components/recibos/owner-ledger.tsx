"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Receipt } from "@/types/recibos";
import { Owner } from "@/types/propietarios";
import { Community } from "@/types/comunidades";
import { StatusChip } from "./status-chip";
import { formatCentsToEuros, formatDate } from "@/lib/utils";
import styles from "./owner-ledger.module.css";

type LedgerViewMode = "combined" | "ordinary" | "extraordinary";

interface OwnerLedgerProps {
  owner: Owner;
  community: Community | undefined;
  receipts: Receipt[];
}

export function OwnerLedger({ owner, community, receipts }: OwnerLedgerProps) {
  const [viewMode, setViewMode] = useState<LedgerViewMode>("combined");

  const filteredReceipts = useMemo(() => {
    if (viewMode === "combined") return receipts;
    return receipts.filter((r) => r.type === viewMode);
  }, [receipts, viewMode]);

  const totals = useMemo(() => {
    return filteredReceipts.reduce(
      (acc, r) => ({
        issued: acc.issued + r.amountCents,
        paid: acc.paid + (r.status === "paid" ? r.amountCents : 0),
        pending:
          acc.pending +
          (r.status === "pending" || r.status === "claimed" || r.status === "judicial"
            ? r.amountCents
            : 0),
      }),
      { issued: 0, paid: 0, pending: 0 }
    );
  }, [filteredReceipts]);

  return (
    <div className={styles.ledger}>
      <div className={styles.header}>
        <div className={styles.ownerInfo}>
          <h2 className={styles.ownerName}>{owner.displayName}</h2>
          <p className={styles.unitRef}>Unidad: {owner.unitReference}</p>
          {community && (
            <p className={styles.communityRef}>Comunidad: {community.name}</p>
          )}
        </div>
        <Link href="/recibos" className={styles.backLink}>
          ← Volver a Recibos
        </Link>
      </div>

      <div className={styles.viewModeSelector}>
        <button
          className={`${styles.viewModeBtn} ${viewMode === "combined" ? styles.active : ""}`}
          onClick={() => setViewMode("combined")}
        >
          Combinado
        </button>
        <button
          className={`${styles.viewModeBtn} ${viewMode === "ordinary" ? styles.active : ""}`}
          onClick={() => setViewMode("ordinary")}
        >
          Ordinario
        </button>
        <button
          className={`${styles.viewModeBtn} ${viewMode === "extraordinary" ? styles.active : ""}`}
          onClick={() => setViewMode("extraordinary")}
        >
          Extraordinario
        </button>
      </div>

      <div className={styles.totalsBar}>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total emitido</span>
          <span className={styles.totalValue}>{formatCentsToEuros(totals.issued)}</span>
        </div>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total pagado</span>
          <span className={`${styles.totalValue} ${styles.paid}`}>{formatCentsToEuros(totals.paid)}</span>
        </div>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total pendiente</span>
          <span className={`${styles.totalValue} ${styles.pending}`}>{formatCentsToEuros(totals.pending)}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {receipts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay recibos registrados para este propietario.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Recibo</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Período</th>
                <th>Fecha emisión</th>
                <th>Fecha vencimiento</th>
                <th className={styles.amountCol}>Importe</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((receipt, index) => (
                <tr
                  key={receipt.id}
                  className={`
                    ${index % 2 === 1 ? styles.zebra : ""}
                    ${receipt.status === "judicial" ? styles.judicialRow : ""}
                  `}
                >
                  <td className={styles.receiptNumber}>
                    {receipt.receiptNumber}
                  </td>
                  <td>
                    <span
                      className={`${styles.typeBadge} ${
                        receipt.type === "ordinary"
                          ? styles.ordinary
                          : styles.extraordinary
                      }`}
                    >
                      {receipt.type === "ordinary" ? "Ord." : "Extraord."}
                    </span>
                  </td>
                  <td className={styles.concept}>{receipt.concept}</td>
                  <td>{receipt.periodLabel}</td>
                  <td>{formatDate(receipt.issueDate)}</td>
                  <td>{formatDate(receipt.dueDate)}</td>
                  <td className={`${styles.amountCol} ${styles.amount}`}>
                    {formatCentsToEuros(receipt.amountCents)}
                  </td>
                  <td>
                    <StatusChip status={receipt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
