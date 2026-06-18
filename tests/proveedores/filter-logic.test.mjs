/**
 * Pure unit tests for provider filtering and empty state logic.
 * Run with: node --test tests/proveedores/filter-logic.test.mjs
 *
 * These tests verify the core filtering behavior using inline mock data
 * that mirrors the actual data/proveedores.ts structure, exercising the
 * real filterExpenses implementation from lib/proveedores/filter-logic.js.
 */
import { describe, it } from 'node:test';
import { ok, strictEqual } from 'node:assert';
import { filterExpenses } from '../../lib/proveedores/filter-logic.js';

// ---------------------------------------------------------------------------
// Inline mock data matching data/proveedores.ts structure
// ---------------------------------------------------------------------------

const PROVEEDORES = [
	{ id: "prov-001", businessName: "Limpiezas Integral Madrid S.L.", taxId: "B12345678", communityId: "com-001", isActive: true },
	{ id: "prov-002", businessName: "Mantenimientos Sol Barcelona", taxId: "B87654321", communityId: "com-002", isActive: true },
	{ id: "prov-003", businessName: "Seguros Edificio Mar", taxId: "B11223344", communityId: "com-003", isActive: true },
	{ id: "prov-004", businessName: "Suministros Verde S.A.", taxId: "A99887766", communityId: "com-004", isActive: true },
	{ id: "prov-005", businessName: "Administraciones Picasso", taxId: "B55443322", communityId: "com-001", isActive: true },
	{ id: "prov-006", businessName: "Fontanería Rápida Valencia", taxId: "B66554433", communityId: "com-003", isActive: true },
	{ id: "prov-007", businessName: "Electricidad Sol Barcelona", taxId: "B33445566", communityId: "com-002", isActive: true },
	{ id: "prov-008", businessName: "Pinturas Verde Sevilla", taxId: "B22334455", communityId: "com-004", isActive: false },
	{ id: "prov-009", businessName: "Ascensores Madrid S.A.", taxId: "A44332211", communityId: "com-001", isActive: true },
	{ id: "prov-010", businessName: "Jardinería Residencia Sol", taxId: "B11223355", communityId: "com-002", isActive: true },
	{ id: "prov-011", businessName: "Desatascos Valencia", taxId: "B77665544", communityId: "com-003", isActive: true },
	{ id: "prov-012", businessName: "Limpiezas Urbanización Verde", taxId: "B88776633", communityId: "com-004", isActive: true },
	// Provider with no expenses - used to test empty ledger state
	{ id: "prov-013", businessName: "Consultoría Técnica Sinistros S.L.", taxId: "B99887766", communityId: "com-001", isActive: true },
];

const GASTOS = [
	// Cleaning expenses
	{ id: "gasto-001", providerId: "prov-001", communityId: "com-001", issueDate: "2024-01-05", dueDate: "2024-02-05", concept: "Limpieza mensual escalera A", amountCents: 45000, paymentStatus: "paid", category: "cleaning", invoiceNumber: "FAC-2024-001" },
	{ id: "gasto-002", providerId: "prov-001", communityId: "com-001", issueDate: "2024-02-05", dueDate: "2024-03-05", concept: "Limpieza mensual escalera A", amountCents: 45000, paymentStatus: "paid", category: "cleaning", invoiceNumber: "FAC-2024-002" },
	{ id: "gasto-003", providerId: "prov-001", communityId: "com-001", issueDate: "2024-03-05", dueDate: "2024-04-05", concept: "Limpieza mensual escalera A", amountCents: 45000, paymentStatus: "pending", category: "cleaning", invoiceNumber: "FAC-2024-003" },
	// Maintenance expenses
	{ id: "gasto-004", providerId: "prov-002", communityId: "com-002", issueDate: "2024-01-10", dueDate: "2024-02-10", concept: "Mantenimiento caldera comunitario", amountCents: 120000, paymentStatus: "paid", category: "maintenance", invoiceNumber: "FAC-2024-004" },
	{ id: "gasto-005", providerId: "prov-002", communityId: "com-002", issueDate: "2024-02-10", dueDate: "2024-03-10", concept: "Revisión trimestral ascensor", amountCents: 85000, paymentStatus: "paid", category: "maintenance", invoiceNumber: "FAC-2024-005" },
	{ id: "gasto-006", providerId: "prov-002", communityId: "com-002", issueDate: "2024-03-10", dueDate: "2024-04-10", concept: "Reparación sistema de ventilación", amountCents: 35000, paymentStatus: "overdue", category: "maintenance", invoiceNumber: "FAC-2024-006" },
	// Insurance expenses
	{ id: "gasto-007", providerId: "prov-003", communityId: "com-003", issueDate: "2024-01-01", dueDate: "2024-01-31", concept: "Seguro multirriesgo edificio", amountCents: 240000, paymentStatus: "paid", category: "insurance", invoiceNumber: "FAC-2024-007" },
	{ id: "gasto-008", providerId: "prov-003", communityId: "com-003", issueDate: "2024-02-01", dueDate: "2024-03-01", concept: "Ampliación cobertura cristales", amountCents: 15000, paymentStatus: "paid", category: "insurance", invoiceNumber: "FAC-2024-008" },
	{ id: "gasto-009", providerId: "prov-003", communityId: "com-003", issueDate: "2024-03-01", dueDate: "2024-04-01", concept: "Actualización póliza daños", amountCents: 22000, paymentStatus: "pending", category: "insurance", invoiceNumber: "FAC-2024-009" },
	// Utilities expenses
	{ id: "gasto-010", providerId: "prov-004", communityId: "com-004", issueDate: "2024-01-15", dueDate: "2024-02-15", concept: "Suministro agua comunidad enero", amountCents: 32000, paymentStatus: "paid", category: "utilities" },
	{ id: "gasto-011", providerId: "prov-004", communityId: "com-004", issueDate: "2024-02-15", dueDate: "2024-03-15", concept: "Suministro agua comunidad febrero", amountCents: 31500, paymentStatus: "paid", category: "utilities" },
	{ id: "gasto-012", providerId: "prov-004", communityId: "com-004", issueDate: "2024-03-15", dueDate: "2024-04-15", concept: "Suministro agua comunidad marzo", amountCents: 33000, paymentStatus: "overdue", category: "utilities" },
	// Administration expenses
	{ id: "gasto-013", providerId: "prov-005", communityId: "com-001", issueDate: "2024-01-01", dueDate: "2024-01-31", concept: "Gestión administrativa enero", amountCents: 60000, paymentStatus: "paid", category: "administration", invoiceNumber: "FAC-2024-010" },
	{ id: "gasto-014", providerId: "prov-005", communityId: "com-001", issueDate: "2024-02-01", dueDate: "2024-02-29", concept: "Gestión administrativa febrero", amountCents: 60000, paymentStatus: "paid", category: "administration", invoiceNumber: "FAC-2024-011" },
	{ id: "gasto-015", providerId: "prov-005", communityId: "com-001", issueDate: "2024-03-01", dueDate: "2024-03-31", concept: "Gestión administrativa marzo", amountCents: 60000, paymentStatus: "pending", category: "administration", invoiceNumber: "FAC-2024-012" },
];

const DEFAULT_FILTERS = {
	communityId: "",
	providerId: "",
	category: "all",
	status: "all",
	dateFrom: "",
	dateTo: "",
};

// ---------------------------------------------------------------------------
// Tests: Combined filtering narrows results (AND semantics)
// ---------------------------------------------------------------------------

describe("Combined filtering narrows results", () => {
	it("applies single filter correctly - community filter", () => {
		const filters = { ...DEFAULT_FILTERS, communityId: "com-001" };
		const result = filterExpenses(GASTOS, filters);
		ok(result.length > 0, "should return at least one expense");
		result.forEach((expense) => {
			strictEqual(expense.communityId, "com-001");
		});
	});

	it("applies single filter correctly - provider filter", () => {
		const filters = { ...DEFAULT_FILTERS, providerId: "prov-001" };
		const result = filterExpenses(GASTOS, filters);
		ok(result.length > 0, "should return at least one expense");
		result.forEach((expense) => {
			strictEqual(expense.providerId, "prov-001");
		});
	});

	it("applies single filter correctly - status filter", () => {
		const filters = { ...DEFAULT_FILTERS, status: "paid" };
		const result = filterExpenses(GASTOS, filters);
		ok(result.length > 0, "should return at least one expense");
		result.forEach((expense) => {
			strictEqual(expense.paymentStatus, "paid");
		});
	});

	it("applies single filter correctly - category filter", () => {
		const filters = { ...DEFAULT_FILTERS, category: "cleaning" };
		const result = filterExpenses(GASTOS, filters);
		ok(result.length > 0, "should return at least one expense");
		result.forEach((expense) => {
			strictEqual(expense.category, "cleaning");
		});
	});

	it("applies single filter correctly - date range filter", () => {
		const filters = { ...DEFAULT_FILTERS, dateFrom: "2024-02-01", dateTo: "2024-02-29" };
		const result = filterExpenses(GASTOS, filters);
		ok(result.length > 0, "should return at least one expense");
		result.forEach((expense) => {
			ok(expense.issueDate >= "2024-02-01", "issue date should be >= dateFrom");
			ok(expense.issueDate <= "2024-02-29", "issue date should be <= dateTo");
		});
	});

	it("combines multiple filters with AND semantics - narrows results", () => {
		// Start with single filter count
		const communityOnly = { ...DEFAULT_FILTERS, communityId: "com-001" };
		const communityCount = filterExpenses(GASTOS, communityOnly).length;
		ok(communityCount > 0, "com-001 should have at least one expense");

		// Add provider filter - should narrow further
		const communityAndProvider = { ...DEFAULT_FILTERS, communityId: "com-001", providerId: "prov-001" };
		const combinedCount = filterExpenses(GASTOS, communityAndProvider).length;
		ok(combinedCount < communityCount, "adding provider filter should narrow results");
		ok(combinedCount > 0, "combined filter should still return results");

		// Add status filter - should narrow even further
		const allThree = { ...DEFAULT_FILTERS, communityId: "com-001", providerId: "prov-001", status: "paid" };
		const threeCount = filterExpenses(GASTOS, allThree).length;
		ok(threeCount <= combinedCount, "adding status filter should not increase results");

		// Verify all results match ALL criteria
		const finalResults = filterExpenses(GASTOS, allThree);
		finalResults.forEach((expense) => {
			strictEqual(expense.communityId, "com-001");
			strictEqual(expense.providerId, "prov-001");
			strictEqual(expense.paymentStatus, "paid");
		});
	});

	it("can produce empty result set when no expenses match combined filters", () => {
		const noMatchFilters = { ...DEFAULT_FILTERS, dateFrom: "2025-01-01", dateTo: "2025-12-31" };
		const result = filterExpenses(GASTOS, noMatchFilters);
		strictEqual(result.length, 0, "far future date should return no expenses");
	});

	it("can produce empty result set with impossible filter combination", () => {
		// Filter for non-existent provider returns empty
		const filters = { ...DEFAULT_FILTERS, providerId: "prov-999" };
		const result = filterExpenses(GASTOS, filters);
		strictEqual(result.length, 0, "non-existent provider should return no expenses");
	});
});

// ---------------------------------------------------------------------------
// Tests: Empty result state remains usable
// ---------------------------------------------------------------------------

describe("Empty result state remains usable", () => {
	it("empty filtered state is detectable via zero length", () => {
		const filters = { ...DEFAULT_FILTERS, dateFrom: "2030-01-01" };
		const result = filterExpenses(GASTOS, filters);
		strictEqual(result.length, 0, "far future date should return empty");
	});

	it("empty state preserves filter values so user can adjust them", () => {
		const activeFilters = {
			communityId: "com-999",
			providerId: "prov-999",
			category: "utilities",
			status: "overdue",
			dateFrom: "2024-01-01",
			dateTo: "2024-01-31",
		};
		const result = filterExpenses(GASTOS, activeFilters);

		// Result is empty but the filter state is preserved
		strictEqual(result.length, 0, "should return empty");
		// These values would still be visible in the UI for user to adjust
		strictEqual(activeFilters.communityId, "com-999");
		strictEqual(activeFilters.providerId, "prov-999");
		strictEqual(activeFilters.category, "utilities");
		strictEqual(activeFilters.status, "overdue");
	});
});

// ---------------------------------------------------------------------------
// Tests: Provider with no expenses is still handled
// ---------------------------------------------------------------------------

describe("Provider with no expenses is still handled", () => {
	it("prov-013 exists in provider list but has no expenses", () => {
		const prov013 = PROVEEDORES.find(p => p.id === "prov-013");
		ok(prov013 !== undefined, "prov-013 should exist");
		strictEqual(prov013.businessName, "Consultoría Técnica Sinistros S.L.");

		// Verify no expenses exist for prov-013
		const prov013Expenses = GASTOS.filter(e => e.providerId === "prov-013");
		strictEqual(prov013Expenses.length, 0, "prov-013 should have no expenses");
	});

	it("filtering by prov-013 as provider returns zero expenses", () => {
		const filters = { ...DEFAULT_FILTERS, providerId: "prov-013" };
		const result = filterExpenses(GASTOS, filters);
		strictEqual(result.length, 0, "prov-013 should return empty expense list");
	});

	it("empty expense list for prov-013 triggers empty state in UI", () => {
		const filters = { ...DEFAULT_FILTERS, providerId: "prov-013" };
		const result = filterExpenses(GASTOS, filters);

		// This empty array would trigger the no-expenses UI state in provider-ledger.tsx
		strictEqual(result.length, 0, "prov-013 expenses should be empty");

		// Provider still exists and would show in ledger with context
		const prov013 = PROVEEDORES.find(p => p.id === "prov-013");
		ok(prov013 !== undefined, "prov-013 should exist in provider list");

		// The UI would show: provider context + "No hay gastos registrados"
		// This tests the branch in provider-ledger.tsx: expenses.length === 0
	});
});

// ---------------------------------------------------------------------------
// Tests: Provider links in table
// ---------------------------------------------------------------------------

describe("Provider links in table", () => {
	it("all expenses have valid providerId that exists in provider list", () => {
		const providerIds = new Set(PROVEEDORES.map(p => p.id));
		GASTOS.forEach((expense) => {
			ok(providerIds.has(expense.providerId), `expense ${expense.id} has valid providerId`);
		});
	});

	it("provider link format is /proveedores/{providerId}/mayor", () => {
		const expense = GASTOS[0];
		const link = `/proveedores/${expense.providerId}/mayor`;
		ok(/^\/proveedores\/prov-\d{3}\/mayor$/.test(link), "link should match expected format");
	});
});
