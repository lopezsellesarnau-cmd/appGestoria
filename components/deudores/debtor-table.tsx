"use client";

import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCentsToEuros } from "@/lib/utils";

export interface DebtorRow {
	ownerId: string;
	ownerName: string;
	communityId: string;
	communityName: string;
	unitReference: string;
	totalPending: number;
	totalJudicial: number;
	receiptCount: number;
	oldestPendingDays: number;
}

interface DebtorTableProps {
	debtors: DebtorRow[];
}

function formatAntiquity(days: number): string {
	if (days === 0) return "—";
	if (days === 1) return "1 día";
	if (days < 30) return `${days} días`;
	if (days < 365) {
		const months = Math.floor(days / 30);
		return months === 1 ? "1 mes" : `${months} meses`;
	}
	const years = Math.floor(days / 365);
	return years === 1 ? "1 año" : `${years} años`;
}

export function DebtorTable({ debtors }: DebtorTableProps) {
	if (debtors.length === 0) {
		return (
			<div
				className="text-center py-12 border rounded-lg"
				style={{ backgroundColor: "#ffffff", borderColor: "var(--border)" }}
			>
				<p className="text-muted-foreground">
					No se encontraron propietarios con deuda.
				</p>
			</div>
		);
	}

	return (
		<div
			className="border rounded-lg overflow-hidden"
			style={{ backgroundColor: "#ffffff", borderColor: "var(--border)" }}
		>
			<Table>
				<TableHeader>
					<TableRow
						className="border-b"
						style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
					>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
							Propietario
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
							Comunidad
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
							Unidad
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11 text-right">
							Deuda total
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11 text-right">
							Deuda judicial
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11 text-center">
							Nº Recibos
						</TableHead>
						<TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
							Antigüedad
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{debtors.map((debtor) => (
						<TableRow
							key={debtor.ownerId}
							className="border-b transition-colors hover:bg-muted/50"
							style={{ borderColor: "var(--border)" }}
						>
							<TableCell className="py-3">
								<Link
									href={`/propietarios/${debtor.ownerId}/mayor`}
									className="font-medium hover:underline"
									style={{ color: "var(--primary)" }}
								>
									{debtor.ownerName}
								</Link>
							</TableCell>
							<TableCell className="py-3">{debtor.communityName}</TableCell>
							<TableCell className="py-3">{debtor.unitReference}</TableCell>
							<TableCell className="py-3 text-right tabular-nums font-medium">
								{formatCentsToEuros(debtor.totalPending)}
							</TableCell>
							<TableCell
								className="py-3 text-right tabular-nums"
								style={{
									color:
										debtor.totalJudicial > 0 ? "var(--destructive)" : "inherit",
								}}
							>
								{debtor.totalJudicial > 0
									? formatCentsToEuros(debtor.totalJudicial)
									: "—"}
							</TableCell>
							<TableCell className="py-3 text-center">
								{debtor.receiptCount}
							</TableCell>
							<TableCell
								className="py-3"
								style={{
									color:
										debtor.oldestPendingDays > 365
											? "var(--destructive)"
											: debtor.oldestPendingDays > 180
												? "var(--warning)"
												: "inherit",
								}}
							>
								{formatAntiquity(debtor.oldestPendingDays)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
