/**
 * @typedef {Object} ProviderFiltersState
 * @property {string} communityId
 * @property {string} providerId
 * @property {string} category
 * @property {string} status
 * @property {string} dateFrom
 * @property {string} dateTo
 */

/**
 * @typedef {Object} ProviderExpense
 * @property {string} id
 * @property {string} providerId
 * @property {string} communityId
 * @property {string} issueDate
 * @property {string} dueDate
 * @property {string} concept
 * @property {number} amountCents
 * @property {string} paymentStatus
 * @property {string} category
 * @property {string} [invoiceNumber]
 */

/**
 * Pure function that filters provider expenses based on filter criteria.
 * This is the same logic used in ProviderWorkspace, extracted for testability.
 * @param {ProviderExpense[]} expenses
 * @param {ProviderFiltersState} filters
 * @returns {ProviderExpense[]}
 */
export function filterExpenses(expenses, filters) {
	return expenses.filter((expense) => {
		if (
			filters.communityId &&
			expense.communityId !== filters.communityId
		) {
			return false;
		}
		if (filters.providerId && expense.providerId !== filters.providerId) {
			return false;
		}
		if (
			filters.category !== "all" &&
			expense.category !== filters.category
		) {
			return false;
		}
		if (filters.status !== "all" && expense.paymentStatus !== filters.status) {
			return false;
		}
		if (filters.dateFrom && expense.issueDate < filters.dateFrom) {
			return false;
		}
		if (filters.dateTo && expense.issueDate > filters.dateTo) {
			return false;
		}
		return true;
	});
}
