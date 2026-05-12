import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    "data-ocid"?: string;
  };
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className,
      )}
      data-ocid={dataOcid}
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-display font-semibold text-foreground text-lg">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth mt-2"
          data-ocid={action["data-ocid"]}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
