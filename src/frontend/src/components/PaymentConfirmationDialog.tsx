import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentLine {
  label: string;
  value: string;
  helper?: string;
}

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  lines: PaymentLine[];
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  ocid: string;
}

export function PaymentConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  lines,
  confirmLabel = "Confirm Payment",
  isPending = false,
  onConfirm,
  ocid,
}: PaymentConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border" data-ocid={ocid}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
          {lines.map((line) => (
            <div
              key={line.label}
              className="flex items-start justify-between gap-4"
            >
              <span className="text-muted-foreground">
                {line.label}
                {line.helper && (
                  <span className="block text-[11px] leading-snug text-muted-foreground/80">
                    {line.helper}
                  </span>
                )}
              </span>
              <span className="font-mono text-foreground text-right">
                {line.value}
              </span>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? <LoadingSpinner size="sm" /> : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
