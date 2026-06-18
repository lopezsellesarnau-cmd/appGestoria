/**
 * @typedef {Object} DebtSummary
 * @property {number} totalPending - Sum of all pending/claimed/judicial receipt amounts in cents
 * @property {number} totalJudicial - Sum of judicial-status receipt amounts in cents
 * @property {number} oldestPendingDays - Days since the oldest pending receipt was due (0 if none)
 * @property {number} count - Number of non-paid receipts
 */

/**
 * Pure function that calculates debt summary for a single owner from their receipts.
 * Handles the case of an owner with no pending receipts (returns zeros).
 *
 * @param {Array<{status: string, amountCents: number, dueDate: string}>} receipts
 * @returns {DebtSummary}
 */
export function calculateOwnerDebt(receipts) {
	if (!receipts || receipts.length === 0) {
		return { totalPending: 0, totalJudicial: 0, oldestPendingDays: 0, count: 0 };
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let totalPending = 0;
	let totalJudicial = 0;
	let oldestDueDate = null;

	for (const receipt of receipts) {
		if (receipt.status === "paid") continue;

		totalPending += receipt.amountCents;
		if (receipt.status === "judicial") {
			totalJudicial += receipt.amountCents;
		}

		if (receipt.status === "pending" || receipt.status === "claimed" || receipt.status === "judicial") {
			const dueDate = new Date(receipt.dueDate);
			if (!oldestDueDate || dueDate < oldestDueDate) {
				oldestDueDate = dueDate;
			}
		}
	}

	const count = receipts.filter((r) => r.status !== "paid").length;

	let oldestPendingDays = 0;
	if (oldestDueDate) {
		const diffTime = today.getTime() - oldestDueDate.getTime();
		oldestPendingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
	}

	return { totalPending, totalJudicial, oldestPendingDays, count };
}
