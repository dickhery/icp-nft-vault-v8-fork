import { c as createLucideIcon, b as useBackend, d as useQueryClient, r as reactExports, e as useQuery, f as ue, P as Principal, j as jsxRuntimeExports, B as Button } from "./index-DngK8SgJ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-Dm5T7_x3.js";
import { u as useMutation, L as Label, I as Input } from "./badge-BYgMj4sx.js";
import { L as LoaderCircle, P as Plus } from "./plus-DMZ2r3_v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "3", x2: "15", y1: "22", y2: "22", key: "xegly4" }],
  ["line", { x1: "4", x2: "14", y1: "9", y2: "9", key: "xcnuvu" }],
  ["path", { d: "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18", key: "16j0yd" }],
  [
    "path",
    {
      d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",
      key: "7cu91f"
    }
  ]
];
const Fuel = createLucideIcon("fuel", __iconNode);
const LOW_CYCLES_PATTERNS = [
  "ic0532",
  "insufficient cycles",
  "cannot grow memory",
  "out of cycles",
  "needs more cycles"
];
function isLowCyclesError(message) {
  const normalized = message.toLowerCase();
  return LOW_CYCLES_PATTERNS.some((pattern) => normalized.includes(pattern));
}
function canisterIdFromError(message) {
  const match = message.match(/Canister ([a-z0-9-]+):/i);
  return (match == null ? void 0 : match[1]) ?? null;
}
const E8S = 100000000n;
const DEFAULT_TOP_UP_CYCLES = "1000000000000";
function formatICP(e8s) {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
function formatCycles(cycles) {
  const trillion = 1000000000000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = cycles * 100n / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}
function parseCyclesInput(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}
function extractError(err) {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}
function AppCanisterTopUpDialog({
  open,
  reason,
  onOpenChange,
  onSuccess
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cyclesText, setCyclesText] = reactExports.useState(DEFAULT_TOP_UP_CYCLES);
  const cyclesToTopUp = reactExports.useMemo(
    () => parseCyclesInput(cyclesText),
    [cyclesText]
  );
  const canisterId = reason ? canisterIdFromError(reason) : null;
  const { data: quote, isFetching: quoteLoading } = useQuery({
    queryKey: ["appCanisterCycleTopUpQuote", cyclesToTopUp == null ? void 0 : cyclesToTopUp.toString()],
    queryFn: async () => {
      if (!actor || cyclesToTopUp == null) return null;
      return actor.quoteAppCanisterCycleTopUp(cyclesToTopUp);
    },
    enabled: !!actor && open && cyclesToTopUp != null,
    staleTime: 6e4
  });
  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (cyclesToTopUp == null) throw new Error("Enter a valid cycles amount");
      const result = canisterId ? await actor.topUpCanisterCycles(
        Principal.fromText(canisterId),
        cyclesToTopUp
      ) : await actor.topUpAppCanisterCycles(cyclesToTopUp);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        `Added ${formatCycles(receipt.cyclesMinted)} cycles to ${receipt.canisterId.toString()}`
      );
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      onOpenChange(false);
      onSuccess == null ? void 0 : onSuccess();
    },
    onError: (err) => ue.error(extractError(err))
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "cycles.app_top_up.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "h-4 w-4 text-accent" }),
            "Top Up Canister Cycles"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "A canister needs cycles before this action can continue. Convert ICP from your in-app account into cycles and retry automatically." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-right", children: canisterId ? "Reported canister" : "App canister" })
            ] }),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Canister" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-right break-all", children: canisterId })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "app-top-up-cycles", children: "Cycles to add" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "app-top-up-cycles",
                value: cyclesText,
                onChange: (event) => setCyclesText(event.target.value),
                inputMode: "numeric",
                className: "font-mono",
                "data-ocid": "cycles.app_top_up.cycles_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum top-up is 100B cycles. The app normalizes smaller amounts to that minimum." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: cyclesToTopUp == null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Enter a whole-number cycles amount." }) : quoteLoading || !quote ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Fetching quote..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cycles requested" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatCycles(quote.cyclesToTopUp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ICP converted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.cycleCostE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.ledgerFeeE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border pt-2 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.totalUserDebitE8s),
                " ICP"
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onOpenChange(false),
              disabled: topUpMutation.isPending,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gap-2",
              disabled: topUpMutation.isPending || cyclesToTopUp == null || !quote,
              onClick: () => topUpMutation.mutate(),
              "data-ocid": "cycles.app_top_up.confirm_button",
              children: [
                topUpMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Confirm Top Up"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  AppCanisterTopUpDialog as A,
  isLowCyclesError as i
};
