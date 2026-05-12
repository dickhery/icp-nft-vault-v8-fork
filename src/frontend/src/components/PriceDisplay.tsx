import { cn } from "@/lib/utils";

const ICP_DECIMALS = 100_000_000n;

function formatICP(e8s: bigint): string {
  const whole = e8s / ICP_DECIMALS;
  const frac = e8s % ICP_DECIMALS;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

interface PriceDisplayProps {
  e8s: bigint;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function PriceDisplay({
  e8s,
  size = "md",
  label,
  className,
}: PriceDisplayProps) {
  const formatted = formatICP(e8s);

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {label && (
        <span
          className={cn(
            "text-muted-foreground uppercase tracking-wider font-medium",
            size === "sm" ? "text-[10px]" : "text-xs",
          )}
        >
          {label}
        </span>
      )}
      <span
        className={cn(
          "bid-typography",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl",
        )}
      >
        {formatted}
        <span className="ml-1 text-accent/70 font-mono font-semibold text-[0.75em]">
          ICP
        </span>
      </span>
    </div>
  );
}
