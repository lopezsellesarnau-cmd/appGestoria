import { ReceiptStatus } from "@/types/recibos";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<ReceiptStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  claimed: "Reclamado",
  judicial: "Judicial",
};

const STATUS_VARIANTS: Record<ReceiptStatus, "success" | "warning" | "destructive" | "info"> = {
  paid: "success",
  pending: "warning",
  claimed: "info",
  judicial: "destructive",
};

interface StatusChipProps {
  status: ReceiptStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
