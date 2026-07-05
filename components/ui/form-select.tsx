import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Select nativo estilizado para formularios con Server Actions.
 * Se envía por FormData mediante el atributo `name`, sin estado controlado.
 */
function FormSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="form-select"
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { FormSelect };
