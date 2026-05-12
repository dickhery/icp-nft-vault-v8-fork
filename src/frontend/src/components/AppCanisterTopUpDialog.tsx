import type { CollectionCycleTopUpQuote } from "@/backend-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackend } from "@/hooks/use-backend";
import { canisterIdFromError } from "@/lib/cycles";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fuel, LoaderCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const E8S = 100_000_000n;
const DEFAULT_TOP_UP_CYCLES = "1000000000000";

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = (cycles * 100n) / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}

function parseCyclesInput(value: string): bigint | null {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}

export function AppCanisterTopUpDialog({
  open,
  reason,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  reason?: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cyclesText, setCyclesText] = useState(DEFAULT_TOP_UP_CYCLES);
  const cyclesToTopUp = useMemo(
    () => parseCyclesInput(cyclesText),
    [cyclesText],
  );
  const canisterId = reason ? canisterIdFromError(reason) : null;

  const { data: quote, isFetching: quoteLoading } =
    useQuery<CollectionCycleTopUpQuote | null>({
      queryKey: ["appCanisterCycleTopUpQuote", cyclesToTopUp?.toString()],
      queryFn: async () => {
        if (!actor || cyclesToTopUp == null) return null;
        return actor.quoteAppCanisterCycleTopUp(cyclesToTopUp);
      },
      enabled: !!actor && open && cyclesToTopUp != null,
      staleTime: 60_000,
    });

  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (cyclesToTopUp == null) throw new Error("Enter a valid cycles amount");
      const result = canisterId
        ? await actor.topUpCanisterCycles(
            Principal.fromText(canisterId),
            cyclesToTopUp,
          )
        : await actor.topUpAppCanisterCycles(cyclesToTopUp);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(
        `Added ${formatCycles(receipt.cyclesMinted)} cycles to ${receipt.canisterId.toString()}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: unknown) => toast.error(extractError(err)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="cycles.app_top_up.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Fuel className="h-4 w-4 text-accent" />
            Top Up Canister Cycles
          </DialogTitle>
          <DialogDescription>
            A canister needs cycles before this action can continue. Convert ICP
            from your in-app account into cycles and retry automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Target</span>
              <span className="font-medium text-right">
                {canisterId ? "Reported canister" : "App canister"}
              </span>
            </div>
            {canisterId && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Canister</span>
                <span className="font-mono text-xs text-right break-all">
                  {canisterId}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="app-top-up-cycles">Cycles to add</Label>
            <Input
              id="app-top-up-cycles"
              value={cyclesText}
              onChange={(event) => setCyclesText(event.target.value)}
              inputMode="numeric"
              className="font-mono"
              data-ocid="cycles.app_top_up.cycles_input"
            />
            <p className="text-xs text-muted-foreground">
              Minimum top-up is 100B cycles. The app normalizes smaller amounts
              to that minimum.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
            {cyclesToTopUp == null ? (
              <p className="text-muted-foreground">
                Enter a whole-number cycles amount.
              </p>
            ) : quoteLoading || !quote ? (
              <p className="text-muted-foreground">Fetching quote...</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Cycles requested
                  </span>
                  <span className="font-mono">
                    {formatCycles(quote.cyclesToTopUp)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">ICP converted</span>
                  <span className="font-mono">
                    {formatICP(quote.cycleCostE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Ledger fee</span>
                  <span className="font-mono">
                    {formatICP(quote.ledgerFeeE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-2 font-medium">
                  <span>Total debit</span>
                  <span className="font-mono">
                    {formatICP(quote.totalUserDebitE8s)} ICP
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={topUpMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="gap-2"
            disabled={
              topUpMutation.isPending || cyclesToTopUp == null || !quote
            }
            onClick={() => topUpMutation.mutate()}
            data-ocid="cycles.app_top_up.confirm_button"
          >
            {topUpMutation.isPending ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Confirm Top Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
