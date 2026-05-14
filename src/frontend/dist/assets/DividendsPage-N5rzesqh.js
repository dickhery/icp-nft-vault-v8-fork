import { b as useBackend, u as useAuth, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, C as CircleDollarSign, B as Button, L as LogIn, h as LoadingSpinner, f as ue } from "./index-C71bI6gW.js";
import { A as AppCanisterTopUpDialog, i as isLowCyclesError } from "./AppCanisterTopUpDialog-YQix8Ufz.js";
import { E as EmptyState, M as MediaImage } from "./MediaImage-DBL69kJb.js";
import { u as useMutation, B as Badge } from "./badge-Chchxgvx.js";
import { R as RefreshCw, C as Card, c as CardContent } from "./card-IDTguvk9.js";
import { L as LoaderCircle } from "./plus-DfwTHhHr.js";
import { C as Coins } from "./coins-h1iwneF3.js";
import { I as ImageOff } from "./media-BUtul1vm.js";
import "./dialog-BIIqjVvo.js";
const E8S = 100000000n;
const ICP_FEE = 10000n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
function extractError(err) {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}
function dividendKey(item) {
  return `${item.nft.collectionId.toString()}:${item.nft.tokenId}`;
}
function DividendsPage() {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, principalText, login } = useAuth();
  const queryClient = useQueryClient();
  const [cycleRetry, setCycleRetry] = reactExports.useState(null);
  const {
    data: dividends = [],
    error: dividendsError,
    isError: dividendsFailed,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["myDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.refreshMyDividendNFTs();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const { data: mediaNFTs = [] } = useQuery({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const claimMutation = useMutation({
    mutationFn: async (item) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.claimNFTDividend(item.nft.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(`Collected ${formatICP(receipt.paidE8s)} ICP`, {
        description: `Confirmed at block ${receipt.blockIndex.toString()}`
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err, item) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "claim", reason: message, item });
        return;
      }
      ue.error(message);
    }
  });
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const collectionIds = Array.from(
        new Set(dividends.map((item) => item.collection.id.toString()))
      );
      let distributed = 0n;
      for (const collectionId of collectionIds) {
        const result = await actor.syncCollectionDividends(
          BigInt(collectionId)
        );
        if (result.__kind__ === "ok") {
          distributed += result.ok.distributedE8s;
        }
      }
      return distributed;
    },
    onSuccess: (distributed) => {
      ue.success(
        distributed > 0n ? `Distributed ${formatICP(distributed)} ICP` : "No new deposits to distribute"
      );
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "sync", reason: message });
        return;
      }
      ue.error(message);
    }
  });
  const mediaByDividendKey = reactExports.useMemo(() => {
    return new Map(
      mediaNFTs.map((nft) => [
        `${nft.collectionId.toString()}:${nft.tokenId}`,
        nft
      ])
    );
  }, [mediaNFTs]);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4",
        "data-ocid": "dividends.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-emerald-500/15 border border-emerald-500/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "h-8 w-8 text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "Connect to view dividends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Sign in to see ICP rewards attached to NFTs you own." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2", onClick: login, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
            "Sign in with Internet Identity"
          ] })
        ] })
      }
    );
  }
  const totalClaimable = dividends.reduce(
    (sum, item) => sum + item.claimableE8s,
    0n
  );
  const claimableItems = dividends.filter((item) => item.claimableE8s > 0n);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 md:px-8 py-8 space-y-6 max-w-6xl mx-auto",
        "data-ocid": "dividends.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-mono", children: "NFT Rewards" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "Dividends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Collect ICP that has been assigned to NFTs you currently hold." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2",
                onClick: () => syncMutation.mutate(),
                disabled: syncMutation.isPending || dividends.length === 0,
                "data-ocid": "dividends.sync_button",
                children: [
                  syncMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                  "Check Deposits"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Claimable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-2xl font-bold text-emerald-600 mt-1", children: [
                formatICP(totalClaimable),
                " ICP"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Eligible NFTs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-foreground mt-1", children: dividends.length })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Ready To Collect" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-foreground mt-1", children: claimableItems.length })
            ] }) })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[32vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading dividends..." }) }) : dividendsFailed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: CircleDollarSign,
              title: "Dividend NFTs could not load",
              description: extractError(dividendsError),
              "data-ocid": "dividends.error_state"
            }
          ) : dividends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Coins,
              title: "No dividend-enabled NFTs",
              description: "Create or hold NFTs from collections that enabled dividends to collect rewards here.",
              "data-ocid": "dividends.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: dividends.map((item, index) => {
            const hydratedNFT = mediaByDividendKey.get(dividendKey(item));
            const nftName = item.nft.metadata.name ?? (hydratedNFT == null ? void 0 : hydratedNFT.metadata.name) ?? `NFT #${item.nft.tokenId}`;
            const imageSrc = item.nft.metadata.imageUrl ?? (hydratedNFT == null ? void 0 : hydratedNFT.metadata.imageUrl);
            const canClaim = item.claimableE8s > ICP_FEE;
            const isClaiming = claimMutation.isPending && claimMutation.variables != null && dividendKey(claimMutation.variables) === dividendKey(item);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border bg-card overflow-hidden",
                "data-ocid": `dividends.item.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex min-h-36", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 sm:w-40 bg-muted shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MediaImage,
                    {
                      src: imageSrc,
                      alt: nftName,
                      assetCanisterId: item.collection.canisterId.toString(),
                      tokenId: item.nft.tokenId,
                      className: "w-full h-full object-cover",
                      loading: "lazy",
                      fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/35" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 min-w-0 flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: [
                          formatICP(item.claimableE8s),
                          " ICP"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            variant: "secondary",
                            className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40",
                            children: [
                              "#",
                              item.nft.tokenId
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground truncate mt-2", children: nftName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: item.collection.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "mt-auto gap-2 self-start",
                        disabled: !canClaim || isClaiming,
                        onClick: () => claimMutation.mutate(item),
                        "data-ocid": `dividends.claim_button.${index + 1}`,
                        children: [
                          isClaiming ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4" }),
                          canClaim ? "Collect ICP" : "Below Fee"
                        ]
                      }
                    )
                  ] })
                ] })
              },
              `${dividendKey(item)}-${index}`
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleRetry != null,
        reason: (cycleRetry == null ? void 0 : cycleRetry.reason) ?? null,
        onOpenChange: (open) => {
          if (!open) setCycleRetry(null);
        },
        onSuccess: () => {
          const retry = cycleRetry;
          setCycleRetry(null);
          if ((retry == null ? void 0 : retry.kind) === "sync") {
            syncMutation.mutate();
          } else if ((retry == null ? void 0 : retry.kind) === "claim") {
            claimMutation.mutate(retry.item);
          }
        }
      }
    )
  ] });
}
export {
  DividendsPage as default
};
