export type ProviderExpenseStatus = "paid" | "pending" | "overdue";

export type ProviderExpenseCategory =
	| "cleaning"
	| "maintenance"
	| "insurance"
	| "utilities"
	| "administration";

export interface Provider {
	id: string;
	businessName: string;
	taxId: string;
	communityId: string;
	isActive: boolean;
}

export interface ProviderExpense {
	id: string;
	providerId: string;
	communityId: string;
	issueDate: string;
	dueDate: string;
	concept: string;
	amountCents: number;
	paymentStatus: ProviderExpenseStatus;
	category: ProviderExpenseCategory;
	invoiceNumber?: string;
}

export const CATEGORY_LABELS: Record<ProviderExpenseCategory, string> = {
	cleaning: "Limpieza",
	maintenance: "Mantenimiento",
	insurance: "Seguro",
	utilities: "Suministros",
	administration: "Administración",
};

export const CATEGORY_OPTIONS: {
	value: ProviderExpenseCategory | "all";
	label: string;
}[] = [
	{ value: "all", label: "Todas" },
	{ value: "cleaning", label: "Limpieza" },
	{ value: "maintenance", label: "Mantenimiento" },
	{ value: "insurance", label: "Seguro" },
	{ value: "utilities", label: "Suministros" },
	{ value: "administration", label: "Administración" },
];

export const STATUS_OPTIONS: {
	value: ProviderExpenseStatus | "all";
	label: string;
}[] = [
	{ value: "all", label: "Todos" },
	{ value: "paid", label: "Pagado" },
	{ value: "pending", label: "Pendiente" },
	{ value: "overdue", label: "Vencido" },
];
