import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, a as cn, u as useAuth, b as useBackend, d as useQueryClient, r as reactExports, e as useQuery, f as ue, W as Wallet, B as Button, L as LogIn, P as Principal } from "./index-DngK8SgJ.js";
import { A as AppCanisterTopUpDialog, i as isLowCyclesError } from "./AppCanisterTopUpDialog-ClDKsOg5.js";
import { C as CollectionBadge, P as PriceDisplay } from "./PriceDisplay-Cq44yU2V.js";
import { M as MediaImage, E as EmptyState } from "./MediaImage-s_aK6QNi.js";
import { B as Badge, u as useMutation, L as Label, I as Input } from "./badge-BYgMj4sx.js";
import { I as ImageOff, r as resolveImageUrl } from "./media-JcaPzrnE.js";
import { P as PaymentConfirmationDialog, T as Tag } from "./PaymentConfirmationDialog-DpeHg7fC.js";
import { R as RefreshCw, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CG3QmFTN.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Dm5T7_x3.js";
import { L as Layers, C as Check, I as Info, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea, E as ExternalLink } from "./textarea-rSDADsJr.js";
import { S as Skeleton, C as Copy } from "./skeleton-Cy8QzKhT.js";
import { C as CircleCheck, S as Send } from "./send-Iqo9Pr8Z.js";
import { C as Coins } from "./coins-C4PLBZuJ.js";
import { P as Plus } from "./plus-DMZ2r3_v.js";
import { S as Sparkles } from "./sparkles-QpqMH6el.js";
import "./index-CYvSbtd2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
];
const Archive = createLucideIcon("archive", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode);
function NFTCard({
  nft,
  collection,
  listingPrice,
  dividendE8s,
  isAuction,
  isListed = false,
  onClick,
  index = 0,
  "data-ocid": dataOcid
}) {
  const name = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const description = nft.metadata.description;
  const locationLabel = isListed ? "Listed" : nft.location === "Registered" ? "Registered" : nft.location === "Vaulted" ? "Vaulted" : "Minted";
  const locationClass = isListed ? "bg-amber-500/10 text-amber-700 border-amber-500/20" : nft.location === "Registered" ? "bg-muted/80 text-muted-foreground border-border/60" : nft.location === "Vaulted" ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      whileHover: { y: -4, scale: 1.01 },
      className: cn(
        "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-smooth",
        "hover:nft-card-glow-hover hover:border-accent/40"
      ),
      onClick,
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-10 h-10 text-muted-foreground/40" }) })
            }
          ),
          isAuction && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs font-mono", children: "AUCTION" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: description })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: cn("text-[10px] border", locationClass),
                children: locationLabel
              }
            ),
            dividendE8s !== void 0 && dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px] border bg-emerald-500/10 text-emerald-700 border-emerald-500/20", children: [
              formatCompactICP(dividendE8s),
              " ICP"
            ] })
          ] }),
          listingPrice !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriceDisplay,
            {
              e8s: listingPrice,
              size: "sm",
              label: isAuction ? "Current bid" : "Price"
            }
          ) })
        ] })
      ]
    }
  );
}
const E8S$1 = 100000000n;
function formatCompactICP(e8s) {
  const whole = e8s / E8S$1;
  const frac = (e8s % E8S$1).toString().padStart(8, "0").slice(0, 4);
  const trimmed = frac.replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function truncate(s, head = 6, tail = 4) {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}
function extractError(err) {
  if (err === null || err === void 0) return "An unexpected error occurred";
  if (typeof err === "string") return err || "An unexpected error occurred";
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "object") {
    const obj = err;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj) || "An unexpected error occurred";
    } catch {
      return "An unexpected error occurred";
    }
  }
  return String(err) || "An unexpected error occurred";
}
const E8S = 100000000n;
const ICP_LEDGER_FEE_E8S = 10000n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
function parseAttributeLines(value) {
  const seen = /* @__PURE__ */ new Set();
  const attributes = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(":") === -1 ? line.indexOf("=") : line.indexOf(":");
    if (separator === -1) {
      throw new Error("Attributes must use Trait: Value, one per line");
    }
    const key = line.slice(0, separator).trim();
    const attrValue = line.slice(separator + 1).trim();
    if (!key || !attrValue) {
      throw new Error("Each attribute needs both a trait name and value");
    }
    const uniqueKey = `${key.toLowerCase()}::${attrValue.toLowerCase()}`;
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      attributes.push([key, attrValue]);
    }
  }
  return attributes;
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
function CopyField({ label, value, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      ue.success(`${label} copied`);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground truncate flex-1 min-w-0", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          className: "shrink-0 w-7 h-7 text-muted-foreground hover:text-foreground",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
function SendNFTModal({ open, onClose, nft, collection }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = reactExports.useState("");
  const [recipientError, setRecipientError] = reactExports.useState("");
  const nftName = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  function validateRecipient(value) {
    if (!value.trim()) return "Recipient Principal ID is required";
    try {
      Principal.fromText(value.trim());
      return "";
    } catch {
      return "Invalid Principal ID format (e.g. aaaaa-aa or rrkah-fqaaa-aaaaa-aaaaq-cai)";
    }
  }
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const err = validateRecipient(recipient);
      if (err) throw new Error(err);
      const recipientPrincipal = Principal.fromText(recipient.trim());
      const result = await actor.sendNFT(nft.id, recipientPrincipal);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (txId) => {
      ue.success(`NFT sent successfully! Transaction: ${txId}`);
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setRecipient("");
      setRecipientError("");
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function handleSend() {
    const err = validateRecipient(recipient);
    if (err) {
      setRecipientError(err);
      return;
    }
    setRecipientError("");
    mutation.mutate();
  }
  function handleClose() {
    if (mutation.isPending) return;
    setRecipient("");
    setRecipientError("");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "send-nft.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 text-accent" }),
          "Send NFT"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              MediaImage,
              {
                src: nft.metadata.imageUrl,
                alt: nftName,
                assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
                tokenId: nft.tokenId,
                className: "w-full h-full object-cover",
                fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-muted-foreground/40" }) })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: nftName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: [
                "Token #",
                nft.tokenId
              ] }),
              collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                CollectionBadge,
                {
                  collection,
                  size: "sm",
                  className: "mt-1"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-destructive shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "This action cannot be undone." }),
              " The NFT will be permanently transferred to the recipient's wallet. Double-check the Principal ID before sending."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "recipient-principal",
                className: "text-sm text-foreground",
                children: [
                  "Recipient Principal ID ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "recipient-principal",
                placeholder: "e.g. rrkah-fqaaa-aaaaa-aaaaq-cai",
                value: recipient,
                onChange: (e) => {
                  setRecipient(e.target.value);
                  if (recipientError)
                    setRecipientError(validateRecipient(e.target.value));
                },
                onBlur: () => setRecipientError(validateRecipient(recipient)),
                className: "bg-muted/30 border-border focus:border-accent font-mono text-sm",
                "data-ocid": "send-nft.recipient.input",
                disabled: mutation.isPending
              }
            ),
            recipientError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "send-nft.recipient.field_error",
                children: recipientError
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The recipient must have a Principal ID (not an Account ID). NFT wallets on ICP use Principal IDs for NFT transfers." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: handleClose,
                disabled: mutation.isPending,
                "data-ocid": "send-nft.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSend,
                disabled: !recipient.trim() || mutation.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2",
                "data-ocid": "send-nft.submit_button",
                children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" }),
                  "Sending…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  "Send NFT"
                ] })
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function NFTDetailsModal({
  open,
  onClose,
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  onSend
}) {
  const nftName = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection == null ? void 0 : collection.canisterId.toString(),
    tokenId: nft.tokenId
  });
  const canisterId = (collection == null ? void 0 : collection.canisterId.toString()) ?? "";
  const canisterUrl = canisterId ? `https://dashboard.internetcomputer.org/canister/${canisterId}` : null;
  const locationLabel = isListed ? "Listed on Market" : nft.location === "Registered" ? "Registered" : nft.location === "Vaulted" ? "Vaulted" : "Minted";
  const locationClass = isListed ? "bg-amber-500/10 text-amber-700 border-amber-500/20" : nft.location === "Registered" ? "bg-muted/80 text-muted-foreground border-border/60" : nft.location === "Vaulted" ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border w-[calc(100vw-2rem)] max-w-3xl p-0 overflow-hidden max-h-[calc(100dvh-2rem)]",
      "data-ocid": "wallet.nft_details.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted h-[min(42vh,360px)] shrink-0 md:h-auto md:min-h-0 flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaImage,
          {
            src: nft.metadata.imageUrl,
            alt: nftName,
            assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
            tokenId: nft.tokenId,
            className: "max-h-full w-full h-full object-contain rounded-lg",
            fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-12 h-12 text-muted-foreground/35" }) })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 overflow-y-auto p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-2 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: `border text-xs ${locationClass}`,
                  children: locationLabel
                }
              ),
              collection && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm" }),
              dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "border text-xs bg-emerald-500/10 text-emerald-700 border-emerald-500/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3 mr-1" }),
                formatICP(dividendE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground break-words", children: nftName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-mono", children: [
              "Token #",
              nft.tokenId
            ] })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed break-words", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Token ID",
                value: nft.tokenId,
                ocid: "wallet.nft_details.copy_token_id"
              }
            ),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Collection Canister",
                value: canisterId,
                ocid: "wallet.nft_details.copy_canister_id"
              }
            ),
            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "NFT Media URL",
                value: imageUrl,
                ocid: "wallet.nft_details.copy_media_url"
              }
            )
          ] }),
          nft.metadata.attributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
              "Attributes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: nft.metadata.attributes.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground truncate", children: key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate mt-0.5", children: value })
                ]
              },
              `wallet-detail-${key}-${value}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2 pt-2", children: [
            canisterUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                variant: "outline",
                className: "gap-2",
                "data-ocid": "wallet.nft_details.view_canister_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: canisterUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                      "View Canister"
                    ]
                  }
                )
              }
            ),
            onSend && nft.location !== "Registered" && !isListed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2",
                onClick: onSend,
                "data-ocid": "wallet.nft_details.send_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  "Send NFT"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  ) });
}
function RegisterNFTModal({
  open,
  onClose,
  collection
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [tokenId, setTokenId] = reactExports.useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.registerNFT(collection.id, tokenId.trim(), {
        attributes: []
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      ue.success("NFT registered successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "register-nft.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent" }),
            "Register NFT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "tokenId", className: "text-sm text-foreground", children: [
              "Token ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "tokenId",
                placeholder: "e.g. 1234",
                value: tokenId,
                onChange: (e) => setTokenId(e.target.value),
                className: "bg-muted/30 border-border focus:border-accent",
                "data-ocid": "register-nft.token_id.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground", children: "The app verifies that you actually own this token on-chain before it imports it. Metadata is fetched from the collection automatically." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: onClose,
                disabled: mutation.isPending,
                "data-ocid": "register-nft.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => mutation.mutate(),
                disabled: !tokenId.trim() || mutation.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
                "data-ocid": "register-nft.submit_button",
                children: mutation.isPending ? "Registering…" : "Register NFT"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function VaultDepositCard({
  collections,
  vaultPrincipalText,
  vaultAccountIdHex
}) {
  var _a;
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const externalCollections = collections.filter(
    (collection) => collection.kind === "External"
  );
  const [collectionId, setCollectionId] = reactExports.useState(
    ((_a = externalCollections[0]) == null ? void 0 : _a.id.toString()) ?? ""
  );
  const [tokenId, setTokenId] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!collectionId && externalCollections[0]) {
      setCollectionId(externalCollections[0].id.toString());
    }
  }, [collectionId, externalCollections]);
  const prepareMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!collectionId) throw new Error("Choose a collection first");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.prepareVaultDeposit(
        BigInt(collectionId),
        tokenId.trim()
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (message) => {
      ue.success(message);
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!collectionId) throw new Error("Choose a collection first");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.claimVaultDeposit(
        BigInt(collectionId),
        tokenId.trim()
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("NFT deposited into the app vault");
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-accent" }),
        "Vault Deposit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Send a supported external NFT to the app vault, then claim it into your in-app wallet as a vaulted asset. Preparing first is optional, but helps reserve the token for your account before it arrives." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: externalCollections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No external collections are enabled yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: collectionId, onValueChange: setCollectionId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "wallet.deposit.collection_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a supported collection" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: externalCollections.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectItem,
              {
                value: collection.id.toString(),
                children: collection.name
              },
              collection.id.toString()
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "deposit-token-id", children: "Token ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "deposit-token-id",
              value: tokenId,
              onChange: (e) => setTokenId(e.target.value),
              placeholder: "e.g. 1234",
              "data-ocid": "wallet.deposit.token_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        vaultPrincipalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CopyField,
          {
            label: "Vault Principal",
            value: vaultPrincipalText,
            ocid: "wallet.deposit.vault_principal_copy"
          }
        ),
        vaultAccountIdHex && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CopyField,
          {
            label: "Vault Account ID",
            value: vaultAccountIdHex,
            ocid: "wallet.deposit.vault_account_copy"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground", children: [
        "If the NFT has not been sent yet, click",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Prepare deposit" }),
        ", then send it from your external wallet to the vault principal. If it was already sent, skip prepare and click",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Claim deposit" }),
        " to register the vaulted NFT inside the app."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => prepareMutation.mutate(),
            disabled: prepareMutation.isPending || !collectionId || !tokenId.trim(),
            "data-ocid": "wallet.deposit.prepare_button",
            children: prepareMutation.isPending ? "Preparing…" : "Prepare Deposit"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => claimMutation.mutate(),
            disabled: claimMutation.isPending || !collectionId || !tokenId.trim(),
            "data-ocid": "wallet.deposit.claim_button",
            children: claimMutation.isPending ? "Claiming…" : "Claim Deposit"
          }
        )
      ] })
    ] }) })
  ] });
}
function MintComposer({
  mintConfig,
  moderationConfig,
  mainCollection,
  creatorCollections
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [attributesText, setAttributesText] = reactExports.useState("");
  const [imageDataUrl, setImageDataUrl] = reactExports.useState(null);
  const [fileName, setFileName] = reactExports.useState("");
  const [selectedTarget, setSelectedTarget] = reactExports.useState("");
  const [confirmMintOpen, setConfirmMintOpen] = reactExports.useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = reactExports.useState(null);
  const mainMintAvailable = (mintConfig == null ? void 0 : mintConfig.mainMintEnabled) === true && mintConfig.collectionId != null && mainCollection != null;
  reactExports.useEffect(() => {
    const targetStillAvailable = selectedTarget === "main" && mainMintAvailable || creatorCollections.some(
      (collection) => `collection:${collection.id.toString()}` === selectedTarget
    );
    if (targetStillAvailable) return;
    if (mainMintAvailable) {
      setSelectedTarget("main");
      return;
    }
    if (creatorCollections.length > 0) {
      setSelectedTarget(`collection:${creatorCollections[0].id.toString()}`);
      return;
    }
    setSelectedTarget("");
  }, [creatorCollections, mainMintAvailable, selectedTarget]);
  const selectedCollection = creatorCollections.find(
    (collection) => `collection:${collection.id.toString()}` === selectedTarget
  ) ?? null;
  const targetCollection = selectedTarget === "main" ? mainCollection : selectedCollection;
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      const metadata = {
        name: name.trim() || void 0,
        description: description.trim() || void 0,
        imageUrl: imageDataUrl,
        attributes: parseAttributeLines(attributesText)
      };
      if (selectedTarget === "main") {
        const result2 = await actor.mintUserNFT(metadata);
        if (result2.__kind__ === "err") throw new Error(result2.err);
        return result2.ok.nft;
      }
      const result = await actor.mintCollectionNFT(
        targetCollection.id,
        metadata
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (nft) => {
      const displayName = nft.metadata.name ?? `#${nft.tokenId}`;
      ue.success(
        `Minted ${displayName} into ${(targetCollection == null ? void 0 : targetCollection.name) ?? "the collection"}`
      );
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionNFTs", (targetCollection == null ? void 0 : targetCollection.id.toString()) ?? ""]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      setName("");
      setDescription("");
      setAttributesText("");
      setImageDataUrl(null);
      setFileName("");
    },
    onError: (err) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      ue.error(message);
    }
  });
  async function handleFileChange(file) {
    if (!file) {
      setImageDataUrl(null);
      setFileName("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }
  function startMint() {
    try {
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      parseAttributeLines(attributesText);
      if (selectedTarget === "main" && (mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s)) {
        setConfirmMintOpen(true);
        return;
      }
      mutation.mutate();
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-accent" }),
          "Mint NFTs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload artwork, choose a collection, and add optional traits for filtering and discovery." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: !mintConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Minting has not been configured by the admin yet." }) : !mainMintAvailable && creatorCollections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: "Create your first Mintlab collection on the Collections page, or wait for the admin to enable public minting into the main collection." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: [
          "Collection creation fee:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            formatICP(mintConfig.collectionCreationPriceE8s),
            " ICP"
          ] }),
          mintConfig.collectionCreationEnabled ? "" : " - collection creation is currently disabled by the admin"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-collection", children: "Mint target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedTarget,
                onValueChange: setSelectedTarget,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "mint-collection",
                      "data-ocid": "wallet.mint.collection_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a collection" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    mainMintAvailable && mainCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "main", children: [
                      mainCollection.name,
                      " (",
                      formatICP(mintConfig.mainMintPriceE8s),
                      " ICP)"
                    ] }),
                    creatorCollections.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      SelectItem,
                      {
                        value: `collection:${collection.id.toString()}`,
                        children: [
                          collection.name,
                          " (",
                          collection.symbol,
                          ")"
                        ]
                      },
                      collection.id.toString()
                    ))
                  ] })
                ]
              }
            )
          ] }),
          targetCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CopyField,
            {
              label: "Collection Canister",
              value: targetCollection.canisterId.toString(),
              ocid: "wallet.mint.copy_canister_id"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: selectedTarget === "main" ? `Minting into the main collection costs ${formatICP(mintConfig.mainMintPriceE8s)} ICP from your in-app account.` : "Creator collections use their own dedicated ICRC-7 canister." }),
        (moderationConfig == null ? void 0 : moderationConfig.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground", children: moderationConfig.userMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-name", children: "NFT name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "mint-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Vault Original #1",
                "data-ocid": "wallet.mint.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-image", children: "Image upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "mint-image",
                type: "file",
                accept: "image/*",
                onChange: (e) => {
                  var _a;
                  return void handleFileChange(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "wallet.mint.image_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fileName || "Choose an image to store with the minted NFT" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-description", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "mint-description",
              rows: 3,
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: "Describe your NFT…",
              "data-ocid": "wallet.mint.description_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "mint-attributes", children: [
            "Attributes",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(Trait: Value)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "mint-attributes",
              rows: 3,
              value: attributesText,
              onChange: (e) => setAttributesText(e.target.value),
              placeholder: "Rarity: Rare\nSeries: Genesis",
              "data-ocid": "wallet.mint.attributes_textarea"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attributes are optional traits like Background: Blue or Rarity: Rare. They appear as filters on collection pages." })
        ] }),
        imageDataUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageDataUrl,
            alt: "Mint preview",
            className: "w-28 h-28 rounded-lg object-cover border border-border/50"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: startMint,
            disabled: mutation.isPending || !targetCollection,
            className: "gap-2",
            "data-ocid": "wallet.mint.submit_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }),
              mutation.isPending ? "Minting..." : "Mint NFT"
            ]
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentConfirmationDialog,
      {
        open: confirmMintOpen,
        onOpenChange: setConfirmMintOpen,
        title: "Confirm Mint Payment",
        description: (moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Mintlab checks the upload against the current moderation policy before any ICP is transferred." : "Confirm the ICP payment from your in-app account before this NFT is minted.",
        lines: [
          {
            label: "Mint price",
            value: `${formatICP((mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s) ?? 0n)} ICP`
          },
          {
            label: "Ledger fee",
            value: `${formatICP(ICP_LEDGER_FEE_E8S)} ICP`
          },
          {
            label: "Total debit",
            value: `${formatICP(
              ((mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s) ?? 0n) + ICP_LEDGER_FEE_E8S
            )} ICP`
          }
        ],
        confirmLabel: "Mint NFT",
        isPending: mutation.isPending,
        onConfirm: () => {
          setConfirmMintOpen(false);
          mutation.mutate();
        },
        ocid: "wallet.mint.payment_dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleTopUpReason != null,
        reason: cycleTopUpReason,
        onOpenChange: (open) => {
          if (!open) setCycleTopUpReason(null);
        },
        onSuccess: () => mutation.mutate()
      }
    )
  ] });
}
function StatsBar({ stats, isLoading }) {
  const totalNFTs = stats ? Number(stats.totalCount) : 0;
  const totalCollections = stats ? stats.perCollection.length : 0;
  const items = [
    {
      icon: Wallet,
      label: "Total NFTs",
      value: isLoading ? null : totalNFTs,
      ocid: "wallet.stats.total_nfts"
    },
    {
      icon: Layers,
      label: "Collections",
      value: isLoading ? null : totalCollections,
      ocid: "wallet.stats.total_collections"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: items.map(({ icon: Icon, label, value, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-accent" }) }),
        value === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg leading-none text-foreground", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
        ] })
      ]
    },
    label
  )) });
}
function ReceivingInstructions({
  principalText,
  accountIdHex,
  onSync,
  syncStatus
}) {
  const isSyncing = syncStatus.kind === "syncing";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.05 },
      className: "bg-card border border-border rounded-2xl overflow-hidden",
      "data-ocid": "wallet.receiving_instructions",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-accent/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: "Receive NFTs & ICP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            syncStatus.kind === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "flex items-center gap-1 text-xs text-accent font-medium",
                "data-ocid": "wallet.sync.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  syncStatus.newCount === 1 ? "1 new NFT found" : `${syncStatus.newCount} new NFTs found`
                ]
              }
            ),
            syncStatus.kind === "upToDate" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "flex items-center gap-1 text-xs text-muted-foreground",
                "data-ocid": "wallet.sync.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                  "Up to date"
                ]
              }
            ),
            syncStatus.kind === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "text-xs text-destructive truncate max-w-[160px]",
                title: syncStatus.message,
                "data-ocid": "wallet.sync.error_state",
                children: syncStatus.message
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
                onClick: onSync,
                disabled: isSyncing,
                "data-ocid": "wallet.refresh_button",
                "aria-label": "Sync NFTs from chain",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `w-3 h-3 ${isSyncing ? "animate-spin" : ""}`
                    }
                  ),
                  isSyncing ? "Syncing…" : "Sync"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            principalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Principal ID — use to receive NFTs",
                value: principalText,
                ocid: "wallet.copy_principal_button"
              }
            ),
            accountIdHex ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Account ID — use to receive ICP",
                value: accountIdHex,
                ocid: "wallet.copy_account_id_button"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Account ID — use to receive ICP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" })
            ] })
          ] }),
          isSyncing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-lg",
              "data-ocid": "wallet.sync.loading_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent leading-relaxed", children: "Checking on-chain ownership across all collections — this may take up to 15 seconds…" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-muted/30 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "To receive NFTs:" }),
              " Share your ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Principal ID" }),
              " with the sender (Plug wallet, other ICP apps). After sending, click",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Sync" }),
              " to check on-chain ownership and auto-register any new NFTs. Use your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Account ID" }),
              " for receiving ICP token transfers."
            ] })
          ] })
        ] })
      ]
    }
  );
}
function UnauthHero({ login }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full flex flex-col items-center justify-center text-center py-24 px-6",
      "data-ocid": "wallet.unauthenticated_hero",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-24 h-24 rounded-full nft-card-glow",
              style: {
                background: "radial-gradient(circle, oklch(var(--accent) / 0.3) 0%, oklch(var(--primary) / 0.15) 60%, transparent 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-10 h-10 text-accent" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-4xl text-foreground mb-3", children: "Your NFT Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-md leading-relaxed mb-8", children: "Connect with Internet Identity to view your NFTs, track collection stats, and register assets to your wallet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            onClick: login,
            className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2 font-semibold px-8 py-3",
            "data-ocid": "wallet.login_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
              "Connect with Internet Identity"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-5", children: "No account needed — Internet Identity is secure & anonymous" })
      ]
    }
  );
}
function CollectionSection({
  collection,
  nfts,
  listedNFTKeys,
  sectionIndex,
  isCreatorCollection,
  dividendBalances
}) {
  var _a;
  const [registerOpen, setRegisterOpen] = reactExports.useState(false);
  const [detailNft, setDetailNft] = reactExports.useState(null);
  const [sendNft, setSendNft] = reactExports.useState(null);
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const isNFTListed = (nft) => listedNFTKeys.has(nftKey(nft.collectionId, nft.tokenId));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.4, delay: sectionIndex * 0.08 },
      "data-ocid": `wallet.collection.${sectionIndex + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: collectionImageUrl,
                alt: collection.name,
                className: "w-9 h-9 rounded-full border border-border/60 object-cover shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg truncate", children: collection.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "font-mono text-xs shrink-0 bg-muted/60 text-muted-foreground border border-border/40",
                    children: [
                      nfts.length,
                      " NFT",
                      nfts.length !== 1 ? "s" : ""
                    ]
                  }
                ),
                isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-accent/10 text-accent border border-accent/20", children: "Your Collection" }),
                ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: "Dividends" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CollectionBadge,
                {
                  collection,
                  size: "sm",
                  className: "mt-0.5"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => setRegisterOpen(true),
              className: "shrink-0 gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60",
              "data-ocid": `wallet.register_nft_button.${sectionIndex + 1}`,
              disabled: collection.kind !== "External",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                collection.kind === "External" ? "Import NFT" : "Mint in Studio"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Collection Canister" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-mono text-sm text-foreground", children: collection.canisterId.toString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5",
              onClick: () => {
                void navigator.clipboard.writeText(
                  collection.canisterId.toString()
                );
                ue.success("Collection canister copied");
              },
              "data-ocid": `wallet.copy_collection_canister.${sectionIndex + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
                "Copy"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: nfts.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NFTCard,
            {
              nft,
              collection,
              isListed: isNFTListed(nft),
              dividendE8s: dividendBalances.get(nftKey(nft.collectionId, nft.tokenId)) ?? 0n,
              index: i,
              onClick: () => setDetailNft(nft),
              "data-ocid": `wallet.nft.item.${sectionIndex * 100 + i + 1}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg hover:bg-accent/90",
              onClick: (e) => {
                e.stopPropagation();
                setSendNft(nft);
              },
              "data-ocid": `wallet.send_nft_button.${sectionIndex * 100 + i + 1}`,
              "aria-label": `Send ${nft.metadata.name ?? `NFT #${nft.tokenId}`}`,
              disabled: nft.location === "Registered" || isNFTListed(nft),
              hidden: nft.location === "Registered" || isNFTListed(nft),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" }),
                "Send"
              ]
            }
          )
        ] }, nft.id.toString())) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RegisterNFTModal,
          {
            open: registerOpen,
            onClose: () => setRegisterOpen(false),
            collection
          }
        ),
        sendNft && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SendNFTModal,
          {
            open: !!sendNft,
            onClose: () => setSendNft(null),
            nft: sendNft,
            collection
          }
        ),
        detailNft && /* @__PURE__ */ jsxRuntimeExports.jsx(
          NFTDetailsModal,
          {
            open: !!detailNft,
            onClose: () => setDetailNft(null),
            nft: detailNft,
            collection,
            isListed: isNFTListed(detailNft),
            dividendE8s: dividendBalances.get(
              nftKey(detailNft.collectionId, detailNft.tokenId)
            ) ?? 0n,
            onSend: detailNft.location === "Registered" || isNFTListed(detailNft) ? void 0 : () => {
              setDetailNft(null);
              setSendNft(detailNft);
            }
          }
        )
      ]
    }
  );
}
function WalletPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    principal,
    principalText
  } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const bootstrappedRef = reactExports.useRef(false);
  const autoSyncedPrincipalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isAuthenticated && actor && !isFetching && !bootstrappedRef.current) {
      bootstrappedRef.current = true;
      actor.bootstrapAdmin().then(() => {
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
        queryClient.invalidateQueries({ queryKey: ["adminPrincipal"] });
      }).catch(() => {
      });
    }
  }, [isAuthenticated, actor, isFetching, queryClient]);
  const {
    data: userNFTs,
    isLoading: nftsLoading,
    refetch: refetchNFTs
  } = useQuery({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal
  });
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", principalText],
    queryFn: async () => {
      if (!actor || !principal) throw new Error("No actor");
      return actor.getNFTStats(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal
  });
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: accountIdBytes } = useQuery({
    queryKey: ["userAccountId", principalText],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: vaultPrincipal } = useQuery({
    queryKey: ["vaultPrincipal"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVaultPrincipal();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: vaultAccountIdBytes } = useQuery({
    queryKey: ["vaultAccountId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVaultAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: mintConfig } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: moderationConfig } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCreatedCollections = [] } = useQuery({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: activeListingDetails = [] } = useQuery({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myDividendNFTs = [] } = useQuery({
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
  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const vaultPrincipalText = (vaultPrincipal == null ? void 0 : vaultPrincipal.toString()) ?? null;
  const vaultAccountIdHex = vaultAccountIdBytes ? accountIdToHex(vaultAccountIdBytes) : null;
  const listedNFTKeys = new Set(
    activeListingDetails.filter((detail) => {
      const seller = detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.seller : detail.listing.Auction.seller;
      return principal ? seller.toString() === principal.toString() : false;
    }).map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId))
  );
  const collectionMap = /* @__PURE__ */ new Map();
  for (const c of collections ?? []) {
    collectionMap.set(c.id, c);
  }
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id)
  );
  const dividendBalances = new Map(
    myDividendNFTs.map((item) => [
      nftKey(item.nft.collectionId, item.nft.tokenId),
      item.claimableE8s
    ])
  );
  const nftsByCollection = /* @__PURE__ */ new Map();
  for (const nft of userNFTs ?? []) {
    const existing = nftsByCollection.get(nft.collectionId) ?? [];
    existing.push(nft);
    nftsByCollection.set(nft.collectionId, existing);
  }
  const collectionEntries = [];
  nftsByCollection.forEach((nfts, collId) => {
    const coll = collectionMap.get(collId);
    if (coll) collectionEntries.push({ collection: coll, nfts });
  });
  const hasNFTs = ((userNFTs == null ? void 0 : userNFTs.length) ?? 0) > 0;
  const dataLoading = nftsLoading || statsLoading || isFetching;
  const [syncStatus, setSyncStatus] = reactExports.useState({ kind: "idle" });
  reactExports.useEffect(() => {
    if (syncStatus.kind === "ok" || syncStatus.kind === "upToDate" || syncStatus.kind === "error") {
      const id = setTimeout(() => setSyncStatus({ kind: "idle" }), 6e3);
      return () => clearTimeout(id);
    }
  }, [syncStatus]);
  const handleSync = reactExports.useCallback(
    async (options = {}) => {
      if (!actor) return;
      const silent = options.silent === true;
      if (!silent) setSyncStatus({ kind: "syncing" });
      try {
        const actorAny = actor;
        if (typeof actorAny.syncUserNFTs !== "function") {
          await refetchNFTs();
          if (!silent) setSyncStatus({ kind: "upToDate" });
          return;
        }
        const result = await actorAny.syncUserNFTs();
        if ("err" in result) {
          if (!silent) {
            setSyncStatus({ kind: "error", message: result.err });
            ue.error(`Sync failed: ${result.err}`);
          }
        } else {
          const newCount = Number(result.ok.newCount);
          if (result.ok.errors.length > 0) {
            console.warn("[syncUserNFTs] partial errors:", result.ok.errors);
          }
          if (newCount > 0) {
            if (!silent) {
              setSyncStatus({ kind: "ok", newCount });
              ue.success(
                newCount === 1 ? "Synced — 1 new NFT found and registered!" : `Synced — ${newCount} new NFTs found and registered!`
              );
            }
          } else {
            if (!silent) {
              setSyncStatus({ kind: "upToDate" });
              ue.success("Wallet is up to date");
            }
          }
        }
      } catch (err) {
        const msg = extractError(err);
        if (!silent) {
          setSyncStatus({ kind: "error", message: msg });
          ue.error(`Sync error: ${msg}`);
        }
      } finally {
        void refetchNFTs();
        void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      }
    },
    [actor, queryClient, refetchNFTs]
  );
  reactExports.useEffect(() => {
    if (!actor || !isAuthenticated || !principalText || isFetching || nftsLoading || !collections) {
      return;
    }
    if (autoSyncedPrincipalRef.current === principalText) return;
    autoSyncedPrincipalRef.current = principalText;
    void handleSync({ silent: true });
  }, [
    actor,
    collections,
    isAuthenticated,
    isFetching,
    nftsLoading,
    principalText,
    handleSync
  ]);
  if (!isAuthenticated && !authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(UnauthHero, { login });
  }
  if (authLoading || isAuthenticated && dataLoading && !userNFTs) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto",
        "data-ocid": "wallet.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-44 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-44 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-xl" }, k)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto",
      "data-ocid": "wallet.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            className: "space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "My Wallet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your NFTs and account details" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { stats: userStats, isLoading: statsLoading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReceivingInstructions,
          {
            principalText,
            accountIdHex,
            onSync: handleSync,
            syncStatus
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VaultDepositCard,
          {
            collections: collections ?? [],
            vaultPrincipalText,
            vaultAccountIdHex
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MintComposer,
          {
            mintConfig: mintConfig ?? null,
            moderationConfig: moderationConfig ?? null,
            mainCollection: (mintConfig == null ? void 0 : mintConfig.collectionId) ? collectionMap.get(mintConfig.collectionId) ?? null : null,
            creatorCollections: myCreatedCollections
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        !hasNFTs ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Wallet,
              title: "No NFTs yet",
              description: "Register an NFT you received externally, import a supported collection, or create your own Mintlab collection first. Use your Principal ID above to receive NFTs from any ICP wallet.",
              "data-ocid": "wallet.empty_state"
            }
          ),
          (collections ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-4", children: "Supported collections — register an NFT from any of these:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: (collections ?? []).map((c, idx) => {
              const collectionImageUrl = resolveImageUrl(c.imageUrl);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-sm",
                  "data-ocid": `wallet.supported_collection.${idx + 1}`,
                  children: [
                    collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: collectionImageUrl,
                        alt: c.name,
                        className: "w-5 h-5 rounded-full border border-border/50 object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[140px]", children: c.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: truncate(c.canisterId.toString(), 5, 3) })
                  ]
                },
                c.id.toString()
              );
            }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", "data-ocid": "wallet.nft_list", children: collectionEntries.map(({ collection, nfts }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionSection,
          {
            collection,
            nfts,
            listedNFTKeys,
            sectionIndex: idx,
            isCreatorCollection: myCreatedCollectionIds.has(collection.id),
            dividendBalances
          },
          collection.id.toString()
        )) })
      ]
    }
  );
}
export {
  WalletPage as default
};
