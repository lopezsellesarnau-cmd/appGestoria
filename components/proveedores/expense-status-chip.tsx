import { ProviderExpenseStatus } from "@/types/proveedores";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<ProviderExpenseStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  overdue: "Vencido",
};

const STATUS_VARIANTS: Record<ProviderExpenseStatus, "success" | "warning" | "destructive"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
};

interface ExpenseStatusChipProps {
  status: ProviderExpenseStatus;
}

export function ExpenseStatusChip({ status }: ExpenseStatusChipProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
