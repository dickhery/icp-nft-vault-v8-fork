import { r as reactExports, j as jsxRuntimeExports, a as cn, i as useNavigate, k as useAdmin, b as useBackend, d as useQueryClient, e as useQuery, l as Shield, f as ue, P as Principal, B as Button } from "./index-DngK8SgJ.js";
import { A as AlertDialog, i as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./index-CYvSbtd2.js";
import { g as Primitive, u as useMutation, L as Label, I as Input, B as Badge } from "./badge-BYgMj4sx.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent, R as RefreshCw } from "./card-CG3QmFTN.js";
import { L as Layers, e as ChevronDown, T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, E as ExternalLink, I as Info, C as Check } from "./textarea-rSDADsJr.js";
import { S as Skeleton, C as Copy } from "./skeleton-Cy8QzKhT.js";
import { S as Switch, T as Trash2 } from "./switch-D-14nziw.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-JcaPzrnE.js";
import { P as Plus, L as LoaderCircle } from "./plus-DMZ2r3_v.js";
import { C as CircleAlert } from "./circle-alert-CmDq1s66.js";
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const E8S = 100000000n;
const MIN_COLLECTION_CANISTER_CYCLES = 2000000000000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 15e5;
const DEFAULT_MODERATION_MESSAGE = "Uploads cannot include nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or other NSFW material.";
const defaultModerationCategories = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: true,
  hateOrHarassment: true,
  hateSymbols: true,
  illegalOrDangerous: true,
  selfHarm: true,
  otherNsfw: true
};
const moderationCategoryLabels = [
  { key: "nudityOrSexual", label: "Nudity or sexual content" },
  { key: "graphicViolence", label: "Graphic violence or gore" },
  { key: "explicitLanguage", label: "Explicit words" },
  { key: "hateOrHarassment", label: "Hate or harassment" },
  { key: "hateSymbols", label: "Hate symbols" },
  { key: "illegalOrDangerous", label: "Illegal or dangerous activity" },
  { key: "selfHarm", label: "Self-harm content" },
  { key: "otherNsfw", label: "Other NSFW content" }
];
function truncatePrincipal(p) {
  if (p.length <= 24) return p;
  return `${p.slice(0, 10)}…${p.slice(-8)}`;
}
function makeStandard(raw, otherValue) {
  if (raw === "EXT") return { __kind__: "EXT", EXT: null };
  if (raw === "DIP721") return { __kind__: "DIP721", DIP721: null };
  if (raw === "ICRC7") return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: otherValue };
}
function standardLabel(s) {
  if (s.__kind__ === "ICRC7") return "ICRC-7";
  return s.__kind__ === "Other" ? s.Other || "Other" : s.__kind__;
}
function standardVariant(s) {
  if (s.__kind__ === "EXT") return "default";
  if (s.__kind__ === "DIP721") return "secondary";
  if (s.__kind__ === "ICRC7") return "secondary";
  return "outline";
}
function isValidPrincipal(value) {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}
function extractError(err) {
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "string") return err;
  if (err !== null && typeof err === "object") {
    const obj = err;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj);
    } catch {
    }
  }
  return "An unexpected error occurred";
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
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
function formatCycles(cycles) {
  const trillion = 1000000000000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = cycles * 100n / trillion;
  const whole = hundredths / 100n;
  const frac = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${frac}T`;
}
function parseICPToE8s(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{0,8})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  return BigInt(wholePart) * E8S + BigInt(`${fracPart}00000000`.slice(0, 8));
}
function parseWholeBigInt(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}
async function readImageFileAsDataUrl(file) {
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Choose an image file");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > MAX_ON_CHAIN_IMAGE_CHARS) {
    throw new Error("Uploaded image is too large for on-chain storage");
  }
  return dataUrl;
}
function readFileAsBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("Could not read WASM file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read WASM file"));
    reader.readAsArrayBuffer(file);
  });
}
function CopyButton({ text }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: copy,
      "aria-label": "Copy canister ID",
      className: "ml-1 text-muted-foreground hover:text-foreground transition-colors",
      "data-ocid": "admin.copy_button",
      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 })
    }
  );
}
const GUIDE_STEPS = [
  {
    num: 1,
    title: "Get the Collection's Canister ID",
    body: "Every NFT collection on the Internet Computer has a unique Canister ID (looks like: ryjl3-tyaaa-aaaaa-aaaba-cai). Get this from the collection's official website or creator."
  },
  {
    num: 2,
    title: "Choose the Right NFT Standard",
    body: "EXT (Entrepot) is used by many older ICP collections, DIP721 is another common standard, and newer ledgers may expose ICRC-7. If unsure, check the collection's documentation. Choosing the wrong standard will cause transfer errors."
  },
  {
    num: 3,
    title: "Fill In the Form",
    body: "Enter the Canister ID, a display name, symbol, optional description and collection image, then select the NFT Standard and click Add Collection."
  },
  {
    num: 4,
    title: "Verify the Collection Works",
    body: "After adding, users with NFTs from that collection should be able to register them in their wallet using the token ID. If transfers fail, double-check the canister ID and NFT standard."
  }
];
function CollectionSetupGuide() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-primary/25 overflow-hidden bg-primary/3",
      "data-ocid": "admin.setup_guide",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-primary/5 transition-colors text-left",
            onClick: () => setOpen((v) => !v),
            "data-ocid": "admin.setup_guide.toggle",
            "aria-expanded": open,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: "How to Add NFT Collections" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Step-by-step setup guide for admins" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 16,
                  className: `text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 space-y-5 border-t border-primary/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-4", children: GUIDE_STEPS.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3",
              "data-ocid": `admin.setup_guide.step.${step.num}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: step.num }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-snug", children: step.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mt-0.5", children: step.body })
                ] })
              ]
            },
            step.num
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-primary/15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 p-3 bg-destructive/5 border border-destructive/20 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleAlert,
              {
                size: 15,
                className: "text-destructive shrink-0 mt-0.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Troubleshooting Transfer Errors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "If users report transfer errors, verify:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-0.5 list-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The canister ID is correct and the collection is deployed on mainnet."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The NFT standard matches what the collection actually uses (EXT vs DIP721 vs ICRC-7)."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The collection canister is accessible (not paused or private)."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed mt-1.5 pt-1.5 border-t border-destructive/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Note:" }),
                " Most collections on the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "https://entrepot.app",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-primary underline underline-offset-2",
                    children: "Entrepot marketplace"
                  }
                ),
                " ",
                "use the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "EXT standard" }),
                ". Collections deployed independently may use DIP721 or ICRC-7."
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CollectionRow({
  collection,
  index,
  onRemove
}) {
  const [imgError, setImgError] = reactExports.useState(false);
  const pid = collection.canisterId.toString();
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors",
      "data-ocid": `admin.collection.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center", children: !imgError && imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageUrl,
            alt: collection.name,
            className: "w-full h-full object-cover",
            onError: () => setImgError(true)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { size: 18, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: collection.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: collection.kind === "Minted" ? "secondary" : "outline",
                className: "text-[10px] shrink-0",
                children: collection.kind === "Minted" ? "Minted" : "External"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: standardVariant(collection.standard),
                className: "text-xs shrink-0",
                children: standardLabel(collection.standard)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono truncate flex items-center gap-1", children: [
            truncatePrincipal(pid),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: pid })
          ] }),
          collection.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: collection.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block text-xs font-mono font-semibold text-muted-foreground px-2 py-1 rounded bg-muted shrink-0", children: collection.symbol }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-destructive hover:bg-destructive/10 shrink-0",
              "data-ocid": `admin.collection.delete_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.remove_collection.dialog", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove Collection?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: collection.name }),
                " will be removed from the platform. Existing registered NFTs from this collection won't be deleted but new registrations won't be possible."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.remove_collection.cancel_button", children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  onClick: () => onRemove(collection.id),
                  "data-ocid": "admin.remove_collection.confirm_button",
                  children: "Remove"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function MintConfigForm() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [symbol, setSymbol] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [collectionCreationPayout, setCollectionCreationPayout] = reactExports.useState("");
  const [collectionCreationPrice, setCollectionCreationPrice] = reactExports.useState("");
  const [collectionCreationEnabled, setCollectionCreationEnabled] = reactExports.useState(false);
  const [mainMintPayout, setMainMintPayout] = reactExports.useState("");
  const [mainMintPrice, setMainMintPrice] = reactExports.useState("");
  const [mainMintEnabled, setMainMintEnabled] = reactExports.useState(false);
  const [marketplaceFeePayout, setMarketplaceFeePayout] = reactExports.useState("");
  const [marketplaceFeeInitialized, setMarketplaceFeeInitialized] = reactExports.useState(false);
  const [mainMintDividendsEnabled, setMainMintDividendsEnabled] = reactExports.useState(false);
  const [collectionCanisterCycles, setCollectionCanisterCycles] = reactExports.useState("1000000000000");
  const [wasmBytes, setWasmBytes] = reactExports.useState(null);
  const [wasmFileName, setWasmFileName] = reactExports.useState("");
  const [initialized, setInitialized] = reactExports.useState(false);
  const [moderationEnabled, setModerationEnabled] = reactExports.useState(false);
  const [xaiApiKey, setXaiApiKey] = reactExports.useState("");
  const [clearXaiApiKey, setClearXaiApiKey] = reactExports.useState(false);
  const [moderationModel, setModerationModel] = reactExports.useState("grok-4.3");
  const [moderationMessage, setModerationMessage] = reactExports.useState(
    DEFAULT_MODERATION_MESSAGE
  );
  const [moderationCategories, setModerationCategories] = reactExports.useState(defaultModerationCategories);
  const [moderationInitialized, setModerationInitialized] = reactExports.useState(false);
  const { data: mintConfig, isLoading: mintConfigLoading } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor
  });
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor
  });
  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeLoading } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor
  });
  const { data: moderationConfig, isLoading: moderationConfigLoading } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor
  });
  const parsedCreationPriceE8s = parseICPToE8s(collectionCreationPrice);
  const parsedCollectionCanisterCycles = parseWholeBigInt(
    collectionCanisterCycles
  );
  const canQuoteCreationCost = !!actor && parsedCreationPriceE8s !== null && parsedCollectionCanisterCycles !== null;
  const {
    data: creationQuote,
    error: creationQuoteError,
    isFetching: creationQuoteFetching
  } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      collectionCreationPrice.trim(),
      collectionCanisterCycles.trim()
    ],
    queryFn: async () => {
      if (!actor || parsedCreationPriceE8s === null || parsedCollectionCanisterCycles === null) {
        return null;
      }
      return actor.quoteCollectionCreationCost(
        parsedCollectionCanisterCycles,
        parsedCreationPriceE8s
      );
    },
    enabled: canQuoteCreationCost,
    staleTime: 6e4
  });
  const creationPriceBelowCycles = !!creationQuote && parsedCreationPriceE8s !== null && parsedCreationPriceE8s < creationQuote.minimumCreationPriceE8s;
  const mainCollection = (mintConfig == null ? void 0 : mintConfig.collectionId) ? collections == null ? void 0 : collections.find(
    (collection) => collection.id === mintConfig.collectionId
  ) : null;
  const dedicatedMintlabCollections = (collections == null ? void 0 : collections.filter(
    (collection) => collection.kind === "Minted" && collection.id !== (mintConfig == null ? void 0 : mintConfig.collectionId)
  )) ?? [];
  reactExports.useEffect(() => {
    var _a;
    if (initialized || !mintConfig) return;
    setName((mainCollection == null ? void 0 : mainCollection.name) ?? "");
    setSymbol((mainCollection == null ? void 0 : mainCollection.symbol) ?? "");
    setDescription((mainCollection == null ? void 0 : mainCollection.description) ?? "");
    setImageUrl((mainCollection == null ? void 0 : mainCollection.imageUrl) ?? "");
    setImageFileName((mainCollection == null ? void 0 : mainCollection.imageUrl) ? "Current image" : "");
    setCollectionCreationPayout(
      mintConfig.collectionCreationPayoutAccount ? accountIdToHex(mintConfig.collectionCreationPayoutAccount) : ""
    );
    setCollectionCreationPrice(
      mintConfig.collectionCreationPriceE8s > 0n ? formatICP(mintConfig.collectionCreationPriceE8s) : "0"
    );
    setCollectionCreationEnabled(mintConfig.collectionCreationEnabled);
    setMainMintPayout(
      mintConfig.mainMintPayoutAccount ? accountIdToHex(mintConfig.mainMintPayoutAccount) : ""
    );
    setMainMintPrice(
      mintConfig.mainMintPriceE8s > 0n ? formatICP(mintConfig.mainMintPriceE8s) : "0"
    );
    setMainMintEnabled(mintConfig.mainMintEnabled);
    setMainMintDividendsEnabled(
      ((_a = mainCollection == null ? void 0 : mainCollection.dividendConfig) == null ? void 0 : _a.enabled) === true
    );
    setCollectionCanisterCycles(mintConfig.collectionCanisterCycles.toString());
    setInitialized(true);
  }, [initialized, mintConfig, mainCollection]);
  reactExports.useEffect(() => {
    if (moderationInitialized || !moderationConfig) return;
    setModerationEnabled(moderationConfig.enabled);
    setModerationModel(moderationConfig.model || "grok-4.3");
    setModerationMessage(
      moderationConfig.userMessage || DEFAULT_MODERATION_MESSAGE
    );
    setModerationCategories(moderationConfig.categories);
    setModerationInitialized(true);
  }, [moderationInitialized, moderationConfig]);
  reactExports.useEffect(() => {
    if (marketplaceFeeInitialized || !marketplaceFeeConfig) return;
    setMarketplaceFeePayout(
      marketplaceFeeConfig.mintlabFeeRecipient ? accountIdToHex(marketplaceFeeConfig.mintlabFeeRecipient) : ""
    );
    setMarketplaceFeeInitialized(true);
  }, [marketplaceFeeInitialized, marketplaceFeeConfig]);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!name.trim()) throw new Error("Main collection name is required");
      if (!symbol.trim()) throw new Error("Main collection symbol is required");
      if (!description.trim())
        throw new Error("Main collection description is required");
      if (!imageUrl) throw new Error("Upload a main collection image");
      const creationPriceE8s = parseICPToE8s(collectionCreationPrice);
      const mainMintPriceE8s = parseICPToE8s(mainMintPrice);
      const cycles = parseWholeBigInt(collectionCanisterCycles);
      if (creationPriceE8s === null)
        throw new Error("Collection creation fee must be a valid ICP amount");
      if (mainMintPriceE8s === null)
        throw new Error("Main mint price must be a valid ICP amount");
      if (cycles === null)
        throw new Error("Collection canister cycles must be a whole number");
      if (collectionCreationEnabled && creationQuote && creationPriceE8s < creationQuote.minimumCreationPriceE8s) {
        throw new Error(
          `Collection creation fee must be at least ${formatICP(
            creationQuote.minimumCreationPriceE8s
          )} ICP at the current cycles rate`
        );
      }
      const creationPayoutRequired = creationQuote ? creationQuote.adminPayoutE8s > 0n : creationPriceE8s > 0n;
      const creationPayout = creationPayoutRequired ? validateAccountId(collectionCreationPayout, "collection creation") : null;
      const mintPayout = mainMintPriceE8s > 0n ? validateAccountId(mainMintPayout, "main mint") : null;
      return actor.configureMinting(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageUrl,
        creationPayout,
        creationPriceE8s,
        collectionCreationEnabled,
        mintPayout,
        mainMintPriceE8s,
        mainMintEnabled,
        mainMintDividendsEnabled,
        cycles
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      ue.success("Mint settings saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const marketplaceFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const recipient = validateAccountId(
        marketplaceFeePayout,
        "Mintlab sales fee"
      );
      return actor.configureMarketplaceFeeRecipient(recipient);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceFeeConfig"]
      });
      ue.success("Marketplace fee payout saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const wasmMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!wasmBytes) throw new Error("Choose a collection canister WASM file");
      await actor.setCollectionCanisterWasm(wasmBytes);
    },
    onSuccess: () => {
      setWasmBytes(null);
      setWasmFileName("");
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      ue.success("Collection canister WASM uploaded");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const moderationMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const apiKey = xaiApiKey.trim() || null;
      const model = moderationModel.trim() || "grok-4.3";
      const message = moderationMessage.trim() || DEFAULT_MODERATION_MESSAGE;
      return actor.configureModeration(
        moderationEnabled,
        apiKey,
        clearXaiApiKey,
        model,
        moderationCategories,
        message
      );
    },
    onSuccess: () => {
      setXaiApiKey("");
      setClearXaiApiKey(false);
      void queryClient.invalidateQueries({ queryKey: ["moderationConfig"] });
      ue.success("Moderation settings saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const upgradeDedicatedCollectionsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded)) {
        throw new Error("Upload the latest collection canister WASM first");
      }
      let updated = 0;
      for (const collection of dedicatedMintlabCollections) {
        const result = await actor.upgradeCollectionCanister(collection.id);
        if (result.__kind__ === "err") {
          throw new Error(`${collection.name}: ${result.err}`);
        }
        updated += 1;
      }
      return updated;
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      ue.success(
        updated === 0 ? "No dedicated collection canisters to update" : `Updated ${updated} collection canister${updated === 1 ? "" : "s"}`
      );
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function validateAccountId(value, label) {
    const trimmed = value.trim();
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      throw new Error(`${label} payout account must be 64 hex characters`);
    }
    return hexToAccountId(trimmed);
  }
  async function handleImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  async function handleWasmFile(file) {
    if (!file) {
      setWasmBytes(null);
      setWasmFileName("");
      return;
    }
    const bytes = await readFileAsBytes(file);
    setWasmBytes(bytes);
    setWasmFileName(`${file.name} (${Math.ceil(bytes.byteLength / 1024)} KB)`);
  }
  function setModerationCategory(key, value) {
    setModerationCategories((current) => ({ ...current, [key]: value }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-accent/20 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Mintlab Collections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Configure the main app collection, user collection launch fees, mint fees, payout accounts, and child collection canister template." })
      ] }),
      mintConfigLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: collectionCreationEnabled ? "default" : "outline",
            children: collectionCreationEnabled ? "Creation on" : "Creation off"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: mainMintEnabled ? "default" : "outline", children: mainMintEnabled ? "Main mint on" : "Main mint off" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: moderationEnabled ? "secondary" : "outline", children: moderationEnabled ? "Moderation on" : "Moderation off" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: (mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "secondary" : "outline",
            children: (mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "WASM ready" : "WASM needed"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-name", children: "Main collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g. Vault Originals",
              "data-ocid": "admin.mint_config.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-symbol", children: "Main collection symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-symbol",
              value: symbol,
              onChange: (e) => setSymbol(e.target.value.toUpperCase()),
              placeholder: "e.g. VLT",
              "data-ocid": "admin.mint_config.symbol_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-description", children: "Main collection description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "mint-description",
            rows: 2,
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Describe the app's main collection...",
            "data-ocid": "admin.mint_config.description_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-image", children: "Main collection image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-image",
              type: "file",
              accept: "image/*",
              onChange: (e) => {
                var _a;
                return void handleImageFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
              },
              "data-ocid": "admin.mint_config.image_file_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
        ] }),
        imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: resolveImageUrl(imageUrl),
            alt: "Main collection preview",
            className: "w-16 h-16 rounded-lg object-cover border border-border"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Marketplace Sales Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Fixed-price and auction sales send 2% of the sale amount to this ICP account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: marketplaceFeeLoading ? "Loading" : `${Number((marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.mintlabFeeBasisPoints) ?? 200n) / 100}% fee` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marketplace-fee-payout", children: "Mintlab sales fee account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "marketplace-fee-payout",
                value: marketplaceFeePayout,
                onChange: (e) => setMarketplaceFeePayout(e.target.value),
                placeholder: "64-character ICP account hex",
                className: "font-mono text-xs",
                "data-ocid": "admin.mint_config.marketplace_fee_payout_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => marketplaceFeeMutation.mutate(),
              disabled: marketplaceFeeMutation.isPending,
              "data-ocid": "admin.mint_config.marketplace_fee_save_button",
              children: [
                marketplaceFeeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                "Save Fee Account"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-foreground mt-1", children: [
              formatICP((marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? 10000n),
              " ICP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Auction escrow fee reserve" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-foreground mt-1", children: [
              formatICP(
                (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.auctionBidFeeReserveE8s) ?? 20000n
              ),
              " ",
              "ICP"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "User Collection Creation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-payout", children: "Creation payout account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "creation-payout",
                value: collectionCreationPayout,
                onChange: (e) => setCollectionCreationPayout(e.target.value),
                placeholder: "64-character ICP account hex",
                className: "font-mono text-xs",
                "data-ocid": "admin.mint_config.creation_payout_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-price", children: "Creation fee (ICP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "creation-price",
                value: collectionCreationPrice,
                onChange: (e) => setCollectionCreationPrice(e.target.value),
                placeholder: "e.g. 1.25",
                "data-ocid": "admin.mint_config.creation_price_input"
              }
            )
          ] }),
          creationQuoteFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Updating cycles quote..." }),
          creationQuoteError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Could not fetch the cycles quote:",
              " ",
              creationQuoteError instanceof Error ? creationQuoteError.message : "Unknown error"
            ] })
          ] }),
          creationQuote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 text-xs space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Converted to cycles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.cycleCostE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Admin receives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.adminPayoutE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "User debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.totalUserDebitE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cycles funded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatCycles(creationQuote.totalCyclesToConvert) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "New canister receives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatCycles(creationQuote.collectionCanisterCycles) })
            ] }),
            creationPriceBelowCycles && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Set at least",
                " ",
                formatICP(creationQuote.minimumCreationPriceE8s),
                " ICP at the current cycles rate."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-enabled", children: "Enable creation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "creation-enabled",
                checked: collectionCreationEnabled,
                onCheckedChange: setCollectionCreationEnabled,
                "data-ocid": "admin.mint_config.creation_enabled_switch"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Main Collection Minting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-payout", children: "Mint payout account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "main-mint-payout",
                value: mainMintPayout,
                onChange: (e) => setMainMintPayout(e.target.value),
                placeholder: "64-character ICP account hex",
                className: "font-mono text-xs",
                "data-ocid": "admin.mint_config.main_payout_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-price", children: "Mint price (ICP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "main-mint-price",
                value: mainMintPrice,
                onChange: (e) => setMainMintPrice(e.target.value),
                placeholder: "e.g. 0.25",
                "data-ocid": "admin.mint_config.main_price_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-enabled", children: "Enable public mint" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "main-mint-enabled",
                checked: mainMintEnabled,
                onCheckedChange: setMainMintEnabled,
                "data-ocid": "admin.mint_config.main_enabled_switch"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-dividends-enabled", children: "Enable dividends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "main-dividends-enabled",
                checked: mainMintDividendsEnabled,
                onCheckedChange: setMainMintDividendsEnabled,
                "data-ocid": "admin.mint_config.main_dividends_switch"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Dedicated Collection Canisters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-cycles", children: "Cycles per new canister" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-cycles",
                inputMode: "numeric",
                value: collectionCanisterCycles,
                onChange: (e) => setCollectionCanisterCycles(e.target.value),
                "data-ocid": "admin.mint_config.collection_cycles_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Values below ",
              formatCycles(MIN_COLLECTION_CANISTER_CYCLES),
              " are raised automatically so the child canister has enough cycles to install its WASM module."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-wasm", children: "Collection canister WASM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-wasm",
                type: "file",
                accept: ".wasm,application/wasm,application/octet-stream",
                onChange: (e) => {
                  var _a;
                  return void handleWasmFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "admin.mint_config.wasm_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: wasmFileName || ((mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "A collection canister template is stored" : "Upload src/backend/dist/collection_nft.wasm after build") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "secondary",
              onClick: () => upgradeDedicatedCollectionsMutation.mutate(),
              disabled: upgradeDedicatedCollectionsMutation.isPending || !(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded),
              className: "gap-2",
              "data-ocid": "admin.mint_config.upgrade_dedicated_wasms_button",
              children: [
                upgradeDedicatedCollectionsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                "Update Existing Canisters"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => wasmMutation.mutate(),
              disabled: !wasmBytes || wasmMutation.isPending,
              className: "gap-2",
              "data-ocid": "admin.mint_config.wasm_submit_button",
              children: [
                wasmMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15 }),
                "Upload WASM"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15, className: "text-primary" }),
              "xAI Upload Moderation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Checks collection and NFT titles, descriptions, and uploaded JPG/PNG images before any ICP transfer is attempted." })
          ] }),
          moderationConfigLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "secondary" : "outline",
              children: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "xAI key set" : "No key"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-api-key", children: "xAI API key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "moderation-api-key",
                type: "password",
                value: xaiApiKey,
                onChange: (e) => {
                  setXaiApiKey(e.target.value);
                  if (e.target.value.trim()) setClearXaiApiKey(false);
                },
                placeholder: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "Leave blank to keep current key" : "xai-...",
                "data-ocid": "admin.moderation.api_key_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-model", children: "xAI model" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "moderation-model",
                value: moderationModel,
                onChange: (e) => setModerationModel(e.target.value),
                placeholder: "grok-4.3",
                "data-ocid": "admin.moderation.model_input"
              }
            )
          ] })
        ] }),
        (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-clear-key", children: "Clear stored xAI key on save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "moderation-clear-key",
              checked: clearXaiApiKey,
              onCheckedChange: (checked) => {
                setClearXaiApiKey(checked);
                if (checked) setXaiApiKey("");
              },
              "data-ocid": "admin.moderation.clear_key_switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-enabled", children: "Enable moderation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "moderation-enabled",
              checked: moderationEnabled,
              onCheckedChange: setModerationEnabled,
              "data-ocid": "admin.moderation.enabled_switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: moderationCategoryLabels.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `moderation-${category.key}`,
                  className: "text-xs",
                  children: category.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: `moderation-${category.key}`,
                  checked: moderationCategories[category.key],
                  onCheckedChange: (checked) => setModerationCategory(category.key, checked),
                  "data-ocid": `admin.moderation.category.${category.key}`
                }
              )
            ]
          },
          category.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-message", children: "User policy message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "moderation-message",
              rows: 3,
              value: moderationMessage,
              onChange: (e) => setModerationMessage(e.target.value),
              "data-ocid": "admin.moderation.message_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            onClick: () => moderationMutation.mutate(),
            disabled: moderationMutation.isPending,
            className: "gap-2",
            "data-ocid": "admin.moderation.submit_button",
            children: moderationMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }),
              "Saving..."
            ] }) : "Save Moderation"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => saveMutation.mutate(),
          disabled: saveMutation.isPending,
          className: "gap-2",
          "data-ocid": "admin.mint_config.submit_button",
          children: saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }),
            "Saving..."
          ] }) : "Save Mint Settings"
        }
      ) })
    ] })
  ] });
}
const defaultForm = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  otherStandard: "",
  imageUrl: ""
};
function AddCollectionForm({ onSuccess }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState(defaultForm);
  const [errors, setErrors] = reactExports.useState({});
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [imageFileInputKey, setImageFileInputKey] = reactExports.useState(0);
  const [previewImg, setPreviewImg] = reactExports.useState("");
  const [previewError, setPreviewError] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(true);
  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!actor) throw new Error("Backend not ready");
      const principal = Principal.fromText(values.canisterId);
      const standard = makeStandard(values.standard, values.otherStandard);
      return actor.addCollection(
        values.name,
        values.description,
        principal,
        standard,
        values.imageUrl,
        values.symbol,
        null
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success("Collection added successfully!");
      setForm(defaultForm);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      setPreviewImg("");
      setErrors({});
      onSuccess();
    },
    onError: (err) => {
      ue.error(`Failed to add collection: ${extractError(err)}`);
    }
  });
  function validate(imageValue) {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.symbol.trim()) e.symbol = "Symbol is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.canisterId.trim()) {
      e.canisterId = "Canister ID is required";
    } else if (!isValidPrincipal(form.canisterId.trim())) {
      e.canisterId = "Invalid principal format";
    }
    if (!imageValue) {
      e.imageUrl = "Upload a collection image or add an image URL";
    } else if (imageValue.length > MAX_ON_CHAIN_IMAGE_CHARS) {
      e.imageUrl = "Collection image is too large for on-chain storage";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const imageValue = (imageDataUrl || form.imageUrl).trim();
    if (!validate(imageValue)) return;
    mutation.mutate({ ...form, imageUrl: imageValue });
  }
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  }
  function setImageUrl(value) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    set("imageUrl", value);
  }
  async function handleCollectionImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      set("imageUrl", "");
      setPreviewImg(dataUrl);
      setPreviewError(false);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  function handleImageBlur() {
    setPreviewError(false);
    setPreviewImg(form.imageUrl.trim());
  }
  const previewImage = imageDataUrl || previewImg;
  const previewImageUrl = resolveImageUrl(previewImage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardHeader,
      {
        className: "cursor-pointer select-none pb-3",
        onClick: () => setExpanded((v) => !v),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Add New Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Manually curate a supported ICP NFT collection into Mintlab" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 16,
              className: `text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`
            }
          )
        ] })
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-name", children: [
            "Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-name",
              placeholder: "e.g. Bored Apes ICP",
              value: form.name,
              onChange: (e) => set("name", e.target.value),
              "data-ocid": "admin.add_collection.name_input"
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.name_field_error",
              children: errors.name
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-symbol", children: [
            "Symbol ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-symbol",
              placeholder: "e.g. BAPE",
              value: form.symbol,
              onChange: (e) => set("symbol", e.target.value.toUpperCase()),
              "data-ocid": "admin.add_collection.symbol_input"
            }
          ),
          errors.symbol && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.symbol_field_error",
              children: errors.symbol
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-desc", children: [
          "Description ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "col-desc",
            placeholder: "Brief description of the collection…",
            rows: 2,
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            "data-ocid": "admin.add_collection.description_textarea"
          }
        ),
        errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "admin.add_collection.description_field_error",
            children: errors.description
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-canister", children: [
            "Canister ID ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-canister",
              placeholder: "e.g. rrkah-fqaaa-aaaaa-aaaaq-cai",
              value: form.canisterId,
              onChange: (e) => set("canisterId", e.target.value),
              className: "font-mono text-sm",
              "data-ocid": "admin.add_collection.canister_id_input"
            }
          ),
          errors.canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.canister_id_field_error",
              children: errors.canisterId
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-standard", children: [
            "NFT Standard ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.standard,
              onValueChange: (v) => set("standard", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "col-standard",
                    "data-ocid": "admin.add_collection.standard_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select standard" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EXT", children: "EXT (Entrepot)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DIP721", children: "DIP721" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ICRC7", children: "ICRC-7" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                ] })
              ]
            }
          ),
          form.standard === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Custom standard name",
              value: form.otherStandard,
              onChange: (e) => set("otherStandard", e.target.value),
              className: "mt-1.5",
              "data-ocid": "admin.add_collection.other_standard_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Most Entrepot collections use EXT. Modern ICP NFT ledgers may use ICRC-7 instead." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-image-file", children: [
          "Collection image ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "col-image-file",
                type: "file",
                accept: "image/*",
                onChange: (e) => {
                  var _a;
                  return void handleCollectionImageFile(
                    ((_a = e.target.files) == null ? void 0 : _a[0]) ?? null
                  );
                },
                "data-ocid": "admin.add_collection.image_file_input"
              },
              imageFileInputKey
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "col-image",
                className: "text-xs text-muted-foreground",
                children: "Or image URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "col-image",
                placeholder: "https://… or ipfs://…",
                value: form.imageUrl,
                onChange: (e) => setImageUrl(e.target.value),
                onBlur: handleImageBlur,
                "data-ocid": "admin.add_collection.image_url_input"
              }
            ),
            errors.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "admin.add_collection.image_url_field_error",
                children: errors.imageUrl
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0", children: previewImageUrl && !previewError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: previewImageUrl,
              alt: "Preview",
              className: "w-full h-full object-cover",
              onError: () => setPreviewError(true)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16, className: "text-muted-foreground" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: mutation.isPending,
          "data-ocid": "admin.add_collection.submit_button",
          className: "gap-2",
          children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
            "Adding…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            "Add Collection"
          ] })
        }
      ) })
    ] }) })
  ] });
}
function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching
  });
  const removeMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not ready");
      const ok = await actor.removeCollection(id);
      if (!ok) throw new Error("Collection could not be removed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success("Collection removed.");
    },
    onError: (err) => {
      ue.error(`Failed to remove collection: ${extractError(err)}`);
    }
  });
  const redirected = reactExports.useRef(false);
  if (!adminLoading && !isAdmin && !redirected.current) {
    redirected.current = true;
    void navigate({ to: "/wallet" });
    return null;
  }
  const isLoading = adminLoading || collectionsLoading;
  const count = (collections == null ? void 0 : collections.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "admin.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage Mintlab settings and collection curation" })
          ] }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: count === 1 ? "collection" : "collections" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddCollectionForm, { onSuccess: () => {
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MintConfigForm, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSetupGuide, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Registered Collections" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-2",
              "data-ocid": "admin.collections.loading_state",
              children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i))
            }
          ) : count === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border bg-muted/20",
              "data-ocid": "admin.collections.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 40, className: "text-muted-foreground/40 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "No collections yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Use the form above to register the first NFT collection." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "admin.collections.list", children: collections.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectionRow,
            {
              collection: col,
              index: i + 1,
              onRemove: (id) => removeMutation.mutate(id)
            },
            col.id.toString()
          )) })
        ] })
      ]
    }
  );
}
export {
  AdminPage as default
};
