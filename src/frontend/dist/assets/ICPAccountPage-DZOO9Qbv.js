import { c as createLucideIcon, u as useAuth, b as useBackend, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, W as Wallet, B as Button, L as LogIn, f as ue } from "./index-C71bI6gW.js";
import { u as useMutation, B as Badge, L as Label, I as Input } from "./badge-Chchxgvx.js";
import { C as Card, a as CardHeader, b as CardTitle, R as RefreshCw, c as CardContent } from "./card-IDTguvk9.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BIIqjVvo.js";
import { S as Skeleton, C as Copy } from "./skeleton-5N31WYcW.js";
import { S as Send, C as CircleCheck } from "./send-C9qpY2rb.js";
import { C as CircleAlert } from "./circle-alert-C2n_DQre.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode);
const E8S = 100000000n;
const TRANSFER_FEE = 10000n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = e8s % E8S;
  const fracStr = frac.toString().padStart(8, "0");
  return `${whole}.${fracStr}`;
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToAccountId(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
function formatTransferError(result) {
  if (result.__kind__ === "Ok") return "";
  const err = result.Err;
  switch (err.__kind__) {
    case "InsufficientFunds":
      return `Insufficient funds. Balance: ${formatICP(err.InsufficientFunds.balance.e8s)} ICP`;
    case "BadFee":
      return `Bad fee. Expected: ${formatICP(err.BadFee.expected_fee.e8s)} ICP`;
    case "TxDuplicate":
      return `Duplicate transaction (block ${err.TxDuplicate.duplicate_of})`;
    case "TxTooOld":
      return "Transaction too old";
    case "TxCreatedInFuture":
      return "Transaction created in future";
    default:
      return "Transfer failed";
  }
}
function CopyField({
  label,
  value,
  ocid,
  note
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = reactExports.useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    });
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 font-mono text-xs bg-muted/60 border border-border/50 rounded-md px-3 py-2.5 text-foreground truncate min-w-0 select-all", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "outline",
          className: "shrink-0 border-border/50 hover:border-primary/60 hover:bg-primary/10 transition-colors duration-200",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pl-1", children: note })
  ] });
}
function ICPAccountPage() {
  var _a;
  const { isAuthenticated, login, principalText } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const recipientError = recipient.length > 0 && !/^[0-9a-fA-F]{64}$/.test(recipient) ? "Must be a 64-character hex string" : null;
  const parsedAmount = amount ? Number.parseFloat(amount) : 0;
  const amountE8s = parsedAmount > 0 ? BigInt(Math.floor(parsedAmount * 1e8)) : 0n;
  const {
    data: balanceE8s,
    isLoading: balanceLoading,
    refetch: refetchBalance,
    isRefetching
  } = useQuery({
    queryKey: ["icp-balance"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUserICPBalance();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 3e4
  });
  const { data: accountIdBytes, isLoading: accountIdLoading } = useQuery({
    queryKey: ["account-id"],
    queryFn: async () => {
      if (!actor) return new Uint8Array(0);
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const balanceNum = balanceE8s ?? 0n;
  const amountExceedsBalance = parsedAmount > 0 && amountE8s + TRANSFER_FEE > balanceNum;
  const formValid = /^[0-9a-fA-F]{64}$/.test(recipient) && parsedAmount > 0 && !amountExceedsBalance;
  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      const to = hexToAccountId(recipient);
      const result = await actor.transferICPOut(to, amountE8s);
      return result;
    },
    onSuccess: (result) => {
      setConfirmOpen(false);
      if (result.__kind__ === "Ok") {
        ue.success("Transfer successful!", {
          description: `Transaction confirmed at block ${result.Ok}`,
          duration: 6e3
        });
        setRecipient("");
        setAmount("");
        setMemo("");
        queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      } else {
        ue.error("Transfer failed", {
          description: formatTransferError(result),
          duration: 8e3
        });
      }
    },
    onError: (err) => {
      setConfirmOpen(false);
      ue.error("Transfer error", {
        description: err.message ?? "Unknown error",
        duration: 8e3
      });
    }
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4",
        "data-ocid": "icp-account.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-primary/15 border border-primary/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "Connect to view your ICP account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Authenticate with Internet Identity to view your balance, account address, and transfer ICP." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full gap-2",
              onClick: login,
              "data-ocid": "icp-account.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                "Sign in with Internet Identity"
              ]
            }
          )
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto w-full",
      "data-ocid": "icp-account.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "ICP Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View your balance and transfer ICP to any address" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "relative border-primary/20 bg-card shadow-lg overflow-hidden",
            "data-ocid": "icp-account.balance_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-primary" }),
                  "Available Balance"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    onClick: () => refetchBalance(),
                    disabled: isRefetching || balanceLoading,
                    "data-ocid": "icp-account.refresh_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          className: `h-3 w-3 ${isRefetching ? "animate-spin" : ""}`
                        }
                      ),
                      "Refresh"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "relative pb-6", children: balanceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-2",
                  "data-ocid": "icp-account.balance_loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-56" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-4xl font-bold text-primary tabular-nums tracking-tight", children: formatICP(balanceNum) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "bg-primary/15 text-primary border-primary/30 text-xs font-mono",
                      children: "ICP"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 font-mono", children: [
                  balanceNum.toString(),
                  " e8s"
                ] })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-sm",
            "data-ocid": "icp-account.identity_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase tracking-wider", children: "Your Addresses" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
                accountIdLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
                ] }) : accountIdHex && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CopyField,
                  {
                    label: "Account Identifier (ICP Ledger)",
                    value: accountIdHex,
                    ocid: "icp-account.account_id_copy_button",
                    note: "📨 Send ICP to this address to top up your wallet"
                  }
                ),
                principalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CopyField,
                  {
                    label: "Principal ID",
                    value: principalText,
                    ocid: "icp-account.principal_id_copy_button"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-sm",
            "data-ocid": "icp-account.transfer_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-accent" }),
                "Transfer ICP Out"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "recipient",
                      className: "text-sm font-medium text-foreground",
                      children: "Recipient Account ID"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "recipient",
                      placeholder: "64-character hex account identifier…",
                      value: recipient,
                      onChange: (e) => setRecipient(e.target.value.trim()),
                      className: "font-mono text-xs bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                      "data-ocid": "icp-account.recipient_input"
                    }
                  ),
                  recipientError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.recipient_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        recipientError
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "amount",
                      className: "text-sm font-medium text-foreground",
                      children: "Amount (ICP)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "amount",
                        type: "number",
                        placeholder: "0.00000000",
                        min: "0",
                        step: "0.00000001",
                        value: amount,
                        onChange: (e) => setAmount(e.target.value),
                        className: "font-mono pr-14 bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                        "data-ocid": "icp-account.amount_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none", children: "ICP" })
                  ] }),
                  amountExceedsBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.amount_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        "Exceeds balance (",
                        formatICP(balanceNum),
                        " ICP available)"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Network fee: 0.0001 ICP (deducted from your balance)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "memo",
                      className: "text-sm font-medium text-foreground",
                      children: [
                        "Memo",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "memo",
                      type: "number",
                      placeholder: "Numeric memo e.g. 12345",
                      min: "0",
                      value: memo,
                      onChange: (e) => setMemo(e.target.value),
                      className: "font-mono bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                      "data-ocid": "icp-account.memo_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "w-full gap-2 font-medium",
                    disabled: !formValid || transferMutation.isPending,
                    onClick: () => setConfirmOpen(true),
                    "data-ocid": "icp-account.transfer_submit_button",
                    children: [
                      transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
                      transferMutation.isPending ? "Sending…" : "Transfer ICP"
                    ]
                  }
                ),
                transferMutation.isSuccess && transferMutation.data.__kind__ === "Ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2.5 text-sm text-green-400",
                    "data-ocid": "icp-account.success_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Transfer confirmed — block",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: transferMutation.data.Ok.toString() })
                      ] })
                    ]
                  }
                ),
                transferMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive",
                    "data-ocid": "icp-account.error_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ((_a = transferMutation.error) == null ? void 0 : _a.message) ?? "Unknown error" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: confirmOpen, onOpenChange: setConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-border/60 shadow-2xl max-w-sm",
            "data-ocid": "icp-account.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg text-foreground", children: "Confirm Transfer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground text-sm", children: "Review the details carefully before confirming." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-lg bg-muted/40 border border-border/40 p-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: "To" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs text-foreground text-right break-all leading-relaxed", children: recipient })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "You send" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-primary", children: [
                    formatICP(amountE8s),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Network fee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: "−0.00010000 ICP" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "Recipient receives" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                    amountE8s >= TRANSFER_FEE ? formatICP(amountE8s - TRANSFER_FEE) : "—",
                    " ",
                    "ICP"
                  ] })
                ] }),
                memo && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Memo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: memo })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setConfirmOpen(false),
                    disabled: transferMutation.isPending,
                    className: "border-border/50",
                    "data-ocid": "icp-account.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => transferMutation.mutate(),
                    disabled: transferMutation.isPending,
                    className: "gap-2",
                    "data-ocid": "icp-account.confirm_button",
                    children: [
                      transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }),
                      transferMutation.isPending ? "Sending…" : "Confirm Transfer"
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  ICPAccountPage as default
};
